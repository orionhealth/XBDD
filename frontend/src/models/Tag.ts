import { SimpleFeature } from './Feature';

export type TagName = string;

export interface SimpleTag {
  name: TagName;
}

interface Tag extends SimpleTag {
  features: SimpleFeature[];
}

export default Tag;
