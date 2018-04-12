import {ERR_OK} from 'api/config';
import {commonParams} from 'api/config';
import axios from 'axios';
let _uid = '';
export class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
};

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: _normalizeSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  });
};

function _normalizeSinger(singer) {
  if (!singer) return;
  let ret = [];
  singer.forEach((item) => {
    ret.push(item.name);
  });
  return ret.join('/');
};

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  return getSongsUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo;
      midUrlInfo.forEach((info, index) => {
        let song = songs[index];
        song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`;
      });
    };
    return songs;
  })
};

function getSongsUrl(songs) {
  const url = '/api/getPurlUrl';

  let mids = [];
  let types = [];

  songs.forEach((song) => {
    mids.push(song.mid);
    types.push(0);
  });

  const urlMid = genUrlMid(mids, types);

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  return new Promise((resolve, reject) => {
    let tryTime = 3;

    function request() {
      return axios.post(url, {
        comm: data,
        url_mid: urlMid
      }).then((response) => {
        const res = response.data;
        if (res.code === ERR_OK) {
          let urlMid = res.url_mid;
          if (urlMid && urlMid.code === ERR_OK) {
            const info = urlMid.data.midurlinfo[0];
            if (info && info.purl) {
              resolve(res);
            } else {
              retry();
            }
          } else {
            retry();
          }
        } else {
          retry();
        }
      })
    }

    function retry() {
      if (--tryTime >= 0) {
        request();
      } else {
        reject(new Error('Can not get the songs url'));
      }
    }

    request();
  })
}

function genUrlMid(mids, types) {
  const guid = getUid();
  return {
    module: 'vkey.GetVkeyServer',
    method: "CgiGetVkey",
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  };
}

export function getUid() {
  if (_uid) {
    return _uid;
  };
  if (!_uid) {
    const t = (new Date).getUTCMilliseconds();
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10;
  };
  return _uid;
}
