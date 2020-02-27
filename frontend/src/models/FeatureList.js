import { cloneTag, setUserFromTagAssignments, setUserForTag, setIgnoredTags, toggleIgnoreForTag, createTagFromFetchedData } from './Tag';
import { cloneSimpleFeature, createSimpleFeatureFromFetchedData } from './SimpleFeature';

class FeatureList {
  constructor() {
    this.tagList = [];
    this.simpleFeatureList = [];
  }

  setUserForTag(tagName, userName) {
    const tag = this.tagList.find(tag => tag.name === tagName);
    if (tag) {
      setUserForTag(tag, userName);
    }
  }

  setFeatureListByTag(data) {
    this.tagList = data.map(item => createTagFromFetchedData(item));
  }

  setSimpleFeatureList(data) {
    this.simpleFeatureList = data.map(item => createSimpleFeatureFromFetchedData(item));
  }

  setUserFromTagAssignments(data) {
    if (data) {
      this.tagList.forEach(tag => setUserFromTagAssignments(tag, data));
    }
  }

  setIgnoredTags(data) {
    if (data) {
      this.tagList.forEach(tag => setIgnoredTags(tag, data));
    }
  }

  toggleIgnoreForTag(tagName) {
    const tagFound = this.tagList.find(tag => tag.name === tagName);
    if (tagFound) {
      toggleIgnoreForTag(tagFound);
    }
  }

  clone() {
    const newFeatureList = new FeatureList();
    newFeatureList.tagList = this.tagList.map(tag => cloneTag(tag));
    newFeatureList.simpleFeatureList = this.simpleFeatureList.map(simpleFeature => cloneSimpleFeature(simpleFeature));
    return newFeatureList;
  }
}

export default FeatureList;
