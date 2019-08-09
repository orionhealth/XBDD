import Product from './Product'

class ProductSummary {
    constructor(data) {
        this.productList = data.map(product => new Product(product));
    }
}

export default ProductSummary;