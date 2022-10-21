
//SECTION Navbar
const navbar = document.getElementById('navbar');
function activeNavbar(scrollpos) {
   
   if (scrollpos > 100)
      navbar.classList.add('scrolling');
   else{
      navbar.classList.remove('scrolling');
   }
}

document.addEventListener('scroll', () => {
    activeNavbar(window.scrollY);
});
//!SECTION


//SECTION Video
window.onload = () =>{
   document.getElementById('mainvid').play();
}
//!SECTION