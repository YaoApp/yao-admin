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
    //col.columns = Studio("relation.BatchTranslate", col.columns);
    // console.log(col.columns);
    // return;

    var id_flag = false;
    for (var j in col.columns) {
      if (col.columns[j]["name"] == "id" || col.columns[j]["name"] === "ID") {
        id_flag = true;
      }
      // col.columns[j]["label"] = FieldHandle(col.columns[j]["label"]);
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
    // 如果没有id的表就不要显示了
    if (!id_flag) {
      all_table.splice(i, 1);
      continue;
    }

    // 去除表前缀
    var trans = ReplacePrefix(prefix, all_table[i]);

    col.name = trans;
    //col.name = Studio("relation.translate", trans);
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

  table_arr = Studio("relation.BatchModel", table_arr);

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
  if (!all_table_name || !all_table_name.length) {
    var all_table_name = GetTableName();
  }
  var prefix = [];
  for (var i in all_table_name) {
    var temp = all_table_name[i].split("_");
    // 如果表格下划线有3个以上,有可能有表前缀
    if (temp.length >= 3 && prefix.indexOf(temp[0]) == -1) {
      prefix.push(temp[0]);
    }
  }
  return prefix;
}

// 把表前缀替换掉
function ReplacePrefix(prefix, target) {
  if (prefix.length) {
    for (var i in prefix) {
      target = target.replace(prefix[i] + "_", "");
    }
  }
  return target;
}
