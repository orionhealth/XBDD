// import Product from "./Product";

// class ProductSummary {
//   constructor(data) {
//     this.productList = [];

//     data.forEach(element => {
//       var addExisted = false;
//       this.productList.forEach(product => {
//         if (product.name === element.coordinates.product) {
//           product.addVersion(element);
//           addExisted = true;
//         }
//       });
//       if (!addExisted) {
//         this.productList.push(new Product(element));
//       }
//     });
//   }
// }

// export default ProductSummary;

import Product from "./Product";
class ProductSummary {
  constructor(data) {
    this.productList = this.buildProductList(data);
  }

  buildProductList(data) {
    const products = {};
    data.forEach(element => {
      const elementName = element.coordinates.product;
      if (products[elementName]) {
        products[elementName].addVersion(element);
      } else {
        products[elementName] = new Product(element);
      }
    });
    return Object.values(products);
  }
}
export default ProductSummary;
