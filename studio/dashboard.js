function Create(menu_arr) {
  var fs = new FS("dsl");

  Studio("move.Move", "charts", "dashboard.chart.json");
  var dsl = Dsl(menu_arr);
  var dsl = JSON.stringify(dsl);
  fs.WriteFile("/charts/" + "dashboard.chart.json", dsl);
  WriteScript();
}
function Dsl(menu_arr) {
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

  menu_arr.forEach((col) => {
    if (col.id != 1) {
      var title = col.name + "(" + col.model + ")" + "记录数";
      chart[title] = {
        bind: col.model,
        link: "/x/Table/" + col.model,
        view: { type: "Number", props: { unit: "条" } },
      };
      columns.push({ name: title, width: 6 });
    }
  });
  dsl.layout.chart.columns = columns;
  dsl.fields.chart = chart;
  return dsl;
}
function WriteScript() {
  var sc = new FS("script");
  var scripts = `function Data() {
    let res = Process("schemas.default.Tables");
  
    var script = {
      table_count: res.length,
      model_count: res.length,
    };
    for (var i in res) {
      script[res[i]] = GetCount(res[i]);
    }
    return script;
  }
  function GetCount(model) {
    var query = new Query();
    var res = query.Get({
      select: [":COUNT(id) as 数量"],
      from: model,
    });
    if (res && res.length && res[0]["数量"] > 0) {
      return res[0]["数量"];
    }
    return 0;
  }`;
  sc.WriteFile("/dashboard.js", scripts);
}
