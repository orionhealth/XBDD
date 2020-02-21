import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import BuildSummaryStyles from './styles/BuildSummaryStyles';
import BuildList from './buildList/BuildList';
import Product from 'models/Product';
import Version from 'models/Version';

const buildVersionList = version => {
  const versionString = version.getString();
  return (
    <MenuItem value={versionString} key={versionString}>
      {versionString}
    </MenuItem>
  );
};

const BuildSummaryContainer = props => {
  const { product, version, expandedBuildList, handleVersionSelected, handlePinChange, handleBuildListExpanded, classes } = props;

  return (
    <Grid container>
      <Grid item xs={3} className={classes.versionsSelector}>
        <FormControl variant="outlined">
          <InputLabel>Versions</InputLabel>
          <Select value={version.getString()} onChange={e => handleVersionSelected(e, product)} input={<OutlinedInput labelWidth={65} />}>
            {product.versionList.map(buildVersionList)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <BuildList
          product={product}
          version={version}
          expandedBuildList={expandedBuildList}
          handlePinChange={handlePinChange}
          handleBuildListExpanded={handleBuildListExpanded}
        />
      </Grid>
    </Grid>
  );
};

BuildSummaryContainer.propTypes = {
  product: PropTypes.instanceOf(Product),
  version: PropTypes.instanceOf(Version),
  expandedBuildList: PropTypes.arrayOf(PropTypes.string),
  handleVersionSelected: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
  handleBuildListExpanded: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(BuildSummaryStyles)(BuildSummaryContainer);
