package controller

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
)

var gravityHome = os.Getenv("GRAVITY_HOME")


type CommandController struct {}

func (controller *CommandController) home() string {
	if gravityHome == "" {
		return "/etc/gravity"
	}

	return gravityHome
}

func (controller *CommandController) InitLedger() (error, *Keys) {
	var err error

	// Init ledger
	initLedgerCmd := exec.Command("gravity", "ledger", "--home", controller.home(), "init")
	err = initLedgerCmd.Run()

	if err != nil {
		return err, nil
	}

	privKeyFilePath := fmt.Sprintf("%v/privKey.json", controller.home())
	privKeyFile, err := os.Open(privKeyFilePath)

	if err != nil {
		return err, nil
	}

	privKeyFileBytes, err := ioutil.ReadAll(privKeyFile)

	if err != nil {
		return err, nil
	}

	var config Keys

	err = json.Unmarshal(privKeyFileBytes, &config)

	return nil, &config
}

func (controller *CommandController) RunLedger() (error, int) {
	var err error

	// Start ledger
	startLedgerCmd := exec.Command(
		"gravity", "ledger",
		"--home", controller.home(), "start",
		"--rpc", "127.0.0.1:2500",
		"--bootstrap", "http://127.0.0.1:26657",
	)

	err = startLedgerCmd.Run()

	if err != nil {
		return err, 1
	}

	return nil, 0
}
