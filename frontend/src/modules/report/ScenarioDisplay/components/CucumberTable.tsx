import React, { FC } from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import StepRow from 'models/StepRow';

const useStyles = makeStyles(() =>
  createStyles({
    scrollableTable: {
      overflowX: 'scroll',
    },
    stepTable: {
      width: 'auto',
      margin: '4px 0 12px 0',
    },
  })
);

interface Props {
  rows: StepRow[];
}

const CucumberTable: FC<Props> = ({ rows }) => {
  const classes = useStyles();

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
