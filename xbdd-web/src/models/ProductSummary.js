import Product from "./Product";
class ProductSummary {
  constructor(data) {
    this.productList = this.buildProductList(data);
    this.productList.sort(this.compareListByName);
  }

  buildProductList(data) {
    const products = {};
    data.forEach(element => {
      const productName = element.coordinates.product;
      products[productName] ? products[productName].updateExistedProduct(element) : (products[productName] = new Product(element));
    });
    return Object.values(products);
  }

  compareListByName = (a, b) => (a.name > b.name ? 1 : -1);
}
export default ProductSummary;
