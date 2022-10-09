function search() {
  res = Process("models.connector.get", {});
  return {
    data: res,
  };
}

function save(payload) {
  if (!payload.type) {
    throw new Exception("连接类型不能为空", 400);
  }
  if (!payload.options || payload.options == {}) {
    throw new Exception("连接参数不能为空", 400);
  }
  var id = Process("models.connector.save", payload);
  if (id && id.code) {
    throw new Exception("参数错误!", 400);
  }
  return {
    code: 200,
    message: "操作成功!",
  };
}
function del(payload) {
  if (!payload.id) {
    throw new Exception("id不能为空", 400);
  }

  Process("models.connector.delete", payload.id, {});

  return {
    code: 200,
    message: "操作成功!",
  };
}
