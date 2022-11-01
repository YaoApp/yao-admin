function getType() {
  return {
    string: "Input",
    char: "Input",
    text: "TextArea",
    mediumText: "TextArea",
    longText: "TextArea",
    date: "DatePicker",
    datetime: "DatePicker",
    datetimeTz: "DatePicker",
    time: "DatePicker",
    timeTz: "DatePicker",
    timestamp: "DatePicker",
    timestampTz: "DatePicker",
    tinyInteger: "Input",
    tinyIncrements: "Input",
    unsignedTinyInteger: "Input",
    smallInteger: "Input",
    unsignedSmallInteger: "Input",
    integer: "Input",
    bigInteger: "Input",
    decimal: "Input",
    unsignedDecimal: "Input",
    float: "Input",
    boolean: "Input",
    enum: "Select",
  };
}
function Hidden(type) {
  if (type == 1) {
    // 不展示的名单列表
    var hidden = [
      "password",
      "del",
      "delete",
      "deleted",
      "deleted_at",
      "pwd",
      "deleted",
    ];
  } else {
    var hidden = [
      "del",
      "delete",
      "deleted",
      "deleted_at",
      "created_at",
      "updated_at",
      "id",
      "ID",
      "update_time",
    ];
  }

  return hidden;
}
function filter() {
  return ["name", "title", "_sn"];
}

function toTable(model_dsl) {
  const columns = model_dsl.columns || [];
  var tableTemplate = {
    name: model_dsl.name || "表格",
    action: {
      bind: {
        model: model_dsl.table.name,
        option: { withs: {} },
      },
    },
    layout: {
      primary: "id",
      header: { preset: {}, actions: [] },
      filter: {
        columns: [],
        actions: [
          {
            title: "添加",
            icon: "icon-plus",
            width: 3,
            action: {
              "Common.openModal": {
                width: 640,
                Form: { type: "edit", model: model_dsl.table.name },
              },
            },
          },
        ],
      },
      table: {
        columns: [],
        operation: {
          fold: false,
          actions: [
            {
              title: "查看",
              icon: "icon-eye",
              action: {
                "Common.openModal": {
                  width: 640,
                  Form: { type: "view", model: model_dsl.table.name },
                },
              },
            },
            {
              title: "编辑",
              icon: "icon-edit-2",
              action: {
                "Common.openModal": {
                  Form: { type: "edit", model: model_dsl.table.name },
                },
              },
            },
          ],
        },
      },
    },
    fields: {
      filter: {},
      table: {},
    },
  };
  columns.forEach((column) => {
    var col = castTableColumn(column, model_dsl);
    if (col) {
      // col.layout.filter.columns.forEach((fc) => {});
      col.layout.table.columns.forEach((tc) => {
        tableTemplate.layout.table.columns.push(tc);
      });
      col.fields.table.forEach((c) => {
        var cop = c.component.withs || [];
        cop.forEach((fct) => {
          tableTemplate.action.bind.option.withs[fct.name] = {};
        });
        delete c.component.withs;
        tableTemplate.fields.table[c.name] = c.component;
      });

      col.fields.filter.forEach((ff) => {
        tableTemplate.layout.filter.columns.push({ name: ff.name, width: 4 });
        tableTemplate.fields.filter[ff.name] = ff.component;
      });

      // col.fields.filter.forEach((ff) => {});
    }

    // col.fields.table.forEach((ft) => {
    //   tableTemplate.fields.table[ft.name] = ft.component;
    // });
  });

  return tableTemplate;
}

