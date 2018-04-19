import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/utils';
import {saveSearch, deleteSearch, clearSearch, savePlay} from 'common/js/cache';

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

export const insertSong = ({commit, state}, song) => {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let currentSong = playlist[currentIndex];
  let fpIndex = findIndex(playlist, song);
  currentIndex++;
  playlist.splice(currentIndex, 0, song);
  if (fpIndex > -1) { // 有相同的歌曲
    if (fpIndex < currentIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else { // 前面插入了一首歌曲 索引位置需要调整
      playlist.splice(fpIndex + 1, 1);
    }
  }
  let fsIndex = findIndex(sequenceList, song);
  let currentSIndex = findIndex(sequenceList, currentSong);
  currentSIndex++;
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    if (fsIndex < currentSIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

export const deleteSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const deleteSong = ({commit, state}, song) => {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  
  let pIndex = findIndex(playlist, song);
  let sIndex = findIndex(sequenceList, song);
  
  playlist.splice(pIndex, 1);
  sequenceList.splice(sIndex, 1);
  
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--;
  };
  
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  
  let playingState = playlist.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
  commit(types.SET_PLAYING_STATE, playingState);
};

export const clearPlaylist = ({commit}) => {
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const savePlayHistory = ({commit}, history) => {
  commit(types.SET_PLAY_HISTORY, savePlay(history));
};

function findIndex(list, tar) {
  let index = list.findIndex((item) => {
    return tar.id === item.id;
  });
  return index;
};