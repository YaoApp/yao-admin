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
  return table_struct;
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
  return table_struct;
}

function other(all_table_struct) {
  for (var i in all_table_struct) {
    var temp = all_table_struct[i]["columns"];

    for (var j in temp) {
      all_table_struct = hasOne(
        all_table_struct[i]["table"]["name"],
        all_table_struct
      );
      all_table_struct = hasMany(
        all_table_struct[i]["table"]["name"],
        temp[j]["name"],
        all_table_struct
      );
    }
  }
  return all_table_struct;
}

function hasMany(table_name, field_name, all_table) {
  // 判断hasMany
  // 如果包含下划线+id,说明他有可能是别的表的外键
  if (field_name.indexOf("_id") != -1) {
    for (var i in all_table) {
      var target = field_name.replace("_id", "");

      if (target == all_table[i]["table"]["name"]) {
        all_table[i]["relations"][table_name] = {
          type: "hasMany",
          model: table_name,
          key: field_name,
          foreign: "id",
          query: {},
        };
      }
    }
  }
  return all_table;
}
function hasOne(table_name, all_table) {
  // 先判断hasOne
  var foreign_id = table_name + "_id";
  for (var i in all_table) {
    var temp_column = all_table[i]["columns"];
    for (var j in temp_column) {
      if (temp_column[j]["name"] == foreign_id) {
        all_table[i]["relations"][table_name] = {
          type: "hasOne",
          model:table_name,
          key: "id",
          foreign: foreign_id,
          query: {},
        };
      }
    }
  }
  return all_table;
}
