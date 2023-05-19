//yao studio run model.Create
/**
 * 创建模型
 */
function Create() {
  console.log(parseInt(Date.now() / 1000));
  var model_dsl = Studio("schema.Relation");

  var fs = new FS("dsl");
  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".mod.yao";
    var table = JSON.stringify(model_dsl[i]);
    Studio("move.Move", "models", table_name);
    fs.WriteFile("/models/" + table_name, table);
  }
  Process("models.admin.user.migrate");
  console.log(parseInt(Date.now() / 1000));
  // 创建表格dsl
  Studio("table.Create", model_dsl);
  version10_0_3();
  login();
  // 创建菜单
  Studio("menu.Create", model_dsl);
  console.log(parseInt(Date.now() / 1000));
}

//创建单个表格的studio
///yao studio run model.CreateOne address
function CreateOne(model_name) {
  // console.log("进入studio");
  //console.log(model_name);
  var fs = new FS("dsl");
  var model_dsl = [];

  model_dsl.push(JSON.parse(fs.ReadFile("models/" + model_name + ".mod.yao")));

  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".mod.yao";
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
      setup: "studio.model.Create",
      adminRoot: "yao",
      optional: {
        hideNotification: true,
        hideSetting: false,
      },
    })
  );
}
/**
 * 写入10.2版本的
 */
function version10_0_3() {
  var fs = new FS("dsl");

  fs.WriteFile(
    "app.yao",
    JSON.stringify({
      xgen: "1.0",
      name: "::Demo Application",
      short: "::Demo",
      description: "::Another yao application",
      version: "yao-0.10.3-dev",
      adminRoot: "admin",
      setup: "studio.model.Create",
      menu: {
        process: "flows.app.menu",
        args: ["demo"],
      },
      optional: {
        hideNotification: true,
        hideSetting: false,
        neo: {
          api: "/neo",
        },
      },
    })
  );
}
function login() {
  var fs = new FS("dsl");
  // var menu = Process("models.xiang.menu.get", {
  //   limit: 1,
  // });
  var table_name = "admin.login.yao";
  var table = JSON.stringify({
    name: "::Admin Login",
    action: {
      process: "yao.login.Admin",
      args: [":payload"],
    },
    layout: {
      entry: "/x/Chart/dashboard",
      // captcha: "yao.utils.Captcha",
      //cover: "/assets/images/login/cover.svg",
      slogan: "::Make Your Dream With Yao App Engine",
      site: "https://yaoapps.com?from=yao-admin",
    },
  });
  Studio("move.Move", "logins", table_name);
  fs.WriteFile("/logins/" + table_name, table);
}
