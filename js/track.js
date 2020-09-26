const canvas = document.getElementById("canvas");

function resizeCanvas() { // function to automate resizing of canvas

    const wwidth = document.querySelector("html").clientWidth; // width of window minus scrollbar width
    const cheight = (window.innerHeight - navBar.offsetHeight) * 0.8; // c(anvas)height is set to 80% of window height minus navBar height
    
    if (cheight / 853 * 1707 < wwidth * 0.95) { // This if statement is used to ensure that the smallest value is always chosen to be the basis for calculation of height and width of the canvas. This way, horizontal scrollbars are more efficiently avoided when resizing the window. The base values of 1707 and 853 are the dimensions of the world map image that is used as the background-image property of the canvas (see track.css) and are used to make sure that the canvas is always resized proportionately so as to include the entire background image.
        canvas.height = `${cheight}`;
        canvas.width = `${cheight / 853 * 1707}`; // canvas width calculated from smaller value of canvas height
    } else {
        canvas.width = `${wwidth * 0.95}`;
        canvas.height = `${wwidth * 0.95 / 1707 * 853}`; // canvas height calculated from smaller value of canvas width
    }

    canvas.style.margin = `0 ${(wwidth - canvas.width) / 2}px`; // margins are always calculated in the same way. Setting margin property to auto in css didn't work, so i calculate the remaining horizontal space in the browser and set the margins this way instead.

}

resizeCanvas(); // called at page load to properly proportion the canvas, event listener added below
window.addEventListener("resize", resizeCanvas);

const apiGeneric = "https://api.spacexdata.com/v4/"; // generic api address here, as the remainder is added with dataset property of html elements

const ajaxbtn = document.querySelectorAll(".btn-ajax"); // these btn elements each have a unique data-apilink value

for(let i = 0; i < ajaxbtn.length; i++) {
    ajaxbtn[i].addEventListener("click", function() {

        for (let i = 0; i < ajaxbtn.length; i++) { // removing and adding active css class for unique formatting
            ajaxbtn[i].classList.remove("btn-active");
        }
        ajaxbtn[i].classList.add("btn-active");

        loadMap(ajaxbtn[i].dataset.apilink); // load data from api to populate map with dataset value
    });
}

function loadMap(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${apiGeneric}${data}`, true); // combining generic api adress with dataset value

    xhr.onload = function() {
        if(this.status == 200) {
            drawMap(JSON.parse(this.responseText)); // draws points on map
        }
    }

    xhr.onerror = function() {
        console.log("ajax onerror");
    }

    xhr.send();
}

function drawMap(sl) {

    const cwidth = canvas.width;
    const cheight = canvas.height;
    
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height); // resets/clears canvas before every drawing of points

        ctx.fillStyle = "#207066";

        let coArray = []; // This is kind of an unnecessarily long and tedious process for drawing the points on the map, but for some reason when using the setTimeout function directly within the for loop, it wouldn't work properly. I just really liked the idea of having the individual points gradually populating the map instead of all appearing instanly.

        for (let i = 0; i < sl.length; i++) {

            if (sl[i].longitude && sl[i].latitude) { // checks to see if the satelite coordinate values are not null
                const pc = { // pc short for point coordinates
                    x: ((sl[i].longitude / 180) + 1) / 2 * cwidth, // The longitude is divided by its max value of 180. The coordinate is now a value a, -1 < a < 1. By adding 1 and dividing by 2 it is now expressed as a percentage (or decimal) of the width of its container. Then I just multiply it by the width of the canvas.
                    y: ((sl[i].latitude / -90) + 1) / 2 * cheight // The latitude is calculated in the same way, with the exception of being multiplied by its max value * -1. This is because latitude goes from -90 deg at the bottom and to 90 at the top. The canvas y values start at 0 from the top. Therefore it has to be multiplied by -1. The progression of longitude vales, on the other hand, is oriented in the same way as the canvas x values.
                };
    
                coArray.push(pc);
            }
        
        }
        
        coArray.forEach(c => {
            setTimeout(function() { // slight delay so that the map is populated with points gradually (more dramatic this way)
                ctx.beginPath();
                ctx.arc(c.x, c.y, 2, 0, 2 * Math.PI); // Circle is drawn with a radius of 2px
                ctx.fill();
            }, 10);
        });

      
    }
}
