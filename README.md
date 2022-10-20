# 使用 Yao Studio 来构建 Admin 后台

Yao Studio 是[0.10.2 版本](https://release-sv-1252011659.cos.na-siliconvalley.myqcloud.com/archives/yao-0.10.2-linux-amd64)新增的一个功能，该功能主要分为三个部分：[连接器](https://yaoapps.com/doc/%E6%89%8B%E5%86%8C/Widgets/Connector)，模型构造器,表格构造器。可以让你连接任意数据库后，一键生成数据表格和模型菜单，减少 80%的工作量。
源码地址：https://github.com/YaoApp/yao-admin

## 第一步：配置连接器

### 新增 MySQL 连接器：`/connectors/mysql.conn.json`文件

```json
{
  "LANG": "1.0.0",
  "VERSION": "1.0.0",
  "label": "MySQL 8.0 TEST",
  "type": "mysql",
  "version": "8.0.26",
  "options": {
    "db": "test",
    "charset": "utf8mb4",
    "parseTime": true,
    "hosts": [
      {
        "host": "127.0.0.1",
        "port": "3306",
        "user": "root",
        "pass": "123456",
        "primary": true
      }
    ]
  }
}
```

## 第二步：增加模型构造器，新建文件`/studio/model.js`，有关 Studio 的功能操作要全部写在 studio 文件夹下

```javascript
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
  version10_0_1();
}
/**
 * 写入10.1版本的app.json配置
 */
function version10_0_1() {
  var fs = new FS("dsl");
  var menu = Process("models.xiang.menu.get", {
    limit: 1,
  });
  fs.WriteFile(
    "app.json",
    JSON.stringify({
      name: "Yao",
      short: "Yao",
      description: "Another yao app",
      option: {
        nav_user: "xiang.user",
        nav_menu: "xiang.menu",
        hide_user: false,
        hide_menu: false,
        login: {
          entry: {
            admin: menu[0]["path"],
          },
        },
      },
    })
  );
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
schema.js文件内容

```javascript
/**
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

  //去除系统自带的表
  for (var i in all_table) {
    if (
      all_table[i] == "xiang_menu" ||
      all_table[i] == "xiang_user" ||
      all_table[i] == "xiang_workflow" ||
      all_table[i] == "pet"
    ) {
      continue;
    }

    var col = GetTable(all_table[i]);

    col.name = Studio("relation.translate", all_table[i]);
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
```

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

    for (var j in temp) {
      all_table_struct = hasOne(
        all_table_struct[i]["table"]["name"],
        all_table_struct
      );
      all_table_struct = hasMany(
        all_table_struct[i]["table"]["name"],
        temp[j]["name"],
        all_table_struct
      );
    }
  }
  return all_table_struct;
}

function hasMany(table_name, field_name, all_table) {
  // 判断hasMany
  // 如果包含下划线+id,说明他有可能是别的表的外键
  if (field_name.indexOf("_id") != -1) {
    for (var i in all_table) {
      var target = field_name.replace("_id", "");

      if (target == all_table[i]["table"]["name"]) {
        all_table[i]["relations"][table_name] = {
          type: "hasMany",
          model: table_name,
          key: field_name,
          foreign: "id",
          query: {},
        };
      }
    }
  }
  return all_table;
}
function hasOne(table_name, all_table) {
  // 先判断hasOne
  var foreign_id = table_name + "_id";
  for (var i in all_table) {
    var temp_column = all_table[i]["columns"];
    for (var j in temp_column) {
      if (temp_column[j]["name"] == foreign_id) {
        all_table[i]["relations"][table_name] = {
          type: "hasOne",
          model: table_name,
          key: "id",
          foreign: foreign_id,
          query: {},
        };
      }
    }
  }
  return all_table;
}

//获取菜单图标接口: yao studio run relation.translate icon
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
 * 查看文件是否存在
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

## 第三步：增加表格构造器，新建文件`/studio/table.js`

```javascript
/**
 * 创建表格
 */
function Create(model_dsl) {
  var fs = new FS("dsl");
  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".tab.json";
    var dsl = toTable(model_dsl[i]);
    var table = JSON.stringify(dsl);
    Studio("move.Move", "tables", table_name);
    fs.WriteFile("/tables/" + table_name, table);
  }
  // 创建菜单
  Studio("menu.Create", model_dsl);
}

