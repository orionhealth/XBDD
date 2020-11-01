import React, { FC } from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';

import StepRow from 'models/StepRow';
import { useCucumberTableStyles } from './styles/ScenarioStepStyles';

interface Props {
  rows: StepRow[];
}

const CucumberTable: FC<Props> = ({ rows }) => {
  const classes = useCucumberTableStyles();

  let index = 0;
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

export default CucumberTable;
