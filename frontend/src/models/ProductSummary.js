import { createProductFromFetchedData, addVersionFromFetchedData } from './Product';

class ProductSummary {
  constructor(data) {
    this.productList = this.buildProductList(data);
    this.productList.sort(this.compareListByName);
  }

  buildProductList(data) {
    const products = {};
    data.forEach(element => {
      const productName = element.coordinates.product;
      if (products[productName]) {
        addVersionFromFetchedData(products[productName], element);
      } else {
        products[productName] = createProductFromFetchedData(element);
      }
    });
    return Object.values(products);
  }

  compareListByName = (a, b) => a.name.localeCompare(b.name);
}
export default ProductSummary;
