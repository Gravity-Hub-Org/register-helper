import React from "react";
import styled from "styled-components";
import { AppColor } from "../styled/global";
import { Input, InputTitle } from "../base/Input";
import { GradientButton } from "../base/Button";
import SimpleTable, { mapGeneratedKeysToTable } from "./Table";

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;

  padding: 25px;
`;

function KeysTable(props) {
  const { onNext, appState = {}, isAppStateEmpty } = props;
  const [tableDataSource, setTableDataSource] = React.useState(null);
  const { value: applicationState, message: applicationStateMessage } = appState

  React.useEffect(() => {
    if (tableDataSource) return;
    if (isAppStateEmpty) return;
    if (applicationState !== 0) { return }

    (async () => {
      try {
        const td = await mapGeneratedKeysToTable();
        setTableDataSource(td);
      } catch (err) {
        console.log({ err })
      }
    })();
  }, [tableDataSource, applicationState]);

  if (applicationState !== 0) {
    return applicationStateMessage || null
  }

  if (!tableDataSource) {
    return "Loading...";
  }

  return (
    <div>
      <SimpleTable tableData={tableDataSource} />
      <ButtonsContainer>
        <GradientButton>Get Private Keys</GradientButton>
        <GradientButton onClick={onNext}>Next</GradientButton>
      </ButtonsContainer>
    </div>
  );
}

export default KeysTable;
