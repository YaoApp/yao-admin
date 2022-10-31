<center>
<div>
<font size=70>Yao Admin</font>
</div>
</center>

# 介绍

Yao Admin 是使用 <a href="https://github.com/YaoApp/yao">Yao</a>构建的项目，通过连接数据库，一键生成管理系统的后台，从而实现真正的零代码。
基于 Yao Studio 的功能，能够生成数据模型，表格样式，表格组件等描述文件。

# Demo

## litemall 商城预览

!["看板预览"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E5%95%86%E5%9F%8E/1666877397184.png)

!["品牌列表"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666874105559.png)

!["商品列表"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666874045840.png)
!["商品规格"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666873908081.png)

## mall 商城预览

!["订单"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E5%95%86%E5%9F%8E/1666876581786.png)

!["商品列表"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E5%95%86%E5%9F%8E/1666876702958.png)
!["优惠券"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E5%95%86%E5%9F%8E/1666876781831.png)

## 安装

克隆本项目到你的电脑 `git clone https://github.com/YaoApp/yao-admin`

## 优势

### 1.配置简单，安装好 Yao 开发环境后，只需要配置数据库连接就能生成好整个后台管理系统。

### 2.能够深度匹配到各个数据表的关联关系，一对多，一对一关系等。

### 3.字段翻译，类型推断准确，能够对不同的字段匹配出对应的组件。

### 4.图片类型自动生成组件和数据结构。

### 5.源码可以自己修改。

### 6.首页数据预览,能够统计数据表

# 起步

## step1:安装好 Yao 开发环境 [环境安装](https://yaoapps.com/doc/%E4%BB%8B%E7%BB%8D/%E5%AE%89%E8%A3%85%E8%B0%83%E8%AF%95)

## step2:克隆本项目,运行 `yao start` 进入到配置页面 `http://127.0.0.1:5099`

## step3:根据步骤配置好数据库链接,等待项目文件生成,然后进入后台管理系统 `http://127.0.0.1:5099/yao/login/admin`

![首页](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666923331542.png)

![登录后](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666923455896.png)

![菜单](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666923632955.png)
