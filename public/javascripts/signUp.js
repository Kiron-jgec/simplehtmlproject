

// Password show
function myFunction() {
  var x = document.getElementById("user_password_input");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";

  }
}

//Password matching



//instant Cheak
var check = function () {
  if (document.getElementById('user_password_input').value ==
    document.getElementById('user_confirm_password_input').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('user_password_input').style.borderColor = 'green';
    document.getElementById('user_confirm_password_input').style.borderColor = 'green';
    document.getElementById('message').innerHTML = '&#10003;';
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Password Not Matching';
    document.getElementById('user_password_input').style.borderColor = ' red';
    document.getElementById('user_confirm_password_input').style.borderColor = 'red';
  }
}

// Cheak on Submit
var retval = true;
pass_match = function () {
  var password = document.getElementById("user_password_input").value;
  var password_confirm = document.getElementById("user_confirm_password_input").value;
  var x = true;

  if (password != password_confirm) {
    alert("Your Passwords are not Matching.");
    document.getElementById("user_password_input").style.borderColor = "#E34234";
    document.getElementById("user_confirm_password_input").style.borderColor = "#E34234";
    x = false;
  }
  return x;
}



// Password Strangt Cheak




  function Password_Strength(password) {
  var password_strength = document.getElementById("password_strength");

  //TextBox left blank.
  if (password.length == 0) {
      password_strength.innerHTML = "";
      return;
  }

  //Regular Expressions.
  var regex = new Array();
  regex.push("[A-Z]"); //Uppercase Alphabet.
  regex.push("[a-z]"); //Lowercase Alphabet.
  regex.push("[0-9]"); //Digit.
  regex.push("[$@$!%*#?&]"); //Special Character.

  var passed = 0;

  //Validate for each Regular Expression.
  for (var i = 0; i < regex.length; i++) {
      if (new RegExp(regex[i]).test(password)) {
          passed++;
      }
  }

  //Validate for length of Password.
  if (passed > 2 && password.length > 8) {
      passed++;
  }

  //Display status.
  var color = "";
  var strength = "";
  switch (passed) {
      case 0:
      case 1:
          strength = "Weak";
          color = "red";
          break;
      case 2:
          strength = "Good";
          color = "darkorange";
          break;
      case 3:
      case 4:
          strength = "Strong";
          color = "green";
          break;
      case 5:
          strength = "Very Strong";
          color = "darkgreen";
          break;
  }
  password_strength.innerHTML = strength;
  password_strength.style.color = color;
}




//Copyright

var d = new Date();
document.getElementById("demo").innerHTML = d.getFullYear();