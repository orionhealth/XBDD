import Tag from './Tag';
import SimpleFeature from './SimpleFeature';

class FeatureList {
  constructor() {
    this.tagList = [];
    this.simpleFeatureList = [];
  }

  setUserForTag(tagName, userName) {
    const tag = this.tagList.find(tag => tag.name === tagName);
    if (tag) {
      tag.setUserForTag(userName);
    }
  }

  setFeatureListByTag(data) {
    this.tagList = data.map(item => new Tag(item));
  }

  setSimpleFeatureList(data) {
    this.simpleFeatureList = data.map(item => new SimpleFeature(item));
  }

  setUserForTags(data) {
    if (data) {
      this.tagList.forEach(tag => tag.setUserForTags(data));
    }
  }

  setIgnoredTags(data) {
    if (data) {
      this.tagList.forEach(tag => tag.setIgnoredTags(data));
    }
  }

  toggleIgnoreForTag(tagName) {
    const tagFound = this.tagList.find(tag => tag.name === tagName);
    if (tagFound) {
      tagFound.toggleIgnoreForTag();
    }
  }

  clone() {
    const newFeatureList = new FeatureList();
    newFeatureList.tagList = this.tagList.map(tag => tag.clone());
    newFeatureList.simpleFeatureList = this.simpleFeatureList.map(simpleFeature => simpleFeature.clone());
    return newFeatureList;
  }
}

export default FeatureList;
