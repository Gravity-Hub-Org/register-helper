import React, { useState } from "react";
import axios from "axios";
import { TransitionsModal } from "./Modal";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AppContainer from "./base/App";

import EnterPassword from "./registration/EnterPassword";
import DeploymentSuccess from "./registration/DeploymentSuccess";
import KeysTable from "./registration/KeysTable";
import { HeadingTitle } from "./base/Title";

import logo from "./logo.svg";
import "./App.css";

import { requestKeyGeneration, requestGeneratedKeys } from "./services";

function App() {
  const [stepState, setStepState] = useState(1);
  const [formState, setFormState] = useState({ password: "" });
  const [fileState, setFileState] = useState({});
  const [tableDataState, setTableDataState] = useState({});

  const handlePassword = (event) => {
    setFormState({
      password: event.target.value,
    });
  };

  const handleNextStep = () => {
    // setTableDataState(td);
    // setStepState(2);

    // switch (stepState) {
    //   case 0:
    //     setStepState(1);
    //     break
    //   case 1:
    //     setStepState(2);
    //     break
    // }

    setStepState(stepState + 1)
  };

  const handlePasswordUpdate = password => {
    setFormState({ password })
  }

  const stepsMap = {
    [0]: <EnterPassword onNext={handleNextStep} onPasswordUpdate={handlePasswordUpdate} />,
    // [1]: (
    //   <>
    //     <a href={fileState.href} download={"privkey"}>
    //       <Button variant="contained" color="primary">
    //         Download Pair
    //       </Button>
    //     </a>
    //   </>
    // ),
    [1]: <KeysTable />,
    // [2]: <DeploymentSuccess />,
    // [2]: (
    //   <>
    //     <SimpleTable tableData={tableDataState} />
    //   </>
    // ),
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
