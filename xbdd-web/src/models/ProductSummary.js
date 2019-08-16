import Product from "./Product";

class ProductSummary {
  constructor(data) {
    this.productList = [];

    data.forEach(element => {
      var addExisted = false;
      this.productList.forEach(product => {
        if (product.name === element.coordinates.product) {
          product.addVersion(element);
          addExisted = true;
        }
      });
      if (!addExisted) {
        this.productList.push(new Product(element));
      }
    });
  }
}

export default ProductSummary;
