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
