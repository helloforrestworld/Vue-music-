export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  };
  let classArr = el.className.split(' ');
  classArr.push(className);
  el.className = classArr.join(' ');
};

export function hasClass(el, className) {
  let reg = new RegExp('\\b' + className + '\\b');
  return reg.test(el.className);
};

export function getData(el, key, val) {
  key = 'data-' + key;
  if (val === undefined) {
    return el.getAttribute(key);
  } else {
    el.setAttribute(key, val);
  };
};