function castTableColumn(column, model_dsl) {
  column = column || {};
  const props = column.props || {};
  const title = column.label;
  const name = column.name;

  // 不展示隐藏列
  var hidden = Hidden(1);
  if (hidden.indexOf(name) != -1) {
    return false;
  }
  var types = getType();

  const bind = `${name}`;
  if (!name) {
    // log.Error("castTableColumn: missing name");
    return false;
  }

  if (!title) {
    //log.Error("castTableColumn: missing title");
    return false;
  }

  var res = {
    layout: { filter: { columns: [] }, table: { columns: [] } },
    fields: { filter: [], table: [] },
  };

  var component = {
    bind: name,
    view: { type: "Text", props: {} },
    edit: {
      type: "Input",
      bind: bind,
      props: {},
    },
  };
  if (title.length > 5) {
    var width = 250;
  } else {
    var width = 200;
  }

  if (column["type"] == "json") {
    // log.Error("castTableColumn: Type %s does not support", column.type);
    return false;
  }
  if (column["type"] == "enum") {
    var component = {
      bind: bind,
      edit: {
        props: {
          options: Enum(column["option"]),
          placeholder: "请选择" + title,
        },
        type: "Select",
      },
      view: { props: {}, type: "Text" },
    };

    res.layout.table.columns.push({
      name: title,
      width: width,
    });
  } else {
    if (column["type"] in types) {
      component.edit.type = types[column["type"]];
      res.layout.table.columns.push({
        name: title,
        width: width,
      });
    }
  }

  component = Studio("selector.Select", column, model_dsl, component);
  if (component.is_select) {
    var where_bind = "where." + name + ".in";
    res.fields.filter.push({
      name: title,
      component: {
        bind: where_bind,
        edit: component.edit,
      },
    });
  } else {
    var filter_target = filter();
    for (var f in filter_target) {
      if (name.indexOf(filter_target[f]) != -1) {
        res.fields.filter.push({
          name: title,
          component: {
            bind: "where." + name + ".match",
            edit: {
              type: "Input",
              compute: "Trim",
              props: { placeholder: "请输入" + title },
            },
          },
        });
      }
    }
  }
  component = Studio("file.File", column, component);

  // component.edit = { type: "input", props: { value: bind } };
  // res.list.columns.push({ name: title });
  // res.edit.push({ name: title, width: 24 });
  // break;

  res.fields.table.push({
    name: title,
    component: component,
  });

  return res;
}

function Enum(option) {
  var res = [];
  for (var i in option) {
    res.push({ label: "::" + option[i], value: option[i] });
  }
  return res;
}

function toForm(model_dsl) {
  const columns = model_dsl.columns || [];
  var tableTemplate = {
    name: model_dsl.name || "表单",
    action: {
      bind: {
        model: model_dsl.table.name,
        option: { withs: {} },
      },
    },
    layout: {
      primary: "id",
      operation: {
        preset: { back: {}, save: { back: true } },
        actions: [
          {
            title: "测试Studio",
            icon: "icon-layers",
            action: {
              "Studio.model": {
                method: "CreateOne",
                args: [model_dsl.table.name],
              },
            },
          },
        ],
      },
      form: {
        props: {},
        sections: [
          {
            columns: [],
          },
        ],
      },
    },
    fields: {
      form: {},
    },
  };
  /**
   *   var res = {
    layout: [],
    fields: {},
  };
   */
  columns.forEach((column) => {
    var col = castFormColumn(column, model_dsl);
    if (col) {
      // col.layout.filter.columns.forEach((fc) => {});
      col.layout.forEach((tc) => {
        tableTemplate.layout.form.sections[0].columns.push(tc);
      });
      col.fields.forEach((ft) => {
        var cop = ft.component.withs || [];
        cop.forEach((fct) => {
          tableTemplate.action.bind.option.withs[fct.name] = {};
        });
        delete ft.component.withs;
        tableTemplate.fields.form[ft.name] = ft.component;
      });

      // col.fields.filter.forEach((ff) => {});
    }
  });
  tableTemplate = Studio("selector.Table", tableTemplate, model_dsl);
  return tableTemplate;
}
function castFormColumn(column, model_dsl) {
  var types = getType();
  column = column || {};
  const title = column.label;
  const name = column.name;

  const bind = `${name}`;
  if (!name) {
    //log.Error("castTableColumn: missing name");
    return false;
  }

  if (!title) {
    // log.Error("castTableColumn: missing title");
    return false;
  }

  // 不展示隐藏列
  var hidden = Hidden(2);
  if (hidden.indexOf(name) != -1) {
    return false;
  }

  var res = {
    layout: [],
    fields: [],
  };

  var component = {
    bind: name,
    edit: {
      type: "Input",
      props: {},
    },
  };
  if (column["type"] == "json") {
    // log.Error("castTableColumn: Type %s does not support", column.type);
    return false;
  } else if (column["type"] == "enum") {
    var component = {
      bind: bind,
      edit: {
        props: {
          options: Enum(column["option"]),
          placeholder: "请选择" + title,
        },
        type: "Select",
      },
    };
  } else {
    if (column["type"] in types) {
      component.edit.type = types[column["type"]];
    }
  }
  var width = 8;
  component = Studio("selector.EditSelect", column, model_dsl, component);
  component = Studio("file.FormFile", column, component);
  if (component["is_image"]) {
    var width = 24;
  }
  res.layout.push({
    name: title,
    width: width,
  });
  // component.edit = { type: "input", props: { value: bind } };
  // res.list.columns.push({ name: title });
  // res.edit.push({ name: title, width: 24 });
  // break;

  res.fields.push({
    name: title,
    component: component,
  });

  return res;
}
