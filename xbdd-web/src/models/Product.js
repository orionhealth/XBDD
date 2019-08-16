class Product {
  constructor(data) {
    if (data) {
      this.id = data.id;
      this.name = data.coordinates.product;
      this.major = data.coordinates.major;
      this.minor = data.coordinates.minor;
      this.servicePack = data.coordinates.servicePack;
      this.buildList = data.coordinates.builds;
      this.favourite = data.favourite;
      this.expanded = false;
    }
  }

  clone() {
    const rtn = new Product();
    rtn.id = this.id;
    rtn.name = this.name;
    rtn.major = this.major;
    rtn.minor = this.minor;
    rtn.servicePack = this.servicePack;
    rtn.buildList = this.buildList;
    rtn.favourite = this.favourite;
    rtn.expanded = this.expanded;

    return rtn;
  }
}

export default Product;
