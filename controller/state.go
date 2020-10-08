package controller

import "fmt"

type AppState int

const (
	Initialised AppState = iota
	Generated
	Deployed
)

type StateController struct {
	State AppState
	GeneratedWallet *Keys
	WalletPassword string
}

func (sc *StateController) New() *StateController {
	return &StateController { State: Initialised }
}

func (sc *StateController) Message() string {
	switch sc.State {
	case Initialised:
		return "Keys generator is initialised"
	case Deployed:
		return "Node is deployed!"
	case Generated:
		return "Node keys generated."
	}

	return ""
} 

func (sc *StateController) OnKeysGenerated() (error, AppState) {
	if sc.State == Initialised {
		sc.State = Generated
		return nil, Generated
	}

	return fmt.Errorf("keys generated already"), sc.State
}

func (sc *StateController) OnDeployStart() (error, AppState) {
	if sc.State == Generated || sc.State == Deployed  {
		sc.State = Deployed
		return nil, Deployed
	}

	return fmt.Errorf("can't deploy node. Keys are not generated"), sc.State
}