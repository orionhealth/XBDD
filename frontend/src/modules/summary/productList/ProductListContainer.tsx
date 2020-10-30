import React, { ChangeEvent, FC, useState } from 'react';
import { Card } from '@material-ui/core';

import ProductList from './ProductList';
import Product from 'models/Product';

interface Props {
  list: Product[];
  title: string;
}

const ProductListContainer: FC<Props> = ({ list, title }) => {
  const [searchContent, setSearchContent] = useState('');

  const handleSearchProduct = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchContent(event.target.value);
  };

  const filteredList = searchContent ? list.filter(product => product.name.toLowerCase().includes(searchContent.toLowerCase())) : list;

  return (
    <Card raised>
      <ProductList list={filteredList} title={title} handleSearchProduct={handleSearchProduct} />
    </Card>
  );
};

export default ProductListContainer;
