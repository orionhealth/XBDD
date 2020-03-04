import Product, { createProductFromFetchedData, addVersionFromFetchedData } from './Product';

const sortProductsByNameComparator = (a: Product, b: Product): number => a.name.localeCompare(b.name);

export const createProductsFromFetchedData = (data: any): Product[] => {
  const products: Record<string, Product> = {};
  data.forEach(element => {
    const productName = element.coordinates.product;
    if (products[productName]) {
      addVersionFromFetchedData(products[productName], element);
    } else {
      products[productName] = createProductFromFetchedData(element);
    }
  });
  const productList = Object.values(products);
  productList.sort(sortProductsByNameComparator);
  return productList;
};
