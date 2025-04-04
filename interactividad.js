window.onload=()=>{
  const transition_el=document.querySelector('.transition');
  setTimeout(()=>{
    transition_el.classList.remove('is-active');

  },500)
}

// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