function toTable(model_dsl) {
  const columns = model_dsl.columns || [];
  var tableTemplate = {
    name: model_dsl.name || "表格",
    version: "1.0.0",
    decription: model_dsl.decription || "表格",
    bind: { model: model_dsl.table.name },
    columns: {},
    filters: {},
    list: {
      primary: "id",
      layout: { columns: [], filters: [] },
      actions: {
        pagination: { props: { showTotal: true } },
        create: { props: { label: "添加" } },
      },
      option: { operation: { unfold: true } },
    },
    edit: {
      primary: "id",
      layout: {
        fieldset: [{ columns: [] }],
      },
      actions: {
        cancel: {},
        save: {},
        delete: { type: "button", props: { label: "删除" } },
      },
      option: { dev: true },
    },
  };
  columns.forEach((column) => {
    var col = castTableColumn(column);
    if (col) {
      col.columns.forEach((c) => (tableTemplate.columns[c.name] = c.component));
      col.filters.forEach((f) => (tableTemplate.filters[f.name] = f.filter));
      col.edit.forEach((c) =>
        tableTemplate.edit.layout.fieldset[0].columns.push(c)
      );
      col.list.columns.forEach((c) =>
        tableTemplate.list.layout.columns.push(c)
      );
      col.list.filters.forEach((f) =>
        tableTemplate.list.layout.filters.push(f)
      );
    }
  });
  return tableTemplate;
}
function castTableColumn(column) {
  column = column || {};
  const props = column.props || {};
  const title = column.label;
  const name = column.name;

  const bind = `:${name}`;
  if (!name) {
    log.Error("castTableColumn: missing name");
    return false;
  }

  if (!title) {
    log.Error("castTableColumn: missing title");
    return false;
  }

  var res = {
    columns: [],
    filters: [],
    list: { columns: [], filters: [] },
    edit: [],
  };

  var component = {
    label: title,
    view: { type: "label", props: { value: `:${name}` } },
    edit: {},
  };

  switch (column.type) {
    case "string":
      component.edit = { type: "input", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "text":
      component.edit = { type: "textArea", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "integer":
      component.edit = { type: "input", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "decimal":
      component.edit = { type: "input", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "datetime":
      component.edit = { type: "datePicker", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "enum":
      component.edit = { type: "select", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    default:
      log.Error("castTableColumn: Type %s does not support", column.type);
      return false;
  }

  res.columns.push({ name: title, component: component });

  // Convert to filter based on DSL description
  if (column.search) {
    var filter = {
      label: title,
      bind: `where.${name}.match`,
      input: {
        type: "input",
        props: { placeholder: props.placeholder || `type ${title}...` },
      },
    };
    res.filters.push({ name: title, filter: filter });
    res.list.filters.push({ name: title });
  }

  return res;
}
```

新增菜单图标脚本 `/studio/menu.js`

```javascript
function Create(model_dsl) {
  Process("models.xiang.menu.DestroyWhere", {
    wheres: [{ column: "id", op: "ne", value: 0 }],
  });
  var columns = [
    "name",
    "path",
    "icon",
    "rank",
    "status",
    "parent",
    "visible_menu",
    "blocks",
  ];
  var insert = [];
  for (var i in model_dsl) {
    var name = model_dsl[i]["table"]["name"];
    var icon = GetIcon(name);
    insert[i] = [
      model_dsl[i].name,
      "/table/" + name,
      icon,
      i + 1,
      "enabled",
      null,
      0,
      0,
    ];
  }
  Process("models.xiang.menu.insert", columns, insert);
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

最后运行命令`yao studio run model.Create`,我们可以看到创建了不少的数据模型和表格,我们运行`yao start`访问一下`127.0.0.1:5099/xiang/admin/login`,输入默认用户名: `xiang@iqka.com`， 密码: `A123456p+`
