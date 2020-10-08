package main

import (
	"fmt"
	"flag"
	"net/http"
	"github.com/Gravity-Hub-Org/register-helper/v2/controller"
)

var port string
var isDebug bool

func init() {
	flag.StringVar(&port, "port", "8111", "Service port")
	flag.BoolVar(&isDebug, "debug", false, "is debug mode enabled")

	flag.Parse()
}

func main () {
	frontend := http.FileServer(http.Dir("./frontend/build"))
	http.Handle("/", frontend)

	fmt.Printf("is debug: %v \n", isDebug)

	stateController := (&controller.StateController{}).New()
	rc := (&controller.ResponseController{}).New(stateController, isDebug)

	http.HandleFunc("/generate-keys", rc.GenerateKeys)
	http.HandleFunc("/state", rc.ApplicationState)
	http.HandleFunc("/download", rc.DownloadWallet)
	http.HandleFunc("/run", rc.RunLedger)

	fmt.Printf("Register Helper is listening on port: %s\n", port)
	_ = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
