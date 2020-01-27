import React from "react";
import PropTypes from "prop-types";
import { Table, TableHead, TableRow, TableBody, TableCell } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { cucumberTableStyles } from "./styles/ScenarioStepStyles";

const CucumberTable = props => {
  const { rows, classes } = props;

  var index = 0;
  return (
    <div className={classes.scrollableTable}>
      <Table size="small" className={classes.stepTable}>
        <TableHead>
          <TableRow>
            {rows[0].cells.map(cell => (
              <TableCell key={cell}>{cell}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(1).map(row => (
            <TableRow key={row.line}>
              {row.cells.map(cell => (
                <TableCell key={index++}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

CucumberTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      cells: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  classes: PropTypes.shape({}),
};

export default withStyles(cucumberTableStyles)(CucumberTable);
