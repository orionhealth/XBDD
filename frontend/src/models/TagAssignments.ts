import { TagName } from './Tag';
import { UserName } from './User';

type TagAssignments = Record<TagName, UserName | undefined>;

export default TagAssignments;
