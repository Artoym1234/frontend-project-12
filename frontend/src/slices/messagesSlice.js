import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { actions as chanelsActions } from './channelsSlice.js';
import fetchInitialData from './fetchInitialData.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(chanelsActions.removeChannel, (state, action) => {
        const { chanelId } = action.payload;
        const allEntities = Object.values(state.entities);
        const restEntities = allEntities.filter((e) => e.channelId !== chanelId);
        messagesAdapter.setAll(state, restEntities);
      })
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        messagesAdapter.setAll(state, payload.messages);
      });
  },
});
export const selectors = messagesAdapter.getSelectors(
  (state) => state.messages,
);

const selectMessages = selectors.selectAll;

export const activeChannelId = (state) => {
  const { currentChannelId } = state.channels;
  return currentChannelId;
};

export const filteredMessages = createSelector(
  selectMessages,
  activeChannelId,
  (messages, currentChannelId) => messages
    .filter((message) => message.channelId === currentChannelId),
);
export const { actions } = messagesSlice;
export default messagesSlice.reducer;
