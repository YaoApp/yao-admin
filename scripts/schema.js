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
function GetTables() {
  let res = Process("schemas.default.Tables");
  for (var i in res) {
    //  todo 分析表字段关联关系
  }
}

/**
 * 分析关联关系
 * @param {*} type
 */
function Relation(type) {}

/**
 * 获取图标
 */
function Icon() {}
