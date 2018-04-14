import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/shuffle';

export const selectPlay = ({commit, state}, {list, index}) => {
  let playlist = list;
  if (state.mode === playMode.random) {
    playlist = shuffle(list);
    index = findIndex(playlist, list[index]);
  };
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const sellAllRondom = ({commit}, {list}) => {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, shuffle(list));
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

function findIndex(list, tar) {
  let index = list.findIndex((item) => {
    return tar.id === item.id;
  });
  return index;
};