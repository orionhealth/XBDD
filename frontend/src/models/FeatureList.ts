import Tag, {
  cloneTag,
  setUserFromTagAssignments,
  setUserForTag,
  setIgnoredTags,
  toggleIgnoreForTag,
  createTagFromFetchedData,
} from './Tag';
import SimpleFeature, { cloneSimpleFeature, createSimpleFeatureFromFetchedData } from './SimpleFeature';

interface FeatureList {
  tagList: Tag[];
  simpleFeatureList: SimpleFeature[];
}

export const setUserForTagForFeatureList = (featureList: FeatureList, tagName: string, userName: string): void => {
  const tag = featureList.tagList.find(tag => tag.name === tagName);
  if (tag) {
    setUserForTag(tag, userName);
  }
};

export const setFeatureListByTagFromFetchedData = (featureList: FeatureList, data: any): void => {
  if (data) {
    featureList.tagList = data.map(item => createTagFromFetchedData(item));
  }
};

export const setSimpleFeatureListFromFetchedData = (featureList: FeatureList, data: any): void => {
  if (data) {
    featureList.simpleFeatureList = data.map(item => createSimpleFeatureFromFetchedData(item));
  }
};

export const setUsersFromTagAssignmentsFromFetchedData = (featureList: FeatureList, data: any): void => {
  if (data) {
    featureList.tagList.forEach(tag => setUserFromTagAssignments(tag, data));
  }
};

export const setIgnoredTagsFromFetchedData = (featureList: FeatureList, data: any): void => {
  if (data) {
    featureList.tagList.forEach(tag => setIgnoredTags(tag, data));
  }
};

export const toggleIgnoreForTagForFeatureList = (featureList: FeatureList, tagName: string): void => {
  const tagFound = featureList.tagList.find(tag => tag.name === tagName);
  if (tagFound) {
    toggleIgnoreForTag(tagFound);
  }
};

export const cloneFeatureList = (featureList: FeatureList): FeatureList => {
  return {
    tagList: featureList.tagList.map(tag => cloneTag(tag)),
    simpleFeatureList: featureList.simpleFeatureList.map(simpleFeature => cloneSimpleFeature(simpleFeature)),
  };
};

export default FeatureList;
