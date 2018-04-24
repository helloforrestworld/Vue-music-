# vue-music

> Vue全家桶音乐播放器

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 切换移动端调试 刷新后滚动正常
```

## 预览
![此处输入图片的描述][1]
![此处输入图片的描述][2]
![此处输入图片的描述][3]

## 目录结构
```
    .
├── build                                       // webpack配置文件
├── config                                      // 项目打包路径
├── src                                         // 项目核心文件
│   ├── api                                     // 数据抓取API
|       └── config                              // 请求公共配置
|       └── getLyric                            // 歌词抓取
|       └── handlesongurl                       // 歌曲url处理
|       └── rank                                // 排行榜数据抓取
|       └── recommend                           // 推荐数据抓取
|       └── search                              // 搜索数据抓取
|       └── singer                              // 歌手数据抓取
│   ├── base                                    // 基础组件
|       └── confirm                             // 对话框组件
|       └── listview                            // 歌手页面子组件
|       └── loading                             // 加载中样式展示组件
|       └── no-result                           // 无内容样式展示组件
|       └── progress-bar                        // 播放器进度条
|       └── progress-circle                     // 迷你播放器圆环进度条
|       └── scroll                              // 页面滚动组件
|       └── search-box                          // 搜索框组件
|       └── search-list                         // 历史搜索记录列表
|       └── slide                               // 轮播图组件
|       └── song-list                           // 歌曲列表子组件
|       └── switches                            // 选项卡按钮
|       └── top-tip                             // 头部通知框
│   ├── common                                  // 公共静态资源
|       └── fonts                               // 字体图标
|       └── image                               // 静态图片资源
|       └── js                                  // 公共js
|           └── cache                           // localstorage相关
|           └── config                          // 公共配置文件
|           └── dom                             // Dom相关方法
|           └── jsonp                           // promise版本jsonp封装
|           └── mixin                           // 组件mixin
|           └── singFactory                     // 处理歌手格式
|           └── songFactory                     // 处理歌曲格式
|           └── utils                           // js工具库
|       └── less                                // 公共less
│   ├── components                              // 业务组件
|       └── add-song                            // 播放列表添加歌曲组件
|       └── disc-detail                         // 歌单详情
|       └── m-header                            // 头部
|       └── music-list                          // 歌曲列表
|       └── player                              // 播放器
|       └── playlist                            // 播放列表
|       └── rank                                // 排行榜
|       └── recommend                           // 推荐
|       └── search                              // 搜索
|       └── singer                              // 歌手
|       └── singer-detail                       // 歌手详情
|       └── suggest                             // 搜素结果
|       └── tab                                 // 导航
|       └── top-detail                          // 排行榜详情
|       └── user-center                         // 用户中心
|   ├── router                                  // 路由
|   ├── store                                   // vuex
|       └── actions                             // actions
|       └── getters                             // getters
|       └── index                               // store入口
|       └── mutation-types                      // mutation-types
|       └── mutations                           // mutations
|       └── state                               // state
│   ├── App.vue                                 // 组件入口
│   ├── main.js                                 // 入口文件
├── index.html                                  // 模板html文件
├── prod.server.js                              // 测试打包后的服务器
.

```
### 总结
#### 准备工作
*. icomoon制作字体图标
*. 基础less
> a. 颜色规范
> b. mixin
> c. reset
> d. icon
      
*. eslint规则改写
*. babel-runtime babel-ployfill  // es6一些API polyfill

*. fastclick
```
    import fastclick from 'fastclick'; // 消除移动端点击延迟
    fastclick.attach(document.body);
```
*. vue-lazyload // 图片懒加载
```
    Vue.use(VueLazyLoad, {
      loading: require('common/image/default.png')
    });
```
*. 目录结构
> src => api base common components router store

*. webpack配置别名路径
```
extensions: ['.js', '.vue', '.json', '.less'],
    alias: {
      '@': resolve('src'),
      'common': resolve('src/common'),
      'components': resolve('src/components'),
      'api': resolve('src/api'),
      'base': resolve('src/base')
    }
```

#### 知识点
*. slider基础组件封装
```
// 基于better-scroll
    props: 
      1.loop 是否无缝
      2.autoPlay: 是否自动播放
      3.interval: 播放间隔
    slot: 幻灯片内容列表
    实现:
      1.初始化slide-item宽度和外层容器宽度,并加上组件内写好的slide-item类名
      2.初始化better-scroll
      3.监听scrollEnd通过this.slider.getCurrentPage().pageX 获取当前索引
      4.自动播放实现: scrollEnd时开始setimeout beforeScrollStart时清除定时器
      5.组件初始化：mouted时初始化 resize时 重新计算宽度 this.slider.refresh()
