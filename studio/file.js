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
    "pic",
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
          props: { filetype: "image", disabled: true },
        },
      };
      return component;
    }
  }

  return component;
}

function FormFile(column, component, model_dsl) {
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
    "pic",
  ];
  const name = column.name;
  for (var i in guard) {
    if (name.indexOf(guard[i]) != -1) {
      var component = {
        is_image: true,
        bind: name,
        view: {
          type: "Image",
          compute: "scripts.file.image.ImagesView",
          props: {},
        },
        edit: {
          type: "Upload",
          compute: {
            process: "scripts.file.image.ImagesEdit",
            args: ["$C(row)", "$C(type)", name, model_dsl["table"]["name"]],
          },
          // compute: "scripts.file.image.ImagesEdit",
          props: {
            filetype: "image",
            $api: { process: "fs.system.Upload" },
          },
        },
      };
      return component;
    }
  }

  return component;
}
