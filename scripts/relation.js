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
}

function other(model_name, columns, table_struct) {
  
}

function foreignKey(model_name, all_table, all_column) {}
