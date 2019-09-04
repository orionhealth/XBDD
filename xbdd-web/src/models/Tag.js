const getStatusPresences = features => {
  const findStatus = status => features.find(feature => feature.calculatedStatus === status);

  return {
    containsPassed: !!findStatus("passed"),
    containsUndefined: !!findStatus("undefined"),
    containsFailed: !!findStatus("failed"),
    containsSkipped: !!findStatus("skipped"),
  };
};

class Tag {
  constructor(data) {
    this.name = data.tag;
    this.features = data.features;
    Object.assign(this, getStatusPresences(data.features));
  }
}

export default Tag;
