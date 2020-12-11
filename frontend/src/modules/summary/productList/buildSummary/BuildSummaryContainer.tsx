import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { useBuildSummaryStyles } from './styles/BuildSummaryStyles';
import BuildList from './buildList/BuildList';
import Product, { getVersionFromString } from 'models/Product';
import { RootStore } from 'rootReducer';
import VersionsSelector from './VersionSelector';
import { getString } from 'models/Version';

interface Props {
  product: Product;
}

const BuildSummaryContainer: FC<Props> = ({ product }) => {
  const classes = useBuildSummaryStyles();

  const selectedVersionMap = useSelector((state: RootStore) => state.report.selectedVersion);
  const selectedVersionString: string = selectedVersionMap[product.name];
  const selectedVersion = selectedVersionString ? getVersionFromString(product, selectedVersionString) : product.versionList[0];

  if (!selectedVersion) {
    return null;
  }

  return (
    <Grid container>
      <Grid item xs={3} className={classes.versionsSelector}>
        <VersionsSelector product={product} selectedVersion={selectedVersion} />
      </Grid>
      <Grid item xs={9}>
        <BuildList product={product.name} version={getString(selectedVersion)} buildList={selectedVersion.buildList} />
      </Grid>
    </Grid>
  );
};

export default BuildSummaryContainer;
