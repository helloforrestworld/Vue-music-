import {playMode} from 'common/js/config';
import {loadSearch, loadPlay} from 'common/js/cache';
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  top: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay()
};
export default state;