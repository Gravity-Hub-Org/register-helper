import React from "react";
import styled from "styled-components";
import { AppColor } from "../styled/global";
import { Input, InputTitle } from "../base/Input";
import { GradientButton } from "../base/Button";
import SimpleTable, { mapGeneratedKeysToTable } from "./Table";


function KeysTable() {
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
    </div>
  );
}

export default KeysTable;
