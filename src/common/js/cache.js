// localstroage相关
function saveLoadcal(opts) {
  let {module, id, value} = opts;
  module = '__' + module + '__';
  let tarModule = window.localStorage[module];
  if (!tarModule) {
    tarModule = {}; 
  } else {
    tarModule = JSON.parse(tarModule);
  };
  tarModule[id] = value;
  window.localStorage[module] = JSON.stringify(tarModule);
};

function loadLoadcal(opts) {
  let {module, id, def} = opts;
  module = '__' + module + '__';
  let tarModule = window.localStorage[module];
  if (!tarModule) {
    return def;
  } else {
    tarModule = JSON.parse(tarModule);
  };
  if (!tarModule[id]) {
    return def;
  };
  return tarModule[id];
};

// 数组插入数据
  // 需求 : 1.去除相同的 2.超出限定长度移除最后一个 
const SEARCH_MAX_LEN = 15;
function insertArray(arr, value, compare, maxLen) {
  let findIndex = arr.findIndex(compare);
  if (findIndex === 0) {
    return;
  };
  if (findIndex > 0) {
    arr.splice(findIndex, 1);
  };
  arr.unshift(value);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  };
};

// 从数组里面删除一个
function deleteFromArray(arr, value, compare) {
  let findIndex = arr.findIndex(compare);
  if (findIndex > -1) {
    arr.splice(findIndex, 1);
  };
}

// 保存搜索历史
export function saveSearch(value) {
  let ret = loadLoadcal({
    module: 'chickmusic',
    id: 'searchHistory',
    def: []
  });
  insertArray(ret, value, (item) => {
    return item === value;
  }, SEARCH_MAX_LEN);
  saveLoadcal({
    module: 'chickmusic',
    id: 'searchHistory',
    value: ret
  });
  return ret;
};

// 读取搜索历史 
export function loadSearch() {
  return loadLoadcal({
    module: 'chickmusic',
    id: 'searchHistory',
    def: []
  });
};

// 删除某条搜索历史
export function deleteSearch(value) {
  let ret = loadLoadcal({
    module: 'chickmusic',
    id: 'searchHistory',
    def: []
  });
  deleteFromArray(ret, value, (item) => {
    return item === value;
  });
  saveLoadcal({
    module: 'chickmusic',
    id: 'searchHistory',
    value: ret
  });
  return ret;
};

// 清空搜索历史
export function clearSearch() {
  let ret = [];
  saveLoadcal({
    module: 'chickmusic',
    id: 'searchHistory',
    value: ret
  });
  return ret;
};