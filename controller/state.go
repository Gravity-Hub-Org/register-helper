package controller

import (
	"fmt"
)

type AppState int

const (
	Initialised AppState = iota
	Generated
)

type StateController struct {
	State AppState
}

func (sc *StateController) New() *StateController {
	return &StateController { State: Initialised }
}

func (sc *StateController) Increment() (error, AppState) {
	if sc.State == Generated {
		return fmt.Errorf("Error occured. Keys generated already."), Generated
	}

	sc.State = Generated

	return nil, sc.State
}