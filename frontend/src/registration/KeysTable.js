import React from "react";
import styled from "styled-components";
import { AppColor } from "../styled/global";
import { Input, InputTitle } from "../base/Input";
import { GradientButton, GradientLink } from "../base/Button";
import SimpleTable, { mapGeneratedKeysToTable } from "./Table";
import { downloadGeneratedKeys, baseURL } from '../services/base'

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;

  padding: 25px;
`;

function KeysTable(props) {
  const { onNext, appState = {}, isAppStateEmpty, form } = props;
  const { password } = form;
  const [tableDataSource, setTableDataSource] = React.useState(null);
  const { value: applicationState, message: applicationStateMessage } = appState

  const onDownloadKeys = async () => {
    try {
      await downloadGeneratedKeys(password)
    } catch (err) {
      console.log({ err })
    }
  }

  React.useEffect(() => {
    if (tableDataSource) return;
    if (isAppStateEmpty) return;
    if (applicationState !== 0) { return }

    (async () => {
      try {
        const td = await mapGeneratedKeysToTable(password);
        setTableDataSource(td);
      } catch (err) {
        console.log({ err })
      }
    })();
  }, [tableDataSource, applicationState]);

  if (!tableDataSource) {
    return "Loading...";
  }

  return (
    <div>
      <SimpleTable tableData={tableDataSource} />
      <ButtonsContainer>
        <GradientLink target="_blank" download href={`${baseURL}/download?password=${password}`}>Get Private Keys</GradientLink>
        <GradientButton onClick={onNext}>Deploy Node</GradientButton>
      </ButtonsContainer>
    </div>
  );
}

export default KeysTable;
