import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ProductListContainer from './productList/ProductListContainer';
import { useSummaryStyles } from './styles/SummaryStyles';
import Loading from 'modules/loading/Loading';
import { LoggedInUser } from 'models/User';
import { RootStore } from 'rootReducer';

interface Props {
  user: LoggedInUser;
}

const SummaryContainer: FC<Props> = ({ user }) => {
  const { t } = useTranslation();
  const classes = useSummaryStyles();
  const productList = useSelector((state: RootStore) => state.report.productList);
  const favouriteList = productList?.filter(product => product.favourite);

  if (!user) {
    return null;
  }

  return (
    <>
      <Loading loading={!productList} />
      <Grid container>
        <Grid item xs={6} className={classes.productListContainer}>
          {productList && <ProductListContainer list={productList} title={t('summary.productList')} />}
        </Grid>
        <Grid item xs={6} className={classes.productListContainer}>
          {favouriteList && <ProductListContainer list={favouriteList} title={t('summary.favourites')} />}
        </Grid>
      </Grid>
    </>
  );
};

export default SummaryContainer;
