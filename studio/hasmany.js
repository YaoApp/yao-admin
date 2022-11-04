function hasMany(table_name, field_name, all_table) {
  var relation = [
    "hasMany_id",
    "hasMany_ID",
    "hasMany_Id",
    "PerfixhasMany_id",
    "PerfixhasMany_ID",
    "PerfixhasMany_Id",
  ];
  for (var i in relation) {
    all_table = Studio(
      "hasmany." + relation[i],
      table_name,
      field_name,
      all_table
    );
  }
  return all_table;
}
function hasMany_id(table_name, field_name, all_table) {
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
function hasMany_ID(table_name, field_name, all_table) {
  // 判断hasMany
  // 如果包含下划线+id,说明他有可能是别的表的外键
  if (field_name.indexOf("ID") != -1) {
    for (var i in all_table) {
      var target = field_name.replace("ID", "");

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
function hasMany_Id(table_name, field_name, all_table) {
  // 判断hasMany
  // 如果包含下划线+id,说明他有可能是别的表的外键
  if (field_name.indexOf("Id") != -1) {
    for (var i in all_table) {
      var target = field_name.replace("Id", "");

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
function PerfixhasMany_id(table_name, field_name, all_table) {
  // 判断hasMany
  // 如果包含下划线+id,说明他有可能是别的表的外键

  if (field_name.indexOf("_id") != -1) {
    var prefix = Studio("schema.TablePrefix");

    for (var i in all_table) {
      for (var j in prefix) {
        var target = prefix[j] + "_" + field_name.replace("_id", "");
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
  }
  return all_table;
}

function PerfixhasMany_ID(table_name, field_name, all_table) {
  // 判断hasMany
  // 如果包含下划线+id,说明他有可能是别的表的外键

  if (field_name.indexOf("ID") != -1) {
    var prefix = Studio("schema.TablePrefix");

    for (var i in all_table) {
      for (var j in prefix) {
        var target = prefix[j] + "_" + field_name.replace("ID", "");
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
  }
  return all_table;
}
function PerfixhasMany_Id(table_name, field_name, all_table) {
  // 判断hasMany
  // 如果包含下划线+id,说明他有可能是别的表的外键

  if (field_name.indexOf("Id") != -1) {
    var prefix = Studio("schema.TablePrefix");

    for (var i in all_table) {
      for (var j in prefix) {
        var target = prefix[j] + "_" + field_name.replace("Id", "");
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
  }
  return all_table;
}
