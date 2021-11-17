(function () {

var index, dataset, reader;
var $input = document.getElementById('imagefiles');
if (window.File && window.FileReader && window.FileList && window.Blob) {
  $input.addEventListener('change', handleFileSelect, false);
}

function handleFileSelect (e) {
  var target = e.currentTarget;
  if (!target) { return; }
  var files = target.files;
  if (!files) { return; }
  index = 0;
  dataset = [];
  reader = new FileReader();
  for (var i = 0, l = files.length; i<l; i++) {
    var f = files[i];
    if (!f.type.match('image.*')) { continue; }
    dataset.push({file: f});
  }
   readFile(dataset[index], reader);
}

function upload(index) {
  var el = dataset[index].el;
  var data = dataset[index].formData;
  return $.ajax('/create_image_note', {
    method: 'POST',
    data: data,
    contentType: false,
    processData: false,
    success: function (res) {
      el.classList.remove('media--uploading');
      // loop
      index ++;
      if (dataset[index]) {
        upload(index);
      }
    },
    error: function (err) {
      console.error(err.message);
      el.classList.remove('media--uploading');
      el.classList.add('media--error');
    }
  });
}

function readFile (data) {
  reader.onload = function (e) {
    var formData = new FormData();
    formData.append('fileData', data.file);
    formData.append('fileLastModified', data.file.lastModified);
    // Render thumbnail.
    var p = document.createElement('p');
    p.className = "media media--uploading";
    p.innerHTML = ['<img class="thumb" src="', e.target.result,
      '" title="', escape(data.file.name), '"/>'].join('');
    document.getElementById('list').insertBefore(p, null);
    if (dataset[index]) {
      dataset[index].el = p;
      dataset[index].formData = formData;
    }
    // loop
    index ++;
    if (dataset[index]) {
      readFile(dataset[index]);
    } else {
      // start uploading
      index = 0;
      upload(index);
    }
  };
  reader.readAsDataURL(data.file);
}

})();
