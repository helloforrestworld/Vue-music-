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
1. icomoon制作字体图标
2. 基础less
    > a. 颜色规范
      b. mixin
      c. reset
      d. icon
3. eslint规则改写
4. babel-runtime babel-ployfill  // es6一些API polyfill
5. fastclick
```
    import fastclick from 'fastclick'; // 消除移动端点击延迟
    fastclick.attach(document.body);
```
6.. vue-lazyload // 图片懒加载
```
    Vue.use(VueLazyLoad, {
      loading: require('common/image/default.png')
    });
```
7..目录结构
> src => api base common components router store

8.. webpack配置别名路径
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

  [1]: https://ws1.sinaimg.cn/large/e8323205gy1fqkjptsymkg20qk0hkx6p.jpg
  [2]: https://ws1.sinaimg.cn/large/e8323205gy1fqkknfftvog20qi0hkx6s.jpg
  [3]: https://ws1.sinaimg.cn/large/e8323205gy1fqkkiz79q2g20qi0hkb2a.jpg