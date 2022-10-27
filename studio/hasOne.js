function hasOne(table_name, all_table) {
  const relation = [
    "hasOne_id",
    "hasOneID",
    "hasOneId",
    "PrefixHasOne_id",
    "PrefixhasOneID",
    "PrefixhasOneId",
  ];
  for (var i in relation) {
    all_table = Studio("hasone." + relation[i], table_name, all_table);
  }
  return all_table;
}

function hasOne_id(table_name, all_table) {
  // 先判断hasOne
  var foreign_id = table_name + "_id";
  for (var i in all_table) {
    var temp_column = all_table[i]["columns"];
    for (var j in temp_column) {
      if (temp_column[j]["name"] == foreign_id) {
        all_table[i]["relations"][table_name] = {
          type: "hasOne",
          model: table_name,
          key: "id",
          foreign: foreign_id,
          query: {},
        };
      }
    }
  }
  return all_table;
}
function hasOneID(table_name, all_table) {
  // 先判断hasOne
  var foreign_id = table_name + "ID";
  for (var i in all_table) {
    var temp_column = all_table[i]["columns"];
    for (var j in temp_column) {
      if (temp_column[j]["name"] == foreign_id) {
        all_table[i]["relations"][table_name] = {
          type: "hasOne",
          model: table_name,
          key: "id",
          foreign: foreign_id,
          query: {},
        };
      }
    }
  }
  return all_table;
}
function hasOneId(table_name, all_table) {
  // 先判断hasOne
  var foreign_id = table_name + "Id";
  for (var i in all_table) {
    var temp_column = all_table[i]["columns"];
    for (var j in temp_column) {
      if (temp_column[j]["name"] == foreign_id) {
        all_table[i]["relations"][table_name] = {
          type: "hasOne",
          model: table_name,
          key: "id",
          foreign: foreign_id,
          query: {},
        };
      }
    }
  }
  return all_table;
}
/**
 * 有表前缀的hasone
 * @param {*} table_name
 * @param {*} all_table
 * @param {*} prefix
 * @returns
 */
function PrefixHasOne_id(table_name, all_table) {
  var prefix = Studio("schema.TablePrefix");
  if (prefix.length) {
    // 获取表前缀
    var target = Studio("schema.ReplacePrefix", prefix, table_name);
    var foreign_id = target + "_id";

    for (var i in all_table) {
      var temp_column = all_table[i]["columns"];
      for (var j in temp_column) {
        if (temp_column[j]["name"] == foreign_id) {
          all_table[i]["relations"][table_name] = {
            type: "hasOne",
            model: table_name,
            key: "id",
            foreign: foreign_id,
            query: {},
          };
        }
      }
    }
  }
  return all_table;
}
/**
 * 有表前缀的hasone
 * @param {*} table_name
 * @param {*} all_table
 * @param {*} prefix
 * @returns
 */
function PrefixhasOneID(table_name, all_table) {
  var prefix = Studio("schema.TablePrefix");
  if (prefix.length) {
    // 获取表前缀
    var target = Studio("schema.ReplacePrefix", prefix, table_name);
    var foreign_id = target + "ID";

    for (var i in all_table) {
      var temp_column = all_table[i]["columns"];
      for (var j in temp_column) {
        if (temp_column[j]["name"] == foreign_id) {
          all_table[i]["relations"][table_name] = {
            type: "hasOne",
            model: table_name,
            key: "id",
            foreign: foreign_id,
            query: {},
          };
        }
      }
    }
  }
  return all_table;
}
/**
 * 有表前缀的hasone
 * @param {*} table_name
 * @param {*} all_table
 * @param {*} prefix
 * @returns
 */
function PrefixhasOneId(table_name, all_table) {
  var prefix = Studio("schema.TablePrefix");
  if (prefix.length) {
    // 获取表前缀
    var target = Studio("schema.ReplacePrefix", prefix, table_name);
    var foreign_id = target + "Id";

    for (var i in all_table) {
      var temp_column = all_table[i]["columns"];
      for (var j in temp_column) {
        if (temp_column[j]["name"] == foreign_id) {
          all_table[i]["relations"][table_name] = {
            type: "hasOne",
            model: table_name,
            key: "id",
            foreign: foreign_id,
            query: {},
          };
        }
      }
    }
  }
  return all_table;
}
