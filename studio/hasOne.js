function hasOne(table_name, all_table) {
  const relation = ["hasOne_id", "hasOneID", "hasOneId"];
  for (var i in relation) {
    all_table = Studio("hasOne." + relation[i], table_name, all_table);
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
