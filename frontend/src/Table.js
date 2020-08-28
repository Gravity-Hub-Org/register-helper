import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const useStyles = makeStyles({
  table: {
    maxWidth: 300,
  },
});

function SimpleTableCell(props) {
  const nodeRef = React.useRef();
  const [nodeType, setNodeType] = React.useState(props.type);

  React.useEffect(() => {
    if (nodeType === "" && nodeType !== props.type) {
      nodeRef.current.select();
      document.execCommand("copy");
      setNodeType(props.type);
    }
  });

  if (!props.value) return <div></div>;

  const handleCopy = () => {
    setNodeType("");
  };

  return (
    <TableCell align="right">
      <div className="inner">
        <input ref={nodeRef} type={nodeType} value={props.value} />
        <div>
          <FileCopyIcon onClick={handleCopy} />
        </div>
      </div>
    </TableCell>
  );
}

export default function SimpleTable(props) {
  const classes = useStyles();

  const { heading = [], rows } = props.tableData;

  const mapHeading = (head) => {
    return <TableCell>{head}</TableCell>;
  };

  return (
    <TableContainer component={Paper} className="table-base">
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>{heading.map(mapHeading)}</TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.address}>
              <SimpleTableCell value={row.name} />
              <SimpleTableCell value={row.address} />
              <SimpleTableCell value={row.private_key} type="password" />
              <SimpleTableCell value={row.public_key} />
              <SimpleTableCell value={row.seed} type="password" />
              {/* <TableCell component="th" scope="row">
                <div className="inner">{row.address}</div>
              </TableCell>
              <TableCell align="right">
                <div className="inner">{row.private_key}</div>
                <FileCopyIcon />
              </TableCell>
              <TableCell align="right">
                <div className="inner">{row.public_key}</div>
              </TableCell>
              <TableCell align="right">
                <div className="inner">{row.seed}</div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
