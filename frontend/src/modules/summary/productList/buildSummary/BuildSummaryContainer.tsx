import React, { FC, ReactNode, ChangeEvent } from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Version, { getString } from 'models/Version';
import { useBuildListStyles } from './styles/BuildSummaryStyles';
import BuildList from './buildList/BuildList';
import Product from 'models/Product';

const buildVersionList = (version: Version): ReactNode => {
  const versionString = getString(version);
  return (
    <MenuItem value={versionString} key={versionString}>
      {versionString}
    </MenuItem>
  );
};

interface Props {
  product: Product;
  version: Version;
  handleVersionSelected(event: ChangeEvent<unknown>, product: Product): void;
  handlePinChange(product: Product, version: Version, build: string, isPinned: boolean): void;
}

const BuildSummaryContainer: FC<Props> = ({ product, version, handleVersionSelected, handlePinChange }) => {
  const classes = useBuildListStyles();
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid item xs={3} className={classes.versionsSelector}>
        <FormControl variant="outlined">
          <InputLabel>{t('summary.versions')}</InputLabel>
          <Select
            value={getString(version)}
            onChange={(event: ChangeEvent<unknown>): void => handleVersionSelected(event, product)}
            input={<OutlinedInput labelWidth={65} />}
          >
            {product.versionList.map(buildVersionList)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <BuildList product={product} version={version} handlePinChange={handlePinChange} />
      </Grid>
    </Grid>
  );
};

export default BuildSummaryContainer;
