//yao studio run table.Create
/**
 * 创建表格
 */
function Create() {
  var model_dsl = Studio("schema.Relation");

  var fs = new FS("dsl");
  for (var i in model_dsl) {
    var table_name = model_dsl[i]["table"]["name"] + ".mod.json";
    var table = JSON.stringify(model_dsl[i]);
    Studio("move.Move", "models", table_name);
    fs.WriteFile("/models/" + table_name, table);
  }
}

function toTable(model_dsl) {
  var tableTemplate = {
    name: model_dsl.name || "表格",
    action: {
      bind: { model: model_dsl.table.name, option: {} },
      search: {
        default: [{}, 1, 10],
      },
    },
    layout: {
      primary: "id",

      header: {
        preset: {
          batch: {
            columns: [
              { name: "名称", width: 12 },
              { name: "消费金额", width: 12 },
              { name: "入院状态", width: 12 },
            ],
            deletable: true,
          },
          import: {},
        },
        actions: [],
      },

      filter: {},

      table: {
        props: {},
        columns: [
          { name: "名称" },
          { name: "消费金额" },
          { name: "状态" },
          { name: "入院状态" },
        ],
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
    "fields": {
      "filter": {
        "名称": {
          "bind": "where.name.like",
          "edit": {
            "type": "Input",
            "props": { "placeholder": "请输入宠物名称" }
          }
        },
        "状态": {
          "bind": "where.status.in",
          "edit": {
            "type": "Select",
            "props": {
              "xProps": {
                "$remote": {
                  "process": "models.pet.Get",
                  "query": { "select": ["id", "name"] }
                }
              }
            }
          }
        }
      },
  
      "table": {
        "名称": {
          "bind": "name",
          "in": "scripts.pet.SaveName",
          "view": { "type": "Text", "props": {} },
          "edit": {
            "type": "Input",
            "props": { "placeholder": "请输入宠物名称" }
          }
        },
        "入院状态": {
          "bind": "status",
          "in": "scripts.pet.SaveTag",
          "out": "scripts.pet.GetTag",
          "view": {
            "type": "Tag",
            "props": {
              "xProps": {
                "$remote": {
                  "process": "models.pet.Get",
                  "query": { "select": ["id", "name"] }
                }
              },
              "pure": true
            }
          },
          "edit": {
            "type": "Select",
            "props": {
              "xProps": {
                "$remote": {
                  "process": "models.pet.Get",
                  "query": { "select": ["id", "name"] }
                }
              }
            }
          }
        },
        "状态": {
          "bind": "mode",
          "view": {
            "type": "Switch",
            "props": {
              "checkedValue": "enabled",
              "unCheckedValue": "disabled",
              "checkedChildren": "开启",
              "unCheckedChildren": "关闭"
            }
          }
        },
        "消费金额": {
          "bind": "cost",
          "view": { "type": "Text", "props": {} },
          "edit": { "type": "Input", "props": {} }
        }
      }
    },

    version: "1.0.0",

    decription: model_dsl.decription || "a dyform instance",
    columns: {},
    filters: {},
    list: {
      primary: "id",
      layout: { columns: [], filters: [] },
      actions: {
        pagination: { props: { showTotal: true } },
        create: { props: { label: "Create" } },
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
        delete: { type: "button", props: { label: "Delete" } },
      },
      option: { dev: true },
    },
  };

  columns.forEach((column) => {
    var col = castTableColumn(column);
    if (col) {
      console.log(col);
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
