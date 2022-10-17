/**
 * 文件复制移动逻辑
 */
function Move(dir, name) {
  const fs = new FS("dsl");
  var base_dir = ".trash";
  // 判断文件夹是否存在.不存在就创建
  Mkdir(base_dir);
  var new_dir = parseInt(Date.now() / 1000);
  // models的文件移动到
  var target_name = dir + "/" + name;
  // 如果表已经存在,则
  if (Exists(dir, name)) {
    Mkdir(base_dir + "/" + new_dir);
    Copy(target_name, base_dir + "/" + new_dir, name);

    // 复制完成后,删除文件
    fs.Remove(target_name);
  } else {
    return false;
  }
}
function Mkdir(name) {
  const fs = new FS("dsl");
  var res = fs.Exists(name);
  if (res !== true) {
    fs.Mkdir(name);
  }
}

function Copy(from, to, name) {
  const fs = new FS("dsl");
  fs.Copy(from, to + "/" + name);
}
/**
 * 查看模型是否存在
 * @param {*} file_name
 * @returns
 */
function Exists(dir, file_name) {
  const fs = new FS("dsl");
  file_name = file_name;
  var res = fs.Exists(dir + "/" + file_name);
  return res;
}
