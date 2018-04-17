import jsonp from 'common/js/jsonp';
import {commonParams, option} from './config';

export function getHotKey() {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });
  return jsonp(url, data, option);
};