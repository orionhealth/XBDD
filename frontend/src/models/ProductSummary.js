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
      if (products[productName]) {
        products[productName].addVersion(element);
      } else {
        products[productName] = new Product(element);
      }
    });
    return Object.values(products);
  }

  compareListByName = (a, b) => a.name.localeCompare(b.name);
}
export default ProductSummary;
