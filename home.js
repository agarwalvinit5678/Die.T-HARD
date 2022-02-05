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
