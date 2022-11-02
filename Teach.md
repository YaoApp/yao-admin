# 使用方法:

克隆项目后,执行 `yao start`,打开配置界面`http://127.0.0.1:5099`配置好数据库配置

![配置界面](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E5%95%86%E5%9F%8E/1.png)

![界面2](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/mall%E5%95%86%E5%9F%8E/2.png)

等待数据表生成以后,就可以打开登录界面 `http://127.0.0.1:5099/yao/login/admin`输入默认用户名: `xiang@iqka.com`， 密码: `A123456p+`

<br>

# 教程：使用 Yao Studio 来构建 Admin 后台

Yao Studio 是[0.10.2 版本](https://release-sv-1252011659.cos.na-siliconvalley.myqcloud.com/archives/yao-0.10.2-linux-amd64)新增的一个功能，该功能主要分为三个部分：模型构造器,表格构造器,组件菜单构造器。可以让你连接任意数据库后，一键生成数据表格和模型菜单，减少 99%的工作量,实现真正的零代码。
源码地址：https://github.com/YaoApp/yao-admin

## 效果预览图

!["品牌列表"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666694365169.png)

!["商品列表"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666694653147.png)
!["优惠券"](https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/litemall%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%95%86%E5%9F%8E/1666694544787.png)

studio 文件结构说明

```
├─studio
│  ├─colunm.js
│  ├─dashboard.js
│  ├─hasmany.js
│  ├─hasone.js
│  ├─menu.js
│  ├─model.js
│  ├─move.js
│  ├─relation.js
│  ├─remote.js
│  ├─schema.js
│  ├─selector.js
│  └─table.js
```

studio 文件说明

| 文件         | 类型       | 说明                                       |
| ------------ | ---------- | ------------------------------------------ |
| colunm.js    | javascript | 用于 tables 和 forms 文件字段生成的脚本    |
| dashboard.js | javascript | 登录进去后首页展示的看板图脚本             |
| hasmany.js   | javascript | 用于一对多关联关系的推测与生成的规则的脚本 |
| hasone.js    | javascript | 用于一对一关联关系的推测脚本               |
| menu.js      | javascript | 生成登录菜单和图标的脚本                   |
| model.js     | javascript | 生成模型 DSL 脚本                          |
| move.js      | javascript | 文件操作,目录操作,移动删除脚本             |
| relation.js  | javascript | 其他关联关系规则生成脚本                   |
| remote.js    | javascript | 生成 hasOne 下拉列表接口的脚本             |
| schema.js    | javascript | 模型 dsl 字段处理,表名称处理脚本           |
| selector.js  | javascript | 下拉 select 选择框规则处理                 |
| table.js     | javascript | 表格生成脚本调用                           |

## 第一步：配置数据库连接

### 在`yao start`命令执行过后文件中配置好数据库连接,`.env`文件就会出现如下配置

```bash
YAO_DB_AESKEY="KBPdcRn44LzykphsVM\*y"
YAO_DB_DRIVER=mysql
YAO_DB_PRIMARY="root:123456@tcp(127.0.0.1:3306)/test?charset=utf8mb4&parseTime=True&loc=Local" # 主库连接
YAO_DB_SECONDARY="root:123456@tcp(127.0.0.1:3306)/test?charset=utf8mb4&parseTime=True&loc=Local" # 主库连接
```

## 第二步：增加模型构造器，新建文件`/studio/model.js`，有关 Studio 的功能操作要全部写在 studio 文件夹下

```javascript
//yao studio run model.Create
/**
 * 创建模型
 */
function Create() {
  var model_dsl = Studio("schema.Relation");

  var fs = new FS("dsl");
  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".mod.json";
    var table = JSON.stringify(model_dsl[i]);
    Studio("move.Move", "models", table_name);
    fs.WriteFile("/models/" + table_name, table);
  }
  // 创建表格dsl
  Studio("table.Create", model_dsl);
  version10_0_2();
  login();
  // 创建菜单
  Studio("menu.Create", model_dsl);
}

//创建单个表格的studio
///yao studio run model.CreateOne address
function CreateOne(model_name) {
  var fs = new FS("dsl");
  var model_dsl = [];

  model_dsl.push(JSON.parse(fs.ReadFile("models/" + model_name + ".mod.json")));

  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".mod.json";
    var table = JSON.stringify(model_dsl[i]);
    Studio("move.Move", "models", table_name);
    fs.WriteFile("/models/" + table_name, table);
  }
  // 创建表格dsl
  Studio("table.Create", model_dsl);
  //version10_0_2();
  //login();
}

/**
 * 写入10.2版本的
 */
function version10_0_2() {
  var fs = new FS("dsl");

  fs.WriteFile(
    "app.json",
    JSON.stringify({
      xgen: "1.0",
      name: "::Demo Application",
      short: "::Demo",
      description: "::Another yao application",
      version: "0.10.2",
      menu: {
        process: "flows.app.menu",
        args: ["demo"],
      },
      adminRoot: "yao",
      optional: {
        hideNotification: true,
        hideSetting: false,
      },
    })
  );
}
function login() {
  var fs = new FS("dsl");
  var table_name = "admin.login.json";
  var table = JSON.stringify({
    name: "::Admin Login",
    action: {
      process: "yao.login.Admin",
      args: [":payload"],
    },
    layout: {
      entry: "/x/Chart/dashboard",
      captcha: "yao.utils.Captcha",
      cover: "/assets/images/login/cover.svg",
      slogan: "::Make Your Dream With Yao App Engine",
      site: "https://yaoapps.com",
    },
  });
  Studio("move.Move", "logins", table_name);
  fs.WriteFile("/logins/" + table_name, table);
}
```

| **命令**                   | **说明**                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Studio("schema.Relation"); | Studio 函数,[详情](https://github.com/YaoApp/yao/blob/main/studio/studio.go),调用的是`/studio/schema.Relation`方法                    |
| FS("dsl");                 | 文件操作函数[详情](https://github.com/YaoApp/gou/blob/main/fs/fs_test.go),dsl 是指文件的根目录,可以对文件进行移动删除,复制,新建等操作 |

<br>

`Studio`函数是专门用来调用`/studio`目录下的 js 脚本的,运行该方法，我们可以使用专门的命令：`yao studio run model.Create`,注意：该命令只允许在`YAO_ENV=development`模式下运行

分别新建`/studio/schema.js`和`/studio/relation.js`文件,其中`schema.js`的作用是获取数据库表名称,和表的所有字段,`relation.js`是根据现有的表名称和字段来生成对应的关联关系

<br>

| 方法            | 说明                                        |
| --------------- | ------------------------------------------- |
| Create()        | 生成模型 DSL                                |
| version10_0_2() | 生成 yao-0.10.2 版本的启动配置文件 app.json |
| login()         | 生成 yao-0.10.2 版本登录脚本文件            |

<br>
schema.js文件内容

```javascript
/**yao studio run schema.GetTable role
 * 获取单个表字段
 * @param {*} name
 * @returns
 */
function GetTable(name) {
  let res = Process("schemas.default.TableGet", name);
  return res;
}
/**
 * 获取所有表格名称
 */
function GetTableName() {
  let res = Process("schemas.default.Tables");
  return res;
}

/**
 * 分析关联关系处理器
 * @param {*} type
 * yao run scripts.schema.Relation
 */
function Relation() {
  var all_table = GetTableName();
  var table_arr = [];

  // 不需要的表格白名单
  var guards = ["xiang_menu", "xiang_user", "xiang_workflow", "pet"];
  var prefix = TablePrefix(all_table);

  for (var i in all_table) {
    if (guards.indexOf(all_table[i]) != -1) {
      continue;
    }

    var col = GetTable(all_table[i]);

    for (var j in col.columns) {
      if (!col.columns[j]["label"]) {
        col.columns[j]["label"] = Studio(
          "relation.translate",
          col.columns[j]["name"]
        );
      }
      col.columns[j]["label"] = FieldHandle(col.columns[j]["label"]);
      if (col.columns[j]["type"] == "dateTime") {
        col.columns[j]["type"] = "datetime";
      }
      if (col.columns[j]["type"] == "BIT" || col.columns[j]["type"] == "bit") {
        col.columns[j]["type"] = "boolean";
      }
      if (
        col.columns[j]["type"] == "MEDIUMINT" ||
        col.columns[j]["type"] == "mediumint"
      ) {
        col.columns[j]["type"] = "tinyInteger";
      }
    }

    // 去除表前缀
    var trans = ReplacePrefix(prefix, all_table[i]);

    col.name = Studio("relation.translate", trans);
    col.decription = col.name;
    col.table = {};
    col.table.name = all_table[i];
    col.table.comment = col.name;
    col.relations = {};
    var parent = Studio("relation.parent", all_table[i], col.columns, col);
    var parent = Studio("relation.child", all_table[i], col.columns, parent);

    table_arr.push(parent);
  }

  table_arr = Studio("relation.other", table_arr);

  return table_arr;
}

function FieldHandle(label) {
  if (label.length >= 8) {
    var label = label.split(";")[0];
    var label = label.split("；")[0];
    var label = label.split("，")[0];
    var label = label.split(";")[0];
    var label = label.split("。")[0];
    var label = label.split(":")[0];
    var label = label.split("：")[0];
    var label = label.split(",")[0];
    var label = label.split("，")[0];
  }

  return label;
}
//yao studio run schema.TablePrefix
function TablePrefix(all_table_name) {
  if (!all_table_name.length) {
    var all_table_name = GetTableName();
  }
  var prefix = [];
  for (var i in all_table_name) {
    var temp = all_table_name[i].split("_");
    // 如果表格下划线有3个以上,有可能有表前缀
    if (temp.length >= 4 && prefix.indexOf(temp[0]) == -1) {
      prefix.push(temp[0]);
    }
  }
  return prefix;
}

function ReplacePrefix(prefix, target) {
  if (prefix.length) {
    for (var i in prefix) {
      target = target.replace(prefix[i] + "_", "");
      return target;
    }
  }
  return target;
}
```

<br>

| 方法                             | 说明                                 |
| -------------------------------- | ------------------------------------ |
| GetTable()                       | 主要是通过表格名称用来获取表格的字段 |
| GetTableName()                   | 获取当前数据库连接的表格名称         |
| Relation()                       | 关联关系推测脚本                     |
| FieldHandle()                    | 防止字段过长,截取字段的              |
| TablePrefix() 和 ReplacePrefix() | 去除表前缀                           |

<br>

relation.js 文件内容

```javascript
const parents = ["parent", "parent_id", "pid"];
const children = ["children", "children_id", "child", "child_id"];
/**
 * 关联关系分析同一个表中关联关系
 * @param {*} model_name
 * @param {*} columns
 * @param {*} table_struct
 */
function parent(model_name, columns, table_struct) {
  for (var i in columns) {
    if (columns[i]["type"] != "integer") {
      continue;
    }
    if (parents.indexOf(columns[i]["name"]) != -1) {
      table_struct.relations.children = {
        type: "hasMany",
        model: model_name,
        key: columns[i]["name"],
        foreign: "id",
        query: {},
      };
      return table_struct;
    }
  }
  return table_struct;
}

/**
 * 分析子集
 * @param {*} model_name
 * @param {*} columns
 * @param {*} table_struct
 * @returns
 */
function child(model_name, columns, table_struct) {
  for (var i in columns) {
    if (columns[i]["type"] != "integer") {
      continue;
    }
    if (children.indexOf(columns[i]["name"]) != -1) {
      table_struct.relations.parent = {
        type: "hasOne",
        model: model_name,
        key: "id",
        foreign: columns[i]["name"],
        query: {},
      };
      return table_struct;
    }
  }
  return table_struct;
}

function other(all_table_struct) {
  for (var i in all_table_struct) {
    var temp = all_table_struct[i]["columns"];
    all_table_struct = Studio(
      "hasone.hasOne",
      all_table_struct[i]["table"]["name"],
      all_table_struct
    );
    for (var j in temp) {
      all_table_struct = Studio(
        "hasmany.hasMany",
        all_table_struct[i]["table"]["name"],
        temp[j].name,
        all_table_struct
      );
    }
  }
  return all_table_struct;
}

// yao studio run relation.translate icon
function translate(keywords) {
  var url = "https://brain.yaoapps.com/api/keyword/column";
  let response = Process(
    "xiang.network.PostJSON",
    url,
    {
      keyword: [keywords],
    },
    {}
  );
  var res = keywords;
  if (response.status == 200) {
    if (response.data.data) {
      var res = response.data.data[0]["label"];
    }
  }
  return res;
}
```

<br>

| 方法        | 说明                                     |
| ----------- | ---------------------------------------- |
| parent()    | 父级 id 的关联关系推测                   |
| child()     | 子集 id 的关联关系推测                   |
| other()     | 其他关联关系推测                         |
| translate() | 调用 yao-brain 的翻译接口,对字段进行翻译 |

<br>

新建`/studio/move.js`该文件主要用于文件移动,在新建模型文件和表格文件的时候,如果发现同名的文件会把文件移动到`.trash`文件夹下面,然后新建一个文件

```javascript
/**
 * 文件复制移动逻辑
 */
function Move(dir, name) {
  const fs = new FS("dsl");
  var base_dir = ".trash";
  // 判断文件夹是否存在.不存在就创建
  Mkdir(base_dir);
  var new_dir = parseInt(Date.now() / 1000);
  // models的文件移动到
  var target_name = dir + "/" + name;
  // 如果表已经存在,则
  if (Exists(dir, name)) {
    Mkdir(base_dir + "/" + new_dir);
    Copy(target_name, base_dir + "/" + new_dir, name);

    // 复制完成后,删除文件
    fs.Remove(target_name);
  } else {
    return false;
  }
}
function Mkdir(name) {
  const fs = new FS("dsl");
  var res = fs.Exists(name);
  if (res !== true) {
    fs.Mkdir(name);
  }
}

function Copy(from, to, name) {
  const fs = new FS("dsl");
  fs.Copy(from, to + "/" + name);
}
/**
 * 查看模型是否存在
 * @param {*} file_name
 * @returns
 */
function Exists(dir, file_name) {
  const fs = new FS("dsl");
  file_name = file_name;
  var res = fs.Exists(dir + "/" + file_name);
  return res;
}
```

<br>

| 方法     | 说明                                            |
| -------- | ----------------------------------------------- |
| Move()   | 文件移动,如果文件已经存在,复制到.trash 文件夹内 |
| Mkdir()  | 生成目录                                        |
| Copy()   | 复制文件                                        |
| Exists() | 判断文件是否存在                                |

<br>

## 第三步：增加表格构造器，新建文件`/studio/table.js`

```javascript
//yao studio run table.Create
/**
 * 创建表格
 */
function Create(model_dsl) {
  var fs = new FS("dsl");
  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".tab.json";
    //var dsl = toTable(model_dsl[i]);
    var dsl = Studio("colunm.toTable", model_dsl[i]);
    var table = JSON.stringify(dsl);
    Studio("move.Move", "tables", table_name);
    fs.WriteFile("/tables/" + table_name, table);

    ///
    var form_name = model_dsl[i]["table"]["name"] + ".form.json";
    var form_dsl = Studio("colunm.toForm", model_dsl[i]);
    var form = JSON.stringify(form_dsl);
    Studio("move.Move", "forms", form_name);
    fs.WriteFile("/forms/" + form_name, form);
  }
}
```

新增菜单图标脚本 `/studio/menu.js`

```javascript
function Create(model_dsl) {
  var insert = [];
  insert.push({
    blocks: 0,
    icon: "icon-activity",
    id: 1,
    name: "图表",
    parent: null,
    path: "/x/Chart/dashboard",
    visible_menu: 0,
  });
  for (var i in model_dsl) {
    var name = model_dsl[i]["table"]["name"];
    var icon = GetIcon(name);
    insert.push({
      name: model_dsl[i].name,
      path: "/x/Table/" + name,
      icon: icon,
      rank: i + 1,
      status: "enabled",
      parent: null,
      visible_menu: 0,
      blocks: 0,
      id: (i + 1) * 10,
      model: name,
    });
  }
  Studio("move.Mkdir", "flows/app");
  var fs = new FS("dsl");
  var dsl = {
    name: "APP Menu",
    nodes: [],
    output: insert,
  };
  var dsl = JSON.stringify(dsl);
  fs.WriteFile("/flows/app/menu.flow.json", dsl);

  // 创建看板
  Studio("dashboard.Create", insert);

  //Process("models.xiang.menu.insert", columns, insert);
}

/**yao studio run menu.icon user
 * 获取菜单图标
 * @param {*} name
 */
function GetIcon(name) {
  var url = "https://brain.yaoapps.com/api/icon/search?name=" + name;
  let response = Process("xiang.network.Get", url, {}, {});
  if (response.status == 200) {
    return response.data.data;
  }
  return "icon-box";
}
```

新增 `dashboard.js`,用于生成登录后面板的看板数据统计

```javascript
function Create(menu_arr) {
  var fs = new FS("dsl");

  Studio("move.Move", "charts", "dashboard.chart.json");
  var dsl = Dsl(menu_arr);
  var dsl = JSON.stringify(dsl);
  fs.WriteFile("/charts/" + "dashboard.chart.json", dsl);
  WriteScript();
}
function Dsl(menu_arr) {
  var dsl = {
    name: "数据图表",
    action: {
      data: { process: "scripts.dashboard.Data", default: ["2022-09-20"] },
    },
    layout: {
      operation: {
        actions: [],
      },
      filter: {},
      chart: {
        columns: [],
      },
    },
    fields: {
      filter: {},
      chart: {},
    },
  };
  var chart = {
    表格数量: {
      bind: "table_count",

      view: { type: "Number", props: { unit: "个" } },
    },
    模型数量: {
      bind: "model_count",
      view: { type: "Number", props: { unit: "个" } },
    },
  };
  var columns = [
    { name: "表格数量", width: 12 },
    { name: "模型数量", width: 12 },
  ];

  menu_arr.forEach((col) => {
    if (col.id != 1) {
      var title = col.name + "(" + col.model + ")" + "记录数";
      chart[title] = {
        bind: col.model,
        link: "/x/Table/" + col.model,
        view: { type: "Number", props: { unit: "条" } },
      };
      columns.push({ name: title, width: 6 });
    }
  });
  dsl.layout.chart.columns = columns;
  dsl.fields.chart = chart;
  return dsl;
}
function WriteScript() {
  var sc = new FS("script");
  var scripts = `function Data() {
    let res = Process("schemas.default.Tables");

    var script = {
      table_count: res.length,
      model_count: res.length,
    };
    for (var i in res) {
      script[res[i]] = GetCount(res[i]);
    }
    return script;
  }
  function GetCount(model) {
    var query = new Query();
    var res = query.Get({
      select: [":COUNT(id) as 数量"],
      from: model,
    });
    if (res && res.length && res[0]["数量"] > 0) {
      return res[0]["数量"];
    }
    return 0;
  }`;
  sc.WriteFile("/dashboard.js", scripts);
}
```

最后运行调试命令`yao studio run model.Create`,我们可以看到创建了不少的数据模型和表格,我们运行`yao start`访问一下`http://127.0.0.1:5099/yao/login/admin`,输入默认用户名: `xiang@iqka.com`， 密码: `A123456p+`
