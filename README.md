# html5-template
这是一个不使用MVVM框架的html5项目模板. 可以用作简单项目的开发. 

#### 怎么使用? 
一共有3条命令
```
  "scripts": {
    "start": "webpack-dev-server --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "dev": "node ./dev-server.js"
  },
```

- `npm run start` 命令用于开启热加载服务器
- `npm run build` 命令用于编译项目
- `npm run dev` 命令用于开启一个express服务, 可以使用`http://localhost:8080/index`这样的路由访问项目

#### 主要实现的功能

- html的多页自动配置
- 引入scss作css的预处理器
- es6可转es5
- 文件编译后自带hash值
- 文件压缩
- 图片路径处理完毕, 包括html的和css, scss的, 小于某个尺寸下的图片转为base64
- 服务器热加载, 提升开发效率
- 公共库代码分割管理
- 开启source map方便调试
- css打包隔离, 使用link引入

#### 编译后的项目结构

build/
├── css/
│   ├── index.css
│   └── index.css.map
├── js/
│   ├── lib/
│   │   ├── common.js
│   │   └── common.js.map
│   ├── index.js
│   └── index.js.map
├── images/
├── manifest.json
└── index.html