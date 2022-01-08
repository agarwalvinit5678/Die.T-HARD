

var login_value=false;
if(login_value===false)
{  window.open("home.html")
  document.getElementById(compiler).style.display="block";
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
