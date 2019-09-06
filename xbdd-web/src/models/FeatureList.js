import Tag from "./Tag";
import BriefFeature from "./BriefFeature";

class FeatureList {
  constructor() {
    this.tagList = [];
    this.simpleFeatureList = [];
  }

  setFeatureListByTag(data) {
    this.tagList = data.map(item => new Tag(item));
  }

  setSimpleFeatureList(data) {
    this.simpleFeatureList = data.map(item => new BriefFeature(item));
  }
}

export default FeatureList;
