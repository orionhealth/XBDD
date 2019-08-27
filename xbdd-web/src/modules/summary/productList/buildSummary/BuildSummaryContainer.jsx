import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import BuildSummaryStyles from "./styles/BuildSummaryStyles";
import BuildList from "./buildList/BuildList";
import Product from "../../../../models/Product";
import Version from "../../../../models/Version";

const buildVersionList = version => {
  const versionString = version.getString();
  return (
    <MenuItem value={versionString} key={versionString}>
      {versionString}
    </MenuItem>
  );
};

const BuildSummaryContainer = props => {
  return (
    <Grid container>
      <Grid item xs={3} className={props.classes.versionsSelector}>
        <FormControl variant="outlined" style={{ paddingBottom: "10px" }}>
          <InputLabel>Versions</InputLabel>
          <Select
            value={props.version.getString()}
            onChange={e => props.handleVersionSelected(e, props.product)}
            input={<OutlinedInput labelWidth={50} />}
          >
            {props.product.versionList.map(buildVersionList)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <BuildList
          product={props.product}
          version={props.version}
          handlePinChange={props.handlePinChange}
          handleBuildSelected={props.handleBuildSelected}
        />
      </Grid>
    </Grid>
  );
};

BuildSummaryContainer.propTypes = {
  product: PropTypes.instanceOf(Product),
  version: PropTypes.instanceOf(Version),
  handleVersionSelected: PropTypes.func.isRequired,
  handlePinChange: PropTypes.func.isRequired,
  handleBuildSelected: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(BuildSummaryStyles)(BuildSummaryContainer);
