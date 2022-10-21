//yao studio run table.Create
/**
 * 创建表格
 */
function Create(model_dsl) {
  var fs = new FS("dsl");
  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".tab.json";
    //var dsl = toTable(model_dsl[i]);
    var dsl = Studio("colunm.toTable", model_dsl[i]);
    var table = JSON.stringify(dsl);
    Studio("move.Move", "tables", table_name);
    fs.WriteFile("/tables/" + table_name, table);

    ///
    var form_name = model_dsl[i]["table"]["name"] + ".form.json";
    var form_dsl = Studio("colunm.toForm", model_dsl[i]);
    var form = JSON.stringify(form_dsl);
    Studio("move.Move", "forms", form_name);
    fs.WriteFile("/forms/" + form_name, form);
  }
  // 创建菜单
  Studio("menu.Create", model_dsl);
}

//====================================================老版本的暂时没有用===================
function toTable(model_dsl) {
  const columns = model_dsl.columns || [];
  var tableTemplate = {
    name: model_dsl.name || "表格",
    version: "1.0.0",
    decription: model_dsl.decription || "表格",
    bind: { model: model_dsl.table.name },
    columns: {},
    filters: {},
    list: {
      primary: "id",
      layout: { columns: [], filters: [] },
      actions: {
        pagination: { props: { showTotal: true } },
        create: { props: { label: "添加" } },
      },
      option: { operation: { unfold: true } },
    },
    edit: {
      primary: "id",
      layout: {
        fieldset: [{ columns: [] }],
      },
      actions: {
        cancel: {},
        save: {},
        delete: { type: "button", props: { label: "删除" } },
      },
      option: { dev: true },
    },
  };
  columns.forEach((column) => {
    var col = castTableColumn(column);
    if (col) {
      col.columns.forEach((c) => (tableTemplate.columns[c.name] = c.component));
      col.filters.forEach((f) => (tableTemplate.filters[f.name] = f.filter));
      col.edit.forEach((c) =>
        tableTemplate.edit.layout.fieldset[0].columns.push(c)
      );
      col.list.columns.forEach((c) =>
        tableTemplate.list.layout.columns.push(c)
      );
      col.list.filters.forEach((f) =>
        tableTemplate.list.layout.filters.push(f)
      );
    }
  });
  return tableTemplate;
}
function castTableColumn(column) {
  column = column || {};
  const props = column.props || {};
  const title = column.label;
  const name = column.name;

  const bind = `:${name}`;
  if (!name) {
    log.Error("castTableColumn: missing name");
    return false;
  }

  if (!title) {
    log.Error("castTableColumn: missing title");
    return false;
  }

  var res = {
    columns: [],
    filters: [],
    list: { columns: [], filters: [] },
    edit: [],
  };

  var component = {
    label: title,
    view: { type: "label", props: { value: `:${name}` } },
    edit: {},
  };

  switch (column.type) {
    case "string":
      component.edit = { type: "input", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "text":
      component.edit = { type: "textArea", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "integer":
      component.edit = { type: "input", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "decimal":
      component.edit = { type: "input", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "datetime":
      component.edit = { type: "datePicker", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    case "enum":
      component.edit = { type: "select", props: { value: bind } };
      res.list.columns.push({ name: title });
      res.edit.push({ name: title, width: 24 });
      break;
    default:
      log.Error("castTableColumn: Type %s does not support", column.type);
      return false;
  }

  res.columns.push({ name: title, component: component });

  // Convert to filter based on DSL description
  if (column.search) {
    var filter = {
      label: title,
      bind: `where.${name}.match`,
      input: {
        type: "input",
        props: { placeholder: props.placeholder || `type ${title}...` },
      },
    };
    res.filters.push({ name: title, filter: filter });
    res.list.filters.push({ name: title });
  }

  return res;
}
