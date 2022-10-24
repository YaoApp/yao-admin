function select(relation_name, relation) {
  var column = Process("schemas.default.TableGet", relation.model);
  var column = column.columns;
  var res = Speculation(column);
  if (!res) {
    var res = Other(column);
  }
  CreateScripts(relation_name, res, relation);
  return res;
}

/**
 * 字段推测
 * @param {*} column
 * @returns
 */
function Speculation(column) {
  var target = ["name", "title"];
  for (var i in target) {
    var res = GetTarget(target[i], column);
    if (res) {
      return res;
    }
  }
  return false;
}
function GetTarget(target, column) {
  for (var i in column) {
    if (column[i].name.indexOf(target) != -1) {
      return column[i].name;
    }
  }
  return false;
}

/**
 * 没有其他的话,就找个string类型的
 * @param {*} column
 * @returns
 */
function Other(column) {
  for (var i in column) {
    if (column[i].type == "string") {
      return column[i].name;
    }
  }
  return "id";
}

/**
 * 生成查询的js脚本
 * @param {*} relation_name
 * @param {*} name
 */
function CreateScripts(relation_name, name, relation) {
  var field_name = relation_name + ".js";
  var fs = new FS("script");
  var form_dsl = `function GetSelect() {
    var query = new Query();
    var res = query.Get({
      select: ["id as value", "${name} as label"],
      from: "${relation.model}",
    });
    return res;
  }
  `;
  //console.log(form_dsl);

  Studio("move.Move", "scripts", field_name);
  fs.WriteFile("/" + field_name, form_dsl);
}

// function GetSelect() {
//   var query = new Query();
//   var res = query.Get({
//     select: ["id as value", "${name} as label"],
//     from: "${relation_name}",
//   });
//   return res;
// }
