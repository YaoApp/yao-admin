function Create(model_dsl) {
  var insert = [];
  var child = [];
  var total = model_dsl.length;
  insert.push({
    blocks: 0,
    icon: "icon-activity",
    id: 1,
    name: "数据模型",
    parent: null,
    path: "/x/Chart/dashboard",
    visible_menu: 0,
  });

  for (var i in model_dsl) {
    var name = model_dsl[i]["table"]["name"];

    var item = {
      name: model_dsl[i].name,
      path: "/x/Table/" + name,
      icon: "",
      rank: i + 1,
      status: "enabled",
      parent: null,
      visible_menu: 0,
      blocks: 0,
      id: (i + 1) * 10,
      model: name,
      children: [],
    };
    if (total >= 10) {
      item.visible_menu = 1;
      // child.push(item);
      if (i == 0) {
        var icon = "icon-align-justify";
        item.icon = icon;
        insert[1] = item;
      } else {
        insert[1]["children"].push(item);
      }
    } else {
      var icon = GetIcon(name);
      item.icon = icon;
      insert.push(item);
    }
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
  if (total >= 10) {
    Studio("dashboard.Create", insert, 1);
  } else {
    Studio("dashboard.Create", insert, 2);
  }

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
