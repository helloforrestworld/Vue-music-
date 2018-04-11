import jsonp from 'common/js/jsonp';
import {option, commonParams} from 'api/config';
import axios from 'axios';

export function getRecommend() { // 推荐页面数据获取
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, option);
};

export function getDiscList() { // 歌单列表数据获取
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  return axios.get('/api/getDiscList', {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
};