```
*. scroll基础组件封装
```
// 基于better-scroll
    props: 
      1.probeType 滚动监听的间隔 默认为1 一定时间间隔监听滚动
      2.click: 是否能点击
      3.data: 渲染列表的数据 监控数据的变化刷新scroll
      4.listenScroll:是否监听滚动
      5.pullup：上滑到底部是否派发事件(上滑加载)
      6.scrollBefore: 滚动开始前是否派发事件
      7.refreshDelay: 数据变化 => scroll刷新的时间间隔(防止有过渡动画 自定义刷新时间能正确计算高度)
      
    slot: 滚动的整个列表
    
    methods:
      1.refresh
      2.scrollTo
      3.scrollToElement
    emit:
      1.scroll // 滚动时
      2.scrollToEnd // 上滑至底部
      3.scrollBefore // 滚动开始前
    实现:
      1.mouted时初始化better-scroll 根据probeType click 进行配置
      2.根据listenScroll pullup scrollBefore 判断初始化时是否监听scroll的状态
      3.watch:data变化 按refreshDelay时间刷新scroll

```
*. listview(歌手列表)基础组件封装
```
    // 基于封装的scroll组件
    // proboType = 3 实时监控滚动位置 左右结构对应
    
    emit : 1.select (歌手被点击时)
    实现：
        导航关联歌手列表
        1.shortcut触摸记录位置和当前index 歌手列表滚动到第index个
        2.shortcut Move的时候 用 当前坐标 - 初始坐标 /  shortcutItem的高度 计算出移动了多少个index
        3.currentIndex =  disIndex + startIndex 歌手列表滚动到第currentIndex个
        
        歌手列表关联导航
        4.mounted时记录每个列表的高度区间_calculateHeight
        5.歌手列表滚动监听nowY的变化判断落在哪个区间改变currentIndex
        
        细节
        歌手列表固定的列表头
        1.绝对定位层
        2.判断currentIndex 获取 当前title
        3.当 height[index] - nowY <= 列表头的高度时  固定的列表头往上偏移
```
*. music-list(歌手/歌单 详情列表)和song-list(music-list子组件)基础组件封装
```
  music-list 实现细节
    1. bgimage层 因为请求图片是异步的 所以可以height:0 width:100% padding-top：70%预留位置
    2. list下拉图片放大 上滑覆盖图片 并且有最小值
       // 监控scrollY变化
        a. 当scrollY > 0 时 percent = Math.abs(newY / this.imageHeight) scale = 1 + percent;
        b. bg-layer跟随列表滚动并且滚动的最小值为 -this.imageHeight + TOP_HEIHGT(头部title高度);
        c. 当bg-layer滚动到阈值时 图片高度缩小至TOP_HEIHGT
        
  song-list
    props: 
        songs [] 歌曲列表
        rank： 是否排名 Boolean
    emit: 
       this.$emit('select', song, index) 选中一首歌曲
    
    实现：
        1.普通的ul列表
        2.排行榜页面用到排名
        3.rank为true显示
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        4.前三名有奖杯图片
        5.后面按序号
```
*.player(播放器)组件封装
```
    state(vuex):
        playing: false // 播放状态
        fullScreen: false // 是否全屏
        playlist: [] // 播放列表
        sequenceList: [] // 顺序列表
        mode: 'random'/'sequence'/'loop' // 播放模式
        currentIndex: -1 // 播放index
    getters： currentSong(state){return state.playlist[state.currentIndex]}
    mutations: 每个state对应的修改方法
    
    
    播放器过渡效果
        全屏播放器:
            &.normal-enter-active, &.normal-leave-active{
              transition: all 0.4s;
              .top, .bottom{
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
              }
            }
            &.normal-enter, &.normal-leave-to{
              opacity: 0;
              .top{
                transform: translate3d(0, -100px, 0);
              }
              .bottom{
                transform: translate3d(0, 100px, 0);
              }
            }
            
            另外cdWrapper还有一个 从 迷你播放器icon进入 先放大再缩小的过程, 这个过程通过transitions的js钩子里 引入 create-keyframe-animtion实现
        
        迷你播放器：
        &.mini-enter-active, &.mini-leave-active{
          transition: all 0.4s;
        }
        &.mini-enter, &.mini-leave-to{
          opacity: 0;
        }
    
    关于迷你播放器圆环进度条实现原理
        1.引入svg <circle>标签
        2.两个circle fill都为透明 里面放入真正的按钮
        3.一个circle作为bg 另一个则利用 stroke-dasharray  stroke-dashoffset按比例描边
        4.dashArray: Math.PI * 100（100为viewbox宽度）
        5.dashOffset() {
            return (1 - this.percent) * this.dashArray;
          }
    
    关于cd的旋转
        1. 理想情况下直接通过css animation infinite 旋转就可以 
        2. 暂定直接应用 animation-play-state: pause
        3. 但是ios并不支持animition-play-state
        解决办法:
            1. 通过cd外层容器记录旋转角度
            2. 每次移除animition时记录旋转角度
            3. 开始旋转前将外层容器旋转到相应的角度
    
    关于ios safari 和 微信浏览器 audio无法播放歌曲的问题
        1. 如果在微信浏览器, 需要在 WeixinJSBridgeReady 后 动态添加audio标签
        2. 如果在safari, 只能在用用户点击文档后动态添加audio标签
    
