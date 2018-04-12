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

let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let o = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };
  for (let k in o) {
    if (elementStyle[o[k]] !== undefined) {
      return k;
    };
  };
  return false;
})();

export function prefixStyle(style) {
  if (!vendor) return false;
  if (vendor === 'standard') {
    return style;
  };
  return vendor + style.substr(0, 1).toUpperCase() + style.substr(1);
};
