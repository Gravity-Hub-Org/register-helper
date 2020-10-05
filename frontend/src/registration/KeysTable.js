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
  const { onNext } = props;
  const [tableDataSource, setTableDataSource] = React.useState(null);

  React.useEffect(() => {
    if (tableDataSource) return;

    (async () => {
      const td = await mapGeneratedKeysToTable();
      setTableDataSource(td);
    })();
  });

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
