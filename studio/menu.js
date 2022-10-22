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
      "/x/Table/" + name,
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
