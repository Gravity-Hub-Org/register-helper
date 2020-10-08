package controller

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"github.com/alexmullins/zip"
	"os"
)

type ResponseController struct {
	isDebug bool
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

func (rc *ResponseController) New(stateDelegate *StateController, isDebug bool) *ResponseController {
	controller := &ResponseController{}
	controller.stateDelegate = stateDelegate
	controller.isDebug = isDebug
	return controller
}

func handleOptionsRequest(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
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
	(*w).Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
	//(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT")
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
	return &GeneratorController{
		commandDelegate: &CommandController{},
	}
}

func (rc *ResponseController) GenerateKeys (w http.ResponseWriter, req *http.Request) {
	addHeaders(&w)

	if req.Method == "OPTIONS" {
		handleOptionsRequest(w)
		return
	}

	password := extractPasswordFromRequest(req).Password

	if password == "" {
		passError(w, "No password provided! Provide password.")
		return
	}

	incrementErr, _ := rc.stateDelegate.OnKeysGenerated()

	if incrementErr != nil {
		passError(w, incrementErr.Error())
		return
	}

	result := rc.keysGenerator().Generate(rc.isDebug)
	rc.stateDelegate.GeneratedWallet = result
	rc.stateDelegate.WalletPassword = password

	marshalledResult, _ := json.Marshal(result)

	_, _ = fmt.Fprint(w, string(marshalledResult))
}

func (rc *ResponseController) DownloadWallet (w http.ResponseWriter, req *http.Request) {
	addHeaders(&w)

	if req.Method != "GET" { return }

	password := req.URL.Query().Get("password")

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

	marshalledData := rc.stateDelegate.GeneratedWallet.Bytes()

	contents := marshalledData
	fzip, err := os.Create(`./gravity_wallet.zip`)

	os.Chmod(`./gravity_wallet.zip`, 0777)

	if err != nil {
		log.Fatalln(err)
	}
	zipw := zip.NewWriter(fzip)
	writer, err := zipw.Encrypt(`gravity_wallet.json`, password)
	if err != nil {
		log.Fatal(err)
	}

	_, err = io.Copy(writer, bytes.NewReader(contents))
	if err != nil {
		log.Fatal(err)
	}

	zipw.Close()

	archiveBytes, _ := ioutil.ReadFile("gravity_wallet.zip")

	filename := "gravity_wallet.zip"
	contentDisposition := fmt.Sprintf("attachment; filename=\"%v\"", filename)

	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", contentDisposition)

	_, _ = w.Write(archiveBytes)
}

func (rc *ResponseController) ApplicationState (w http.ResponseWriter, req *http.Request) {
	if req.Method != "GET" { return }

	addHeaders(&w)

	stateMessage := rc.stateDelegate.Message()
	message := &commonMessageResponse{ Value: rc.stateDelegate.State, Message: stateMessage }
	result, _ := json.Marshal(message)

	_, _ = fmt.Fprint(w, string(result))
}

func (rc *ResponseController) RunLedger (w http.ResponseWriter, req *http.Request) {
	addHeaders(&w)

	if req.Method != "GET" { return }

	incrementErr, _ := rc.stateDelegate.OnDeployStart()

	if incrementErr != nil {
		passError(w, incrementErr.Error())
		return
	}

	var err error

	if !rc.isDebug {
		err, _ = rc.keysGenerator().commandDelegate.RunLedger()

		if err != nil {
			message := &commonMessageResponse{ Value: nil, Message: "Error occured on ledger start" }
			result, _ := json.Marshal(message)
			_, _ = fmt.Fprint(w, string(result))
			return
		}
	}

	result, _ := json.Marshal(&commonMessageResponse{ Value: nil, Message: "Node is deployed!" })
	_, _ = fmt.Fprint(w, string(result))
}