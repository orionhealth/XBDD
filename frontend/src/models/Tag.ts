import SimpleFeature, { createSimpleFeatureFromFetchedData, cloneSimpleFeature } from './SimpleFeature';
import Status from './Status';

interface StatusPresences {
  containsPassed: boolean;
  containsUndefined: boolean;
  containsFailed: boolean;
  containsSkipped: boolean;
}

interface Tag extends StatusPresences {
  name: string;
  features: SimpleFeature[];
  userName?: string;
  isIgnored?: boolean;
}

const getStatusPresences = (features: SimpleFeature[]): StatusPresences => {
  const containsStatus = (status: Status): boolean => !!features.find(feature => feature.calculatedStatus === status);
  return {
    containsPassed: containsStatus(Status.Passed),
    containsUndefined: containsStatus(Status.Undefined),
    containsFailed: containsStatus(Status.Failed),
    containsSkipped: containsStatus(Status.Skipped),
  };
};

export const createTagFromFetchedData = (data: any): Tag => {
  return {
    name: data.tag,
    features: data.features.map(data => createSimpleFeatureFromFetchedData(data)),
    ...getStatusPresences(data.features),
  };
};

export const cloneTag = (tag: Tag): Tag => {
  return {
    name: tag.name,
    features: tag.features.map(simpleFeature => cloneSimpleFeature(simpleFeature)),
    userName: tag.userName,
    isIgnored: tag.isIgnored,
    containsPassed: tag.containsPassed,
    containsUndefined: tag.containsUndefined,
    containsFailed: tag.containsFailed,
    containsSkipped: tag.containsSkipped,
  };
};

export const setUserForTag = (tag: Tag, userName: string): void => {
  tag.userName = userName;
};

type TagAssignments = { tag: string; userName: string }[];
export const setUserFromTagAssignments = (tag: Tag, tagAssignments: TagAssignments): void => {
  const tagAssignment = tagAssignments.find(item => item.tag === tag.name);
  if (tagAssignment) {
    tag.userName = tagAssignment.userName;
  }
};

export const setIgnoredTags = (tag: Tag, data: any): void => {
  tag.isIgnored = data.includes(tag.name);
};

export const toggleIgnoreForTag = (tag: Tag): void => {
  tag.isIgnored = !tag.isIgnored;
};

export default Tag;
