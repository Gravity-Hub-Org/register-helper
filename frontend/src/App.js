import React, { useState } from "react";
// import axios from "axios";
import { TransitionsModal } from "./Modal";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AppContainer from "./base/App";

import EnterPassword from "./registration/EnterPassword";
// import DeploymentSuccess from "./registration/DeploymentSuccess";
import KeysTable from "./registration/KeysTable";
import { HeadingTitle } from "./base/Title";

import logo from "./logo.svg";
import "./App.css";

import { requestKeyGeneration, requestGeneratedKeys, fetchKeyGeneratorState } from "./services/base";


function App() {
  const [applicationStateData, setApplicationStateData] = useState({})

  const [stepState, setStepState] = useState(0);
  const [formState, setFormState] = useState({ password: "" });
  const [fileState, setFileState] = useState({});
  const [tableDataState, setTableDataState] = useState({});

  const isAppStateEmpty = Object.keys(applicationStateData) === 0
  const { value: applicationState, message: applicationStateMessage } = applicationStateData

  const onNextStepError = (message) => {
    alert(message)
  }

  const checkForError = () => {
    if (applicationState === 1 || applicationState === 2) {
      onNextStepError(applicationStateMessage)
    }
  }

  const fetchState = async () => {
    try {
      const appStateData = await fetchKeyGeneratorState()
      const { value: appState, message: appStateMessage } = appStateData
      // console.log({ appState, appStateMessage })

      setApplicationStateData(appStateData)
    } catch(err) { console.log({ err }) } 
  }

  React.useEffect(() => {
    if (applicationState === 1 || applicationState === 2) {
      setStepState(1)
    } 
  }, [applicationState])

  React.useEffect(() => {
    fetchState()
  }, [])


  React.useEffect(() => {
    checkForError()
  }, [applicationState])

  const handlePassword = (event) => {
    setFormState({
      password: event.target.value,
    });
  };

  const handleNextStep = () => {
    if (applicationState === 1 || applicationState === 2) {
      checkForError()
      return
    }

    setStepState(stepState + 1)
  };

  const handlePasswordUpdate = password => {
    setFormState({ password })
  }

  const stepsMap = {
    [0]: <EnterPassword onNext={handleNextStep} onPasswordUpdate={handlePasswordUpdate} />,
    [1]: <KeysTable onNext={handleNextStep} appState={applicationStateData} isAppStateEmpty={isAppStateEmpty} />,
  };

  const currentStep = stepsMap[stepState];

  return (
    <AppContainer>
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Orbitron:400,500,600,700,800,900|Poppins:100,200,300,400,500,600,700,800,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <header className="App-header">
          <HeadingTitle>Gravity Node Keys Generator</HeadingTitle>
          <div>{currentStep}</div>
        </header>
      </div>
    </AppContainer>
  );
}

export default App;
