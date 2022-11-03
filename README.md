<p align="center">
    <h1 align="center">Yao Admin</h1>
</p>
<p align="center">
  <a aria-label="website" href="https://yaoapps.com" target="_blank">
    Website
  </a>
  ·
  <a aria-label="producthunt" href="https://www.producthunt.com/posts/yao-app-engine" target="_blank">
    Producthunt
  </a>
  ·
  <a aria-label="twitter" href="https://twitter.com/YaoApp" target="_blank">
    Twitter
  </a>
  ·
  <a aria-label="discord" href="https://discord.gg/nsKmCXwvxU" target="_blank">
    Discord
  </a>
</p>

# Part I：介绍

真零代码，使用 Yao-Admin 连接数据库你就有一个管理后台

## 简介

Yao Admin 采用 <a href="https://github.com/YaoApp/yao">Yao 应用引擎开发</a>，借助强大的 Yao Studio API 和 Yao Brain 平台，自动生成数据模型、表格、表单和图表界面；实现连接数据库，全自动生成一套功能完整的管理后台。适用于快速搭建应用管理后台和 API 接口，快速制作应用 API 接口等场景。

![安装](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/%E6%80%BB%E9%A2%84%E8%A7%88.gif)

## Demo

#### litemall 商城预览 github 项目地址 [仓库](https://github.com/linlinjava/litemall)

!["看板预览"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E9%A2%84%E8%A7%88.gif)

#### mall 商城预览 github 项目地址 [仓库](https://github.com/macrozheng/mall)

![展示页](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E9%A2%84%E8%A7%88.gif)

#### akaunting 预览图 github 项目地址 [仓库](https://github.com/akaunting/akaunting)

![图片预览3](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/akaunting%E9%A2%84%E8%A7%88%E5%9B%BE.gif)

# Part II 为什么使用 Yao Admin

### 1.零代码,连接数据库直接生成管理后台。

### 2.可迭代,根据实际业务需求，按需修改管理界面

### 3.接口生成。低代码方式制作 API 接口，支持多种鉴权方式

# Part III 安装

克隆本项目到你的电脑 `git clone https://github.com/YaoApp/yao-admin`

方式一：`yao get yaoapp/yao-admin`

方式二：`docker run -d --name yao -v yao-admin:/data/app -p 5099:5099 yaoapp/yao:0.10.2-amd64-dev`

安装 Yao 开发环境 [环境安装](https://yaoapps.com/doc/%E4%BB%8B%E7%BB%8D/%E5%AE%89%E8%A3%85%E8%B0%83%E8%AF%95)，项目启动后，进入到配置页面 `http://127.0.0.1:5099`，根据步骤配置好数据库连接,等待项目文件生成,然后进入后台管理系统 `http://127.0.0.1:5099/yao/login/admin`

![首页](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E5%95%86%E5%9F%8E/1666923331542.png)

![登录后](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666923455896.png)

![菜单](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666923632955.png)
