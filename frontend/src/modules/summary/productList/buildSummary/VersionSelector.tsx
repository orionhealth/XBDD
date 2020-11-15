import React, { ChangeEvent, FC } from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Version, { getString } from 'models/Version';
import { selectVersion } from 'redux/ReportReducer';
import Product from 'models/Product';

interface Props {
  product: Product;
  selectedVersion: Version;
}

const VersionsSelector: FC<Props> = ({ product, selectedVersion }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedVersionString = getString(selectedVersion);
  const onSelectVersion = (event: ChangeEvent<{ value: unknown }>): void => {
    dispatch(selectVersion(product.name, event.target.value as string));
  };

  return (
    <FormControl variant="outlined">
      <InputLabel>{t('summary.versions')}</InputLabel>
      <Select value={selectedVersionString} onChange={onSelectVersion} input={<OutlinedInput labelWidth={65} />}>
        {product.versionList.map(version => (
          <MenuItem value={getString(version)} key={version.id}>
            {getString(version)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VersionsSelector;
