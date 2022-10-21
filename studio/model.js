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
}

/**
 * 写入10.1版本的
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

/**
 * 写入10.2版本的
 */
function version10_0_2() {
  var fs = new FS("dsl");
  var menu = Process("models.xiang.menu.get", {
    limit: 1,
  });
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
