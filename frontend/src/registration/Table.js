import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { AppColor, AppFonts } from "../styled/global";
import { requestGeneratedKeys } from "../services/base";

import wavesLogo from '../logos/waves.svg'
import ledgerLogo from '../logos/ledger.svg'
import ethereumLogo from '../logos/ethereum.svg'

const borderRadius = "6px";
const TableContainer = styled.div`
  width: calc(100vw - 12px);
  overflow-x: unset !important;

  & table {
    width: calc(100vw - 120px);
    border-radius: 6px;
  }

  & * {
    font-family: ${AppFonts.baseText} !important;
    color: white !important;
  }

  & tr {
    height: 42px;
    width: 100%;
  }

  & thead td:first-child {
    width: 300px;
  }

  & thead td {
    padding: 0;
    background-color: ${AppColor.table.heading};
  }

  & tbody td {
    border: none;
    padding: 0;
    background-color: ${AppColor.table.body};
  }

  & table tbody tr td input {
    color: #44d7b6 !important;
  }

  & table tbody td:first-child * {
    text-align: left;
  }

  & table thead td:first-child {
    border-top-left-radius: ${borderRadius} !important;
  }

  & table thead td:last-child {
    border-top-right-radius: ${borderRadius};
  }

  & table tbody tr:last-child td:first-child {
    border-bottom-left-radius: ${borderRadius} !important;
  }

  & table tbody tr:last-child td:last-child {
    border-bottom-right-radius: ${borderRadius};
  }
`;

const useStyles = makeStyles({
  table: {},
});

export const mapGeneratedKeysToTable = async (password) => {
  const data = await requestGeneratedKeys(password);

  const { ethereum, waves } = data.TargetChains
  const { Validator: validator } = data

  waves.seed = waves.PrivKey
  delete waves.PrivKey

  const td = {
    heading: ["", "Address", "Private Key", "Public Key", "Seed"],
    rows: [
      { ...ethereum, name: "ETH", logo: <img src={ethereumLogo} /> },
      { ...waves, name: "WAVES", logo: <img src={wavesLogo} /> },
      { ...validator, name: "Ledger", logo: <img src={ledgerLogo} /> },
    ],
  };

  return td;
};

function SimpleTableCell(props) {
  const nodeRef = React.useRef();
  const [nodeType, setNodeType] = React.useState(props.type);

  React.useEffect(() => {
    if (nodeType === "" && nodeType !== props.type) {
      nodeRef.current.select();
      document.execCommand("copy");
      setNodeType(props.type);
      nodeRef.current.blur();
    }
  }, [nodeType, props.type]);

  const handleCopy = () => {
    setNodeType("");
  };

  return (
    <TableCell align="right">
      <div className="inner" style={{ display: props.value ? "" : "none" }}>
        {props.image || null}
        {props.type === "default" ? (
          <div>{props.value}</div>
        ) : (
          <>
            <input ref={nodeRef} type={nodeType} value={props.value} />

            <div>
              <FileCopyIcon onClick={handleCopy} />
            </div>
          </>
        )}
      </div>
    </TableCell>
  );
}

export default function SimpleTable(props) {
  const classes = useStyles();

  const { heading = [], rows } = props.tableData;

  const mapHeading = (head) => {
    return <td>{head}</td>;
  };

  return (
    <TableContainer className="table-base">
      <table>
        <thead>
          <tr>{heading.map(mapHeading)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.address}>
              <SimpleTableCell value={row.name} type="default" image={row.logo}/>
              <SimpleTableCell value={row.Address} />
              <SimpleTableCell value={row.PrivKey} type="password" />
              <SimpleTableCell value={row.PubKey} />
              <SimpleTableCell value={row.seed} type="password" />
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
