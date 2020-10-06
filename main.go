package main

import (
	"fmt"
	"flag"
	"net/http"
	"github.com/Gravity-Hub-Org/register-helper/v2/controller"
)

var port string

func init() {
	flag.StringVar(&port, "port", "8111", "Service port")

	flag.Parse()
}

func main () {
        frontend := http.FileServer(http.Dir("./frontend/build"))
        http.Handle("/", frontend)

	stateController := (&controller.StateController{}).New()
	rc := (&controller.ResponseController{}).New(stateController)

	http.HandleFunc("/generate-keys", rc.GenerateKeys)
	http.HandleFunc("/state", rc.ApplicationState)
	http.HandleFunc("/download", rc.DownloadWallet)

	fmt.Printf("Register Helper is listening on port: %s\n", port)
	_ = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
