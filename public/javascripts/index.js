

//jquery



$(document).ready(function(){
  $("#photo_upload_icon").click(function(){
    $("#user_post_section").hide();
    $("#titleAndCatagory").show();
    $("#post_btn").show();
  });
  $("#user_meme").keypress(function(){

    $("#post_btn1").show();
  });




});





//Imge Show when user select
 var loadFile = function(event) {
  var image = document.getElementById('outputImage');
  image.src = URL.createObjectURL(event.target.files[0]);
};

// Make User Post in the home Page 

test =function(){

let x= document.createElement("input");

document.body.appendChild(x);



}