const navBar = document.querySelector(".nav-bar-top");

window.addEventListener("scroll", function() {

    if (window.pageYOffset >= window.innerHeight - 85) {
        navBar.style.top = `${window.innerHeight - 85 - window.pageYOffset}px`;
    } else {
        navBar.style.top = "0";
    }

});

const mobIcon = document.querySelector("#mobIcon");
const mobNav = document.querySelector("#mobList");

mobIcon.addEventListener("click", function() {
    mobNav.clientHeight === 0 ? mobNav.style.height = "100%" : mobNav.style.height = "0";    
});