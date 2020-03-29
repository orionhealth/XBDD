import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { TagName } from 'models/Tag';
import TagsIgnored from 'models/TagsIgnored';

type TagsIgnoredState = TagsIgnored;

type ReceivedTagsIgnoredAction = PayloadAction<TagsIgnored>;
type TagIgnoreToggledAction = PayloadAction<TagName>;

const setTagsIgnored: CaseReducer<TagsIgnoredState, ReceivedTagsIgnoredAction> = (state, action) => {
  return action.payload;
};

const toggleTagIgnore: CaseReducer<TagsIgnoredState, TagIgnoreToggledAction> = (state, action) => {
  const tagName = action.payload;
  state[tagName] = !state[tagName];
  return state;
};

const { actions, reducer } = createSlice({
  name: 'tagsIgnored',
  initialState: {},
  reducers: {
    receivedTagsIgnored: setTagsIgnored,
    tagIgnoreToggled: toggleTagIgnore,
  },
});

export const { receivedTagsIgnored, tagIgnoreToggled } = actions;

export default reducer;
