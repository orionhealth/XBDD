class Product {
  constructor(data) {
    if (data) {
      this.name = data.coordinates.product;
      this.versionList = [
        {
          id: data["_id"],
          major: data.coordinates.major,
          minor: data.coordinates.major,
          servicePack: data.coordinates.servicePack,
          buildList: data.builds,
        },
      ];
      this.favourite = data.favourite;
      this.expanded = false;
    }
  }

  addVersion(data) {
    this.versionList.push({
      id: data["_id"],
      major: data.coordinates.major,
      minor: data.coordinates.major,
      servicePack: data.coordinates.servicePack,
      buildList: data.builds,
    });
  }

  clone() {
    const rtn = new Product();
    rtn.name = this.name;
    rtn.versionList = this.versionList;
    rtn.favourite = this.favourite;
    rtn.expanded = this.expanded;

    return rtn;
  }
}

export default Product;
