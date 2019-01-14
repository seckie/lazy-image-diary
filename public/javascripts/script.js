var $input = document.getElementById('imagefiles');
if (window.File && window.FileReader && window.FileList && window.Blob) {
  $input.addEventListener('change', handleFileSelect, false);
}
function handleFileSelect (e) {
  var target = e.currentTarget;
  if (!target) { return; }
  var files = target.files;
  if (!files) { return; }
  var dataset = [];
  for (var i = 0, l = files.length; i<l; i++) {
    var f = files[i];
    if (!f.type.match('image.*')) { continue; }
    var reader = new FileReader();
    reader.onload = (handleOnloadAsDataURL)(f);
    reader.readAsDataURL(f);
    var formData = new FormData();
    formData.append('fileData', f);
    formData.append('fileLastModified', f.lastModified);
    dataset .push(formData);
  }
  loopRequest(dataset, 0)
}

function loopRequest(dataset, index) {
  request(dataset[index], function (res) {
    document.querySelectorAll('p.media')[index].classList.remove('media--uploading');
    index ++;
    if (index < dataset.length) {
      loopRequest(dataset, index);
    }
  }, function (err) {
    console.error(err.message);
    document.querySelectorAll('p.media')[index].classList.remove('media--uploading');
    document.querySelectorAll('p.media')[index].classList.add('media--error');
    index ++;
    if (index < dataset.length) {
      loopRequest(dataset, index);
    }
  });
}

function handleOnloadAsDataURL (theFile) {
  return function (e) {
    // Render thumbnail.
    var p = document.createElement('p');
    p.className = "media media--uploading";
    p.innerHTML = ['<img class="thumb" src="', e.target.result,
      '" title="', escape(theFile.name), '"/>'].join('');
    document.getElementById('list').insertBefore(p, null);
  };
}

function request (data, resolve, reject) {
  $.ajax('/create_image_note', {
    method: 'POST',
    data: data,
    contentType: false,
    processData: false,
    success: resolve,
    error: reject
  })
}
