/**
 * 把hasOne变成下拉选择
 * @param {*} column
 * @param {*} model_dsl
 * @param {*} component
 * @returns
 */
function Select(column, model_dsl, component) {
  const props = column.props || {};
  const title = column.label;
  const name = column.name;

  const bind = `${name}`;
  var relation = model_dsl.relations;
  for (var i in relation) {
    if (relation[i].type == "hasOne" && column.name == relation[i]["foreign"]) {
      var component = {
        bind: bind,
        view: { props: {}, type: "Text" },
        edit: {
          type: "Select",
          props: {
            xProps: {
              $remote: {
                process: "models." + relation[i]["model"] + ".Get",
                query: {},
              },
            },
          },
        },
      };
      return component;
    }
  }
  return component;
}

function EditSelect(column, model_dsl, component) {
  const props = column.props || {};
  const title = column.label;
  const name = column.name;

  const bind = `${name}`;
  var relation = model_dsl.relations;
  for (var i in relation) {
    if (relation[i].type == "hasOne" && column.name == relation[i]["foreign"]) {
      var component = {
        bind: bind,
        edit: {
          type: "Select",
          props: {
            xProps: {
              $remote: {
                process: "models." + relation[i]["model"] + ".Get",
                query: {},
              },
            },
          },
        },
      };
      return component;
    }
  }
  return component;
}

/**
 * 把hasMany变成列表
 */
function Table(form_dsl, model_dsl) {
  var relation = model_dsl.relations;
  for (var i in relation) {
    if (relation[i].type == "hasMany") {
      form_dsl.fields.form["表格" + i] = {
        bind: "id",
        edit: {
          type: "Table",
          props: {
            model: relation[i]["model"],
            query: {},
          },
        },
      };
      form_dsl.layout.form.sections.push({
        title: "表格" + i + "信息",
        desc: "表格" + i + "信息",
        columns: [{ name: "表格" + i, width: 24 }],
      });
    }
  }
  return form_dsl;
}
