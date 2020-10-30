import React, { FC } from 'react';
import { Grid, Card } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import ProductListContainer from './productList/ProductListContainer';
import { useSummaryStyles } from './styles/SummaryStyles';
import Loading from 'modules/loading/Loading';
import { LoggedInUser } from 'models/User';
import { useSelector } from 'react-redux';
import { RootStore } from 'rootReducer';
import Product from 'models/Product';

interface Props {
  user: LoggedInUser;
}

const renderList = (productList: Product[], title: string) => {
  return (
    productList && (
      <Card raised>
        <ProductListContainer list={productList} title={title} />
      </Card>
    )
  );
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
      <Card elevation={0}>
        <Grid container>
          <Grid item xs={6} className={classes.productListContainer}>
            {productList && renderList(productList, t('summary.productList'))}
          </Grid>
          <Grid item xs={6} className={classes.productListContainer}>
            {favouriteList && renderList(favouriteList, t('summary.favourites'))}
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default SummaryContainer;
