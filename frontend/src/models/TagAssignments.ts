import { TagName } from './Tag';
import { User } from './User';

type TagAssignments = Record<TagName, User | undefined>;

export default TagAssignments;
