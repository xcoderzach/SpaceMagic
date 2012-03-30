var _ = require("underscore")
var objectFromForm, unnestName;
unnestName = function(object, name, value) {
  var baseName, i, key, nestings, top, _ref;
  baseName = name.match(/^([a-z0-9\-_]+)(?:\[|$)/i)[1];
  nestings = name.match(/(\[([a-z0-9]*)\])/gi) || [];
  top = object;
  nestings.unshift("[" + baseName + "]");
  for (i = 0, _ref = nestings.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    key = nestings[i].slice(1, -1);
    if (key.match(/^[0-9]+$/)) {
      key = parseInt(key);
    } else if (key.match(/^$/) && Array.isArray(top)) {
      key = top.length;
    }
    if (typeof top[key] !== "object") {
      if ((nestings[i + 1] != null) && nestings[i + 1].slice(1, -1).match(/^[0-9]*$/)) {
        top[key] = [];
      } else {
        top[key] = {};
      }
    }
    if (i === nestings.length - 1) {
      top[key] = value;
    } else {
      top = top[key];
    }
  }
  return object;
};
objectFromForm = function(form, done) {
  var finish, formData, numFiles, numRead, result;
  result = {};
  formData = form.serializeArray();
  _(formData).each(function(obj) {
    return unnestName(result, obj.name, obj.value);
  });
  finish = function() {
    return done(result);
  };
  numFiles = 0;
  numRead = 0;
  _($("input[type=file]", form)).each(function(fileElement) {
    var file, name, oldValue, reader;
    name = $(fileElement).attr("name");
    oldValue = $(fileElement).attr("data-value");
    if (fileElement.files) file = fileElement.files[0];
    if (!(file != null) && (oldValue != null)) {
      return unnestName(result, name, oldValue);
    } else if (!(file != null)) {
      return numRead++;
    } else if (file.type.match(/image.*/)) {
      numFiles++;
      reader = new FileReader();
      reader.onload = function(e) {
        numRead++;
        unnestName(result, name, e.target.result);
        if (numRead === numFiles) return finish();
      };
      return reader.readAsDataURL(file);
    }
  });
  if (numFiles === 0) return finish();
};
module.exports = objectFromForm;
