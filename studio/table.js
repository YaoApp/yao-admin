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
  // 创建菜单
  Studio("menu.Create", model_dsl);
}
