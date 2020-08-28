package main

import (
	"fmt"
	"net/http"
	"github.com/Gravity-Hub-Org/register-helper/v2/controller"
)

const port = "8091"

func main () {

	rc := &controller.ResponseController{}

	http.HandleFunc("/handle-pass", rc.HandlePass)
	http.HandleFunc("/generate-keys", rc.GenerateKeys)

	fmt.Printf("Listening on port: %s\n", port)
	_ = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}