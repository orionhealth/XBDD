import React, { FC, ReactNode } from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Version, { getString } from 'models/Version';
import { useBuildListStyles } from './styles/BuildSummaryStyles';
import BuildList from './buildList/BuildList';
import Product from 'models/Product';
import { selectVersion } from 'redux/ReportReducer';
import { useDispatch } from 'react-redux';

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
}

const BuildSummaryContainer: FC<Props> = ({ product, version }) => {
  const classes = useBuildListStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onSelectVersion = (event): void => {
    dispatch(selectVersion(product.name, event.target.value));
  };

  return (
    <Grid container>
      <Grid item xs={3} className={classes.versionsSelector}>
        <FormControl variant="outlined">
          <InputLabel>{t('summary.versions')}</InputLabel>
          <Select value={getString(version)} onChange={onSelectVersion} input={<OutlinedInput labelWidth={65} />}>
            {product.versionList.map(buildVersionList)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <BuildList product={product.name} version={getString(version)} buildList={version.buildList} />
      </Grid>
    </Grid>
  );
};

export default BuildSummaryContainer;
