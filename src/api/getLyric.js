import {commonParams} from 'api/config';
import axios from 'axios';

export function getLyric(mid) {
  let url = '/api/getLyric';
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data.lyric);
  });
};