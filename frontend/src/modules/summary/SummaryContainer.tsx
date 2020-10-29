import React, { FC, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ProductList from './productList/ProductList';
import { useSummaryStyles } from './styles/SummaryStyles';
import Loading from 'modules/loading/Loading';
import { LoggedInUser } from 'models/User';
import { RootStore } from 'rootReducer';
import Product from 'models/Product';

interface Props {
  user: LoggedInUser;
}

const renderList = (productList: Product[], title: string): ReactNode => {
  return productList && <ProductList list={productList} title={title} />;
};

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
          {productList && renderList(productList, t('summary.productList'))}
        </Grid>
        <Grid item xs={6} className={classes.productListContainer}>
          {favouriteList && renderList(favouriteList, t('summary.favourites'))}
        </Grid>
      </Grid>
    </>
  );
};

export default SummaryContainer;
