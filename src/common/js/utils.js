
function getRomdomInt(min, max) { // 生成min - max 的随机整数
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function shuffle(arr) { // 随机打乱数组
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let randomI = getRomdomInt(0, i);
    [_arr[i], _arr[randomI]] = [_arr[randomI], _arr[i]];
  };
  return _arr;
};

export function debounce(fn, delay) { // 截流函数
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    };
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};