```
*.css前缀补全函数prefixStyle
```
    let eleStyle = document.createElement('div').style;
    let o = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform,
        ms: 'msTransform,
        standard: 'transform'
    }
    cosnt vendor = (() => {
        for( let k in o ) {
            if (eleStyle[o[k]]] !== undefined) {
                return k
            }
        }
        return false
    })()
    
    function prefixStyle(style) {
        if (!vendor) return false
        if (vendor === 'standard') {
            return style
        }
        return vendor + style.substr(0,1).toUpperCase + style.substr(1)
    }
```
*. 随机播放算法
```
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
```
*.截留函数封装(搜索模块用到)
```
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
```
*. jsonp Promise版封装
```
    import originJsonp from 'jsonp'
    export function jsonp(url, data, options) {
        url = (url.indexOf('?') < 0 ? '?' : '') + params(data)
        return new Promise((resolve, reject) => {
            originJsonp(url, options, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    function params(data) {
     let ret = ''
     for (let k in data) {
        var value = data[k] === undefined ?  '' : data[k]
        ret +=  `&${k}=${encodeURIComponent(value)}`
     }
     return ret.substr(1)
    }
```
*.小细节
```
    1. 幻灯片图片加载进来后刷新外层scroll
    <img @load="loadImage" :src="item.picUrl">
    loadImage() { // 图片渲染后撑开刷新scroll
      if (!this.checkloaded) {
        this.$refs.scroll.refresh();
        this.checkloaded = true;
      };
    }
    2.
```
*.api处理
```
 // qq音乐某些接口可以直接通过jsonp获取
 // 某些接口做了限制，需要后端代理
 
 1.普通jsonp
    export function getRecommend() { // 获取幻灯片数据
        let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
        const data = {
            g_tk: 1928093487,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            format: 'jsonp',
            platform: 'h5',
            uin: 0,
            needNewCode: 1
        }
        const options = {
            param: 'jsonpCallback'
        }
        return jsonp(url, data, options);
    }
 2.后端代理
    // 后端
    app.get('/api/getDiscList', (req, res) => { // 获取歌单信息
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
        axios.get(url, {
            header: {
                referer: 'https://c.y.qq.com',
                host: 'c.y.qq.com'
            },
            params: req.query
        }).then((response) => {
            res.json(response.data)
        }).catch((err) => {
            console.log(err)
        })
    })
    
    // 前端
    export funtion getDiscList() {
        const data = {
            platform: 'yqq',
            hostUin: 0,
            sin: 0,
            ein: 29,
            sortId: 5,
            needNewCode: 0,
            categoryId: 10000000,
            rnd: Math.random(),
            format: 'json',
            g_tk: 1928093487,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0
        }
        axios.get('/api/getDiscList', {
            params: data
        }).then((res) => {
            return Promise.resolve(res.data)
        })
    }
  
  3. qq音乐歌曲媒体url 需要 mid处理 然后拼成
  // 前端
  // url_mid获取
  let _uid = ''
  function genUrlMid(mids, types) {
      function getUid() {
          if (_uid) {
            return _uid;
          }
          if (!_uid) {
            const t = (new Date).getUTCMilliseconds();
            _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10;
          }
          return _uid
      }
      const guid = getUid()
      return {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid,
          songmid: mids,
          songtype: types,
          uin: '0',
          loginflag: 0,
          platform: '23'
        }
      }
  }
  // 参数mids:[song1.mid, song2.mid, song3.mid....] types[0, 0 ,0, ..song.length]
  
  // 获取purl
  const urlMid = genUrlMid(mids, types);
  const data = {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0
  }
  axios.post('/api/getPurlUrl', {
    comm: data,
    url_mid: urlMid
  }).then((res) => {
    let infos =  res.url_mid.data.midurlinfo;
    songs.forEach((song, index) => {
      song.url = `http://dl.stream.qqmusic.qq.com/${info[index].purl}`; // 拼接真正有效的url
    })
  })
  
 // 后端
 app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.post(url, req.body, {
      headers: {
        referer: 'https://y.qq.com/',
        origin: 'https://y.qq.com',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      res.json(response.data)
    }).catch((e) => {
      console.log(e)
    })
  })
```

  [1]: https://ws1.sinaimg.cn/large/e8323205gy1fqkjptsymkg20qk0hkx6p.jpg
  [2]: https://ws1.sinaimg.cn/large/e8323205gy1fqkknfftvog20qi0hkx6s.jpg
  [3]: https://ws1.sinaimg.cn/large/e8323205gy1fqkkiz79q2g20qi0hkb2a.jpg