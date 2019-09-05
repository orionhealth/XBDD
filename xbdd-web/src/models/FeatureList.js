import Tag from "./Tag";
import SimpleFeature from "./SimpleFeature";

class FeatureList {
  constructor() {
    this.tagList = [];
    this.simpleFeatureList = [];
  }

  setFeatureListByTag(data) {
    this.tagList = data.map(item => new Tag(item));
  }

  setSimpleFeatureList(data) {
    this.simpleFeatureList = data.map(item => new SimpleFeature(item));
  }
}

export default FeatureList;
