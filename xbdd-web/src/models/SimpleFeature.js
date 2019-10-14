class SimpleFeature {
  constructor(data) {
    if (data) {
      this._id = data._id;
      this.name = data.name;
      this.tags = data.tags;
      this.calculatedStatus = data.calculatedStatus;
    }
  }
  clone() {
    const cloneSimpleFeature = new SimpleFeature();
    cloneSimpleFeature._id = this._id;
    cloneSimpleFeature.name = this.name;
    cloneSimpleFeature.tags = this.tags;
    return cloneSimpleFeature;
  }
}

export default SimpleFeature;
