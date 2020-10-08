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

import { downloadGeneratedKeys, requestGeneratedKeys, fetchKeyGeneratorState, requestNodeDeployment } from "./services/base";


function App() {
  const [applicationStateData, setApplicationStateData] = useState({})

  const [stepState, setStepState] = useState(0);
  const [formState, setFormState] = useState({ password: "" });
  const [fileState, setFileState] = useState({});
  const [tableDataState, setTableDataState] = useState({});

  const isAppStateEmpty = Object.keys(applicationStateData) === 0
  const { password: currentPassword } = formState

  const { value: applicationState, message: applicationStateMessage } = applicationStateData

  const enterPasswordTitle = !isAppStateEmpty && [1,2].includes(applicationState) && "Download Keys Pair" || "Next"

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

      setApplicationStateData(appStateData)
    } catch(err) { console.log({ err }) } 
  }

  React.useEffect(() => {
    fetchState()
  }, [])

  console.log({ form: formState })
  console.log({ currentPassword })

  React.useEffect(() => {
    checkForError()
  }, [applicationState])

  const handlePassword = (event) => {
    setFormState({
      password: event.target.value,
    });
  };

  const handleNextStep = async () => {
    console.log({ applicationState, stepState, formState })

    if (stepState === 1) {
      // checkForError()
      try {
        const deployResult = await requestNodeDeployment()

        const { message } = deployResult
        alert(message)
      } catch (err) {
        alert(err.message)
      }

      return
    }
    if (stepState === 2) {
      // checkForError()
      try {
        const appStateData = await fetchKeyGeneratorState()

        const { message } = appStateData
        alert(message)
      } catch (err) {
        alert(err.message)
      }

      return
    }

    if (stepState === 0) {
      setStepState(stepState + 1)
    } else {
      checkForError()
    }
  };

  const handlePasswordUpdate = password => {
    setFormState({ password })
  }

  const stepsMap = {
    [0]: <EnterPassword onNext={handleNextStep} appState={applicationStateData} onPasswordUpdate={handlePasswordUpdate} title={enterPasswordTitle}/>,
    [1]: <KeysTable onNext={handleNextStep} appState={applicationStateData} isAppStateEmpty={isAppStateEmpty} form={formState}/>,
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
