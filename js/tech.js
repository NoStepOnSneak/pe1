const apiGeneric = "https://api.spacexdata.com/v4/";

const masterContainer = document.querySelector(".info-window-master-container");
const ajaxbtn = document.querySelectorAll(".btn-ajax");

for(let i = 0; i < ajaxbtn.length; i++) {
    ajaxbtn[i].addEventListener("click", function() {

        for (let i = 0; i < ajaxbtn.length; i++) {
            ajaxbtn[i].classList.remove("btn-active");
        }
        ajaxbtn[i].classList.add("btn-active");

        loadPage(ajaxbtn[i].dataset.apilink);

        if (document.querySelector(".info-window-master-container").style.bottom == "0%") {
            closeInfoWindow();
        }
        
    });
}

function loadPage(btnId) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${apiGeneric}${btnId}s`, true);

    xhr.onload = function() {
        if(this.status == 200) {
            loadTechContent(JSON.parse(this.responseText), btnId);
        }
    }

    xhr.onerror = function() {
        console.log("ajax onerror");
    }

    xhr.send();
}

function loadTechContent(data, btnId) {
    
    const techContainer = document.querySelector(".tech-container");

    for (let i = 0; i < techContainer.childElementCount; i++) {
        techContainer.children[i].style.display = "none";
    }

    const targetContainer = document.querySelector(`.${btnId}s-master-container`);

    let html = `<div class="${btnId}s-container">`;

    for(let i = 0; i < data.length; i++) {
        html += `<div class="${btnId}-container">
            <div class="${btnId}" style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${data[i].flickr_images[0]})">
                <div class="tech-name"><h3>${data[i].name}</h3></div>
            </div>
        </div>`
    }

    html += "</div>";

    targetContainer.innerHTML = html;
    targetContainer.style.display = "block";

    const tech = document.querySelectorAll(`.${btnId}`);
    
    for (let i = 0; i < tech.length; i++) {
        
        tech[i].addEventListener("click", function() {
            
            if(btnId == "dragon") {
                createDragonWindow(data[i]);
            } else {
                createRocketWindow(data[i]);
            }
            
            if (masterContainer.style.bottom == "-100%") {
                openInfoWindow();
            }
        });
    }
}

function createDragonWindow(tech) {
    
    let html = "";

    html += `<div class="info-window-container">
        <div class="detimg" style="background-image: url(${tech.flickr_images[0]})"></div>
        <div class="detcont name-container">
            <div class="name">
                <div class="label">Name</div>
                <div class="nm">${tech.name}</div>
            </div>
        </div>
        <div class="detcont size-container">
            <div class="height">
                <div class="label">Height</div>
                <div class="feet">${tech.height_w_trunk.feet} ft</div>
                <div class="meters">${tech.height_w_trunk.meters} m</div>
            </div>
            <div class="diameter">
                <div class="label">Diameter</div>
                <div class="feet">${tech.diameter.feet} ft</div>
                <div class="meters">${tech.diameter.meters} m</div>
            </div>
        </div>
        <div class="detcont mass-container">
            <div class="dry-mass">
                <div class="label">Dry mass</div>
                <div class="lbs">${tech.dry_mass_lb} lbs</div>
                <div class="kg">${tech.dry_mass_kg} kg</div>
            </div>
            <div class="launch-payload-mass">
                <div class="label">Launch payload</div>
                <div class="lbs">${tech.launch_payload_mass.lb} lbs</div>
                <div class="kg">${tech.launch_payload_mass.kg} kg</div>
            </div>
        </div>
        <div class="detcont first-flight-container">
            <div class="first-flight">
                <div class="label">First flight</div>
                <div class="ff">${tech.first_flight}</div>
            </div>
            <div class="active-status">
                <div class="label">Status</div>
                <div class="as">${tech.active ? "Currently active" : "Not currently active"}</div>
            </div>
        </div>
    </div>

    <div class="close-window">Close</div>`;

    masterContainer.innerHTML = html;

    const closeBtn = document.querySelector(".close-window");

    closeBtn.addEventListener("click", function() {
        closeInfoWindow();
    });
    
}

function createRocketWindow(tech) {
    
    let html = "";

    html += `<div class="info-window-container">
        <div class="detimg" style="background-image: url(${tech.flickr_images[0]})"></div>
        <div class="detcont name-container">
            <div class="name">
                <div class="label">Name</div>
                <div class="nm">${tech.name}</div>
            </div>
        </div>
        <div class="detcont size-container">
            <div class="height">
                <div class="label">Height</div>
                <div class="feet">${tech.height.feet} ft</div>
                <div class="meters">${tech.height.meters} m</div>
            </div>
            <div class="diameter">
                <div class="label">Diameter</div>
                <div class="feet">${tech.diameter.feet} ft</div>
                <div class="meters">${tech.diameter.meters} m</div>
            </div>
        </div>
        <div class="detcont mass-container">
            <div class="mass">
                <div class="label">Mass</div>
                <div class="lbs">${tech.mass.lb} lbs</div>
                <div class="kg">${tech.mass.kg} kg</div>
            </div>
            ${getPayloadWeights(tech.payload_weights)}
            
        </div>
        <div class="detcont first-flight-container">
            <div class="first-flight">
                <div class="label">First flight</div>
                <div class="ff">${tech.first_flight}</div>
            </div>
            <div class="active-status">
                <div class="label">Status</div>
                <div class="as">${tech.active ? "Currently active" : "Not currently active"}</div>
            </div>
        </div>
    </div>

    <div class="close-window">Close</div>`;

    masterContainer.innerHTML = html;

    const closeBtn = document.querySelector(".close-window");

    closeBtn.addEventListener("click", function() {
        closeInfoWindow();
    });
    
}

function getPayloadWeights(pw) {
    let html = "";
    console.log(pw);
    for (let i = 0; i < pw.length; i++) {
        html += `<div class="launch-payload-mass">
            <div class="label">Payload to ${pw[i].name}</div>
            <div class="lbs">${pw[i].lb} lbs</div>
            <div class="kg">${pw[i].kg} kg</div>
        </div>`
    }

    return html;   
}

const techMaster = document.querySelector(".tech-master-container");

function openInfoWindow() {

    let a = 0;

    let closeInterval = setInterval(function() {
        a++;

        if (a > 100) {
            clearInterval(closeInterval);
        } else {
            masterContainer.style.top = `${100 - a}%`;
        }

    }, 1)

    if(window.innerHeight < 500) {
        setTimeout(function() {
            techMaster.style.overflow = "visible";
        }, 500)
    }
    
}

function closeInfoWindow() {

    let a = 0;

    let closeInterval = setInterval(function() {
        a++;

        if (a > 100) {
            clearInterval(closeInterval);
        } else {
            masterContainer.style.top = `${a}%`;
        }

    }, 1)

    if(window.innerHeight < 500) {
        setTimeout(function() {
            techMaster.style.overflow = "hidden";
        }, 500)
    }
   
    
}


