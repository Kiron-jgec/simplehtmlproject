
//CoverImage Show
var loadFile = function(event) {
  var image = document.getElementById('outputImage');
  image.src = URL.createObjectURL(event.target.files[0]);
};


//profile Image Show
var loadFileProfile = function(event) {
  var image = document.getElementById('outputImagePrfile');
  image.src = URL.createObjectURL(event.target.files[0]);
};










