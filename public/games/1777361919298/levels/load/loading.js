function move() {
  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, 70);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      document.getElementById("loading").innerHTML = width + " % LOADED";
      window.location.replace("../home_page/home.html");
    } else {
      width++;
      elem.style.width = width + '%';
      document.getElementById("loading").innerHTML = width + " % LOADING...";
      
      if (width === 94) {
        elem.classList.add('pulse-animation');
      }
    }
  }
}
