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
    }

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

function FieldHandle(label) {
  if (label.length >= 8) {
    var label = label.split(";")[0];
    var label = label.split("；")[0];
    var label = label.split("，")[0];
    var label = label.split(";")[0];
    var label = label.split("。")[0];
    var label = label.split(":")[0];
    var label = label.split("：")[0];
  }

  return label;
}
