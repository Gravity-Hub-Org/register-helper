package main

import (
	"fmt"
	"net/http"
	"./controller"
)

const port = "8091"

func main () {

	rc := &controller.ResponseController{}

	http.HandleFunc("/handle-pass", rc.HandlePass)

	fmt.Printf("Listening on port: %s\n", port)
	_ = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}