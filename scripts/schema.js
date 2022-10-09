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
  // for (var i in res) {
  //   //  todo 分析表字段关联关系
  // }
}

/**
 * 分析关联关系
 * @param {*} type
 */
function Relation() {
  var all_table = GetTableName();
  var table_arr = [];
  for (var i in all_table) {
    var col = GetTable();
    col.name = all_table[i];
    col.table = {};
    col.table.name = all_table[i];
    col.table.comment = all_table[i];
    var parent = Process(
      "scripts.relation.parent",
      all_table[i],
      col.columns,
      col
    );
    var parent = Process(
      "scripts.relation.child",
      all_table[i],
      col.columns,
      parent
    );
    table_arr.push(parent);
  }
  return table_arr;
}

/**
 * 获取图标
 */
function Icon() {}
