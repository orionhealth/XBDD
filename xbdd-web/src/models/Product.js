class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.coordinates.product;
        this.major = data.coordinates.major;
        this.minor = data.coordinates.minor;
        this.servicePack = data.coordinates.servicePack;
        this.buildList = data.coordinates.builds;
        this.favourite = data.favourite
    }
}

export default Product;