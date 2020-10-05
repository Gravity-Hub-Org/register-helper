package controller

import (
	"fmt"
)

type AppState int

const (
	Initialised AppState = iota
	DeployProcessing
	Generated
)

type StateController struct {
	State AppState
}

func (sc *StateController) New() *StateController {
	return &StateController { State: Initialised }
}

func (sc *StateController) Message() string {
	switch sc.State {
	case Initialised:
		return "Keys generator is initialised"
	case DeployProcessing:
		return "Node deploy is in process!"
	case Generated:
		return "Node is deployed."
	}

	return ""
} 

func (sc *StateController) Increment() (error, AppState) {
	if sc.State == Generated {
		return fmt.Errorf("Error occured. Keys generated already."), Generated
	}

	sc.State = Generated

	return nil, sc.State
}