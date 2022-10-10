function NextDay(day) {
  today = new Date(day);
  today.setDate(today.getDate() + 1);
  return today.toISOString().slice(0, 19).split("T")[0];
}
function test() {
  var a = "abcderf";
  var b = a.replace("der", "666");
  return b
}
