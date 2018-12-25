// Get the modal
var popup = document.getElementById('myPopup');

// Get the button that opens the modal
var btn = document.getElementsByClassName("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Explanation for each Projects
var explanation = ["A"];

// When the user clicks the button, open the popup
var i;
for (i = 0; i < btn.length; i++) {
  btn[i].onclick = function() {
    document.getElementById('text_head').innerHTML=explanation[i];
    document.getElementById('text_expla').innerHTML=explanation[i];
    popup.style.display = "block";
  }
}

// When the user clicks on <span> (x), close the popup
span.onclick = function() {
  popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
}
