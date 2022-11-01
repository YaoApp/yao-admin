const parents = ["parent", "parent_id", "pid"];
const children = ["children", "children_id", "child", "child_id"];
/**
 * 关联关系分析同一个表中关联关系
 * @param {*} model_name
 * @param {*} columns
 * @param {*} table_struct
 */
function child(model_name, columns, table_struct) {
  for (var i in columns) {
    if (columns[i]["type"] != "integer") {
      continue;
    }
    if (children.indexOf(columns[i]["name"]) != -1) {
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
function parent(model_name, columns, table_struct) {
  for (var i in columns) {
    if (columns[i]["type"] != "integer") {
      continue;
    }
    if (parents.indexOf(columns[i]["name"]) != -1) {
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
    all_table_struct = Studio(
      "hasone.hasOne",
      all_table_struct[i]["table"]["name"],
      all_table_struct
    );
    for (var j in temp) {
      all_table_struct = Studio(
        "hasmany.hasMany",
        all_table_struct[i]["table"]["name"],
        temp[j].name,
        all_table_struct
      );
    }
  }
  return all_table_struct;
}

// yao studio run relation.translate icon
function translate(keywords) {
  if (keywords == "id" || keywords == "ID") {
    return "id";
  }
  var keywords = keywords.split("_");
  //console.log(keywords);
  var url = "https://brain.yaoapps.com/api/keyword/column";
  let response = Process(
    "xiang.network.PostJSON",
    url,
    {
      keyword: keywords,
    },
    {}
  );
  var res = keywords;
  if (response.status == 200) {
    if (response.data.data) {
      var res = "";
      for (var i in response.data.data) {
        var res = res + response.data.data[i]["label"];
      }
    }
  }
  return res;
}

/**
 * 批量翻译
 * @param {*} keywords
 * @returns
 */
function BatchTranslate(keywords) {
  var url = "https://brain.yaoapps.com/api/keyword/batch_column";
  let response = Process(
    "xiang.network.PostJSON",
    url,
    {
      keyword: keywords,
    },
    {}
  );
  var res = keywords;
  if (response.status == 200) {
    if (response.data.data) {
      // console.log(response.data.data);
      return response.data.data;
    }
  }
  return res;
}
/**
 * Model dsl全部翻译翻译
 * @param {*} keywords
 * @returns
 */
function BatchModel(keywords) {
  var url = "https://brain.yaoapps.com/api/keyword/batch_model";
  let response = Process(
    "xiang.network.PostJSON",
    url,
    {
      keyword: keywords,
    },
    {}
  );

  var res = keywords;
  if (response.status == 200) {
    if (response.data.data) {
      // console.log(response.data.data);
      return response.data.data;
    }
  }
  return res;
}
