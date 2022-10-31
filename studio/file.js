// 图片组件推测
function File(column, component) {
  var guard = [
    "img",
    "image",
    "_pic",
    "pic_",
    "picture",
    "oss",
    "photo",
    "icon",
    "avatar",
    "Img",
    "logo",
    "cover",
    "url",
    "gallery",
  ];
  const name = column.name;
  for (var i in guard) {
    if (name.indexOf(guard[i]) != -1) {
      var component = {
        bind: name,
        view: {
          type: "Image",
          compute: "scripts.file.image.ImagesView",
          props: {},
        },
        edit: {
          type: "Upload",
          //compute: "scripts.file.image.ImagesEdit",
          props: { filetype: "image" },
        },
      };
      return component;
    }
  }

  return component;
}

function FormFile(column, component) {
  var guard = [
    "img",
    "image",
    "_pic",
    "pic_",
    "picture",
    "oss",
    "photo",
    "icon",
    "avatar",
    "Img",
    "logo",
    "cover",
    "url",
    "gallery",
  ];
  const name = column.name;
  for (var i in guard) {
    if (name.indexOf(guard[i]) != -1) {
      var component = {
        bind: name,
        view: {
          type: "Image",
          compute: "scripts.file.image.ImagesView",
          props: {},
        },
        edit: {
          type: "Upload",
          // compute: "scripts.file.image.ImagesEdit",
          props: { filetype: "image" },
        },
      };
      return component;
    }
  }

  return component;
}
