const form = document.querySelector("#contactForm");
const textarea = document.querySelector("textarea");
const descCounter = document.querySelector("#descriptionCounter");

form.addEventListener("submit", formValidation);

function formValidation(ev) {
    ev.preventDefault();

    const name = document.querySelector("#name");
    const invName = document.querySelector("#invalidName");
    if (name.value.trim() < 1) {
        invName.style.display = "block";
    } else {
        invName.style.display = "none";
    }

    const email = document.querySelector("#email");
    const invEmail = document.querySelector("#invalidEmail");
    if (!validateEmail(email.value)) {
        invEmail.style.display = "block";
    } else {
        invEmail.style.display = "none";
    }

    const desc = document.querySelector("#description");
    const invDesc = document.querySelector("#invalidDescription");
    if (desc.value.trim() < 1) {
        invDesc.style.display = "block";
    } else {
        invDesc.style.display = "none";
    }

    const img = document.querySelector("#media");
    const invImg = document.querySelector("#invalidMedia");
    if (img.files.length === 0) {
        invImg.style.display = "block";
    } else if (img.files[0].type === "image/jpeg" || img.files[0].type === "image/png") {
        invImg.style.display = "none";        
    } else {
        invImg.style.display = "block";
    }
}

function validateEmail(email) {
    const regularEx = /\S+@\S+\.\S+/;
    return regularEx.test(email);
}

textarea.addEventListener("keypress", function() {
    descCounter.innerHTML = `${textarea.textLength === 150 ? textarea.textLength : textarea.textLength + 1}/${textarea.maxLength}`;
});