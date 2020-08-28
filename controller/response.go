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
	privateKeysHashMap map[string]*rsa.PrivateKey
}

func (rc *ResponseController) ValidateLogin (w http.ResponseWriter, req *http.Request) {

}

func addHeaders(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Headers", "*")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
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

func (rc *ResponseController) HandlePass (w http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" { return }

	password := func () string {
		var requestBody struct {
			Password string `json:"password"`
		}

		_ = json.NewDecoder(req.Body).Decode(&requestBody)

		return requestBody.Password
	}()

	if password == "" {
		fmt.Printf("No pass provided")
		return
	}

	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	marshalledPrivateKey, _ := PrivateKeyToEncryptedPEM(privateKey, password)

	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Content-Disposition", "inline")
	w.Header().Set("filename", fmt.Sprintf("private_key_%v", time.Now().Format(time.RFC822)))

	addHeaders(&w)

	_, _ = fmt.Fprint(w, marshalledPrivateKey)
}