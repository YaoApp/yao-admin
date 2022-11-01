function ImagesView(data) {
  if (!data || !data.length) {
    return [];
  }
  if (data.indexOf(`[`) != -1) {
    //console.log(data);
    data = JSON.parse(data);
  } else {
    data = data.split(",");
  }
  return data;
}

function ImagesEdit(value, type, name, model_name) {
  var dsl = Process("schemas.default.TableGet", model_name);
  for (var i in dsl.columns) {
    if (dsl["columns"][i]["name"] == name) {
      if (dsl["columns"][i]["type"] == "json") {
        return value[name];
      } else {
        return JSON.stringify(value[name]);
      }
    }
  }
  return value[name];
}
