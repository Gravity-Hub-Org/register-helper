import React, { useState } from "react";
import axios from "axios";
import { TransitionsModal } from './Modal'

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SimpleTable from './Table'


import logo from "./logo.svg";
import "./App.css";

import { requestKeyGeneration, requestGeneratedKeys } from './services'

function App() {
  const [stepState, setStepState] = useState(0);
  const [formState, setFormState] = useState({ password: "" });
  const [fileState, setFileState] = useState({});
  const [tableDataState, setTableDataState] = useState({})

  const handlePassword = (event) => {
    setFormState({
      password: event.target.value,
    });
  };

  // const handleGenerateKey = async () => {
  //   const { data, contentType, filename } = await requestKeyGeneration(formState.password);

  //   const file = new Blob([data], { type: contentType });

  //   setFileState({ href: URL.createObjectURL(file), download: filename });

  //   // setStepState(stepState === 0 ? 1 : 0);
  //   if (stepState === 0) {
  //     setStepState(2);
  //   }
  //   if (stepState === 1) {
  //     setStepState(2)
  //   }
  // };

  const handleGenerateKeys = async () => {
    const data = await requestGeneratedKeys()

    // "address": "3P8ezH84H2VXevmwqvu18fWsnkpdBkmH6JY",
    //     "private_key": "7WapAHBYYNH7npsRxzkWz2vLa64DBAaZHr6tQjtL8hjY",
    //     "public_key": "99V2Wq2yDCoxr9VorwuEFaEEj5FGxpacixFHTeDACh3u",
    //     "seed":
    const td = {
      heading: ['', 'Address', 'Private Key', 'Public Key', 'Seed'],
      rows: [
        { ...data.eth, name: 'ETH'},
        { ...data.waves, name: 'WAVES'},
      ]
    }

    setTableDataState(td)
    setStepState(2);
  }

  const stepsMap = {
    [0]: (
      <>
        {/* <TextField
          id="standard-uncontrolled"
          label="Enter password"
          margin="normal"
          value={formState.password}
          onChange={handlePassword}
        /> */}
        <Button variant="contained" color="primary" onClick={handleGenerateKeys}>
          Generate Keys
        </Button>
      </>
    ),
    [1]: (
      <>
        <a href={fileState.href} download={'privkey'}>
          <Button variant="contained" color="primary">
            Download Pair
          </Button>
        </a>
      </>
    ),
    [2]: (
      <>
        <SimpleTable tableData={tableDataState}/>
      </>
    )
  };

  const currentStep = stepsMap[stepState];

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <header className="App-header">
        <h1 className='main-h'>Gravity Node Keys Generator</h1>
        <div className="vertical-flex">{currentStep}</div>
      </header>
    </div>
  );
}

export default App;
