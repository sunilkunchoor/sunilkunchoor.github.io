// Get the modal
var popup = document.getElementById('myPopup');

// Get the button that opens the modal
var btn1 = document.getElementsByClassName("myBtn")[0];
var btn2 = document.getElementsByClassName("myBtn")[1];

// Get the button that opens the modal
var pDetail = document.getElementsByClassName("projectDetail");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the popup
btn1.onclick = function() {
  pDetail[0].style.display = "block";
  popup.style.display = "block";
}

btn2.onclick = function() {
  pDetail[1].style.display = "block";
  popup.style.display = "block";
}

// When the user clicks on <span> (x), close the popup
span.onclick = function() {
  pDetail[0].style.display = "none";
  pDetail[1].style.display = "none";
  popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
  if (event.target == popup) {
    pDetail[0].style.display = "none";
    pDetail[1].style.display = "none";
    popup.style.display = "none";
  }
}
