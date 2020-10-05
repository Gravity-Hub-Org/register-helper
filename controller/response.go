package controller

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"net/http"
	"time"
)

type ResponseController struct {
	stateDelegate *StateController
	privateKeysHashMap map[string]*rsa.PrivateKey
}

type commonMessageResponse struct {
	Message string `json:"message"`
	Value interface{} `json:"value"`
}
type errorResponse struct {
	Message string `json:"message"`
}
type walletPassword struct {
	Password string `json:"password"`
}

func extractPasswordFromRequest(req *http.Request) *walletPassword {
	var requestBody walletPassword

	_ = json.NewDecoder(req.Body).Decode(&requestBody)

	return &requestBody
}

func (rc *ResponseController) New(stateDelegate *StateController) *ResponseController {
	controller := &ResponseController{}
	controller.stateDelegate = stateDelegate
	return controller
}


func passError(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusBadRequest)
	result, _ := json.Marshal(&errorResponse{ Message: message })

	_, _ = fmt.Fprint(w, string(result))

	return
}

func addHeaders(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Content-Type", "application/json")
	//(*w).Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
	//(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	//(*w).Header().Set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT")
}

func PrivateKeyToEncryptedPEM(key *rsa.PrivateKey, pwd string) ([]byte, error) {
	// Convert it to pem
	var err error

	block := &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(key),
	}

	// Encrypt the pem
	if pwd != "" {
		block, err = x509.EncryptPEMBlock(rand.Reader, block.Type, block.Bytes, []byte(pwd), x509.PEMCipherAES256)
		if err != nil {
			return nil, err
		}
	}

	return pem.EncodeToMemory(block), nil
}

func (rc *ResponseController) keysGenerator () *GeneratorController {
	return &GeneratorController{}
}

func (rc *ResponseController) GenerateKeys (w http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" { return }

	password := extractPasswordFromRequest(req).Password

	if password == "" {
		passError(w, "No password provided! Provide password.")
		return
	}

	addHeaders(&w)

	incrementErr, _ := rc.stateDelegate.Increment()

	if incrementErr != nil {
		passError(w, incrementErr.Error())
		return
	}

	result := rc.keysGenerator().Generate()
	rc.stateDelegate.GeneratedWallet = result
	rc.stateDelegate.WalletPassword = password

	marshalledResult, _ := json.Marshal(result)

	_, _ = fmt.Fprint(w, string(marshalledResult))
}

func (rc *ResponseController) DownloadWallet (w http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" { return }

	addHeaders(&w)

	password := extractPasswordFromRequest(req).Password

	if password == "" {
		passError(w, "No password provided! Provide password.")
		return
	}

	if password != rc.stateDelegate.WalletPassword {
		passError(w, "Wrong wallet password.")
		return 
	}

	if rc.stateDelegate.State == Initialised {
		passError(w, "No keys generated yet.")
		return
	}

	marshalledData, _ := json.Marshal(rc.stateDelegate.GeneratedWallet)

	w.Header().Set("Content-Type", "octet/stream")
	w.Header().Set("Filename", fmt.Sprintf("gravity_wallet_%v", time.Now().Format(time.RFC822)))

	_, _ = fmt.Fprint(w, marshalledData)
}

func (rc *ResponseController) ApplicationState (w http.ResponseWriter, req *http.Request) {
	if req.Method != "GET" { return }

	addHeaders(&w)

	stateMessage := rc.stateDelegate.Message()
	message := &commonMessageResponse{ Value: rc.stateDelegate.State, Message: stateMessage }
	result, _ := json.Marshal(message)

	_, _ = fmt.Fprint(w, string(result))
}