var login_value=false;

if(login_value===false)
{
  $("#tracker").attr("data-toggle","modal");
  $("#goal").attr("data-toggle","modal");
  $("#profile").attr("data-toggle","modal");

}
if(login_value===true)
{
$("#tracker").attr("data-toggle","");
$("#goal").attr("data-toggle","");
$("#profile").attr("data-toggle","");
$( "#signinbtn" ).remove();
$( "#signupbtn" ).remove();
}
$('#logout').click(function (){
    login_value=false;
});
function changeloginvalue()
{}
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBRQn0jRqCLy3SnU1qcoj7N-WvCg1E9y1c",
    authDomain: "diethard-b499d.firebaseapp.com",
    databaseURL: "https://diethard-b499d-default-rtdb.firebaseio.com",
    projectId: "diethard-b499d",
    storageBucket: "diethard-b499d.appspot.com",
    messagingSenderId: "191499978872",
    appId: "1:191499978872:web:90c99248090faf4651c58d",
    measurementId: "G-2HVR21GMJW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()

// Set up our register function
function register () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  full_name = document.getElementById('full_name').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }


  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email,
      full_name : full_name,
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // DOne
    alert('User Created!!')
    login_value=true;
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('emaillogin').value
  password = document.getElementById('passwordlogin').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

    // DOne
    alert('User Logged In!!')
    $("#tracker").attr("data-toggle","");
    $("#goal").attr("data-toggle","");
    $("#profile").attr("data-toggle","");
    $( "#signinbtn" ).remove();
    $( "#signupbtn" ).remove();

  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}




// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}
