class SimpleFeature {
  constructor(data) {
    if (data) {
      this.id = data.id;
      this._id = data._id;
      this.name = data.name;
      this.tags = data.tags;
      this.calculatedStatus = data.calculatedStatus;
    }
  }
  clone() {
    const cloneSimpleFeature = new SimpleFeature();
    cloneSimpleFeature.id = this.id;
    cloneSimpleFeature._id = this._id;
    cloneSimpleFeature.name = this.name;
    cloneSimpleFeature.tags = this.tags;
    return cloneSimpleFeature;
  }
}

export default SimpleFeature;
