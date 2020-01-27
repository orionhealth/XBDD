import SimpleFeature from "./SimpleFeature";

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
    if (data) {
      this.name = data.tag;
      this.features = data.features.map(data => new SimpleFeature(data));
      Object.assign(this, getStatusPresences(data.features));
    }
  }

  clone() {
    const cloneTag = new Tag();
    cloneTag.name = this.name;
    cloneTag.features = this.features.map(simpleFeature => simpleFeature.clone());
    cloneTag.userName = this.userName;
    cloneTag.isIgnored = this.isIgnored;
    cloneTag.containsPassed = this.containsPassed;
    cloneTag.containsUndefined = this.containsUndefined;
    cloneTag.containsFailed = this.containsFailed;
    cloneTag.containsSkipped = this.containsSkipped;
    return cloneTag;
  }

  setUserForTag(userName) {
    this.userName = userName;
  }

  setUserForTags(data) {
    const tagAssignment = data.find(item => item.tag === this.name);
    if (tagAssignment) {
      this.userName = tagAssignment.userName;
    }
  }

  setIgnoredTags(data) {
    this.isIgnored = data.includes(this.name);
  }

  toggleIgnoreForTag() {
    this.isIgnored = !this.isIgnored;
  }
}

export default Tag;
