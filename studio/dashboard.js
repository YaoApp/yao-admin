function Create(menu_arr, type) {
  var fs = new FS("dsl");

  Studio("move.Move", "charts", "dashboard.chart.json");
  var dsl = Dsl(menu_arr, type);
  var dsl = JSON.stringify(dsl);
  fs.WriteFile("/charts/" + "dashboard.chart.json", dsl);
}
function Dsl(menu_arr, type) {
  var dsl = {
    name: "数据图表",
    action: {
      data: { process: "scripts.dashboard.Data", default: ["2022-09-20"] },
    },
    layout: {
      operation: {
        actions: [],
      },
      filter: {},
      chart: {
        columns: [],
      },
    },
    fields: {
      filter: {},
      chart: {},
    },
  };
  var chart = {
    表格数量: {
      bind: "table_count",

      view: { type: "Number", props: { unit: "个" } },
    },
    模型数量: {
      bind: "model_count",
      view: { type: "Number", props: { unit: "个" } },
    },
  };
  var columns = [
    { name: "表格数量", width: 12 },
    { name: "模型数量", width: 12 },
  ];
  var script = {
    table_count: 0,
    model_count: 0,
  };

  // 说明是二级菜单
  if (type == 1) {
    var temp = menu_arr[1]["children"];
    script.table_count = temp.length;
    script.model_count = script.table_count;
    temp.forEach((col) => {
      if (col.id != 1) {
        var title = col.name + "(" + col.model + ")" + "记录数";
        script[col.model] = GetCount(col.model);
        chart[title] = {
          bind: col.model,
          link: "/x/Table/" + col.model,
          view: { type: "Number", props: { unit: "条" } },
        };
        columns.push({ name: title, width: 6 });
      }
    });
  } else {
    script.table_count = menu_arr.length - 1;
    script.model_count = script.table_count;

    menu_arr.forEach((col) => {
      if (col.id != 1) {
        var title = col.name + "(" + col.model + ")" + "记录数";
        script[col.model] = GetCount(col.model);
        chart[title] = {
          bind: col.model,
          link: "/x/Table/" + col.model,
          view: { type: "Number", props: { unit: "条" } },
        };
        columns.push({ name: title, width: 6 });
      }
    });
  }

  dsl.layout.chart.columns = columns;
  dsl.fields.chart = chart;
  WriteScript(script);
  return dsl;
}
function WriteScript(data) {
  var data = JSON.stringify(data);
  var sc = new FS("script");
  var scripts = `function Data() {
    return ${data}
  }`;
  sc.WriteFile("/dashboard.js", scripts);
}

function GetCount(model) {
  try {
    var query = new Query();
    var res = query.Get({
      select: [":COUNT(id) as 数量"],
      from: model,
    });
    if (res && res.length && res[0]["数量"] > 0) {
      return res[0]["数量"];
    }
  } catch (e) {
    return 0;
  }

  return 0;
}
