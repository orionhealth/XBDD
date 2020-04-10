import { TagName } from './Tag';
import { TagAssignee } from './TagAssignee';

type TagAssignments = Record<TagName, TagAssignee | undefined>;

export default TagAssignments;
