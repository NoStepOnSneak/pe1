const apiUpcoming = "https://api.spacexdata.com/v4/launches/upcoming"; // Adress for upcoming SpaceX launches api data

const date = new Date(); // Date object used in construction of calendar, month and year values seen being declared below are used to construct the calendar
let month = date.getMonth();
let year = date.getFullYear();

const table = document.querySelector(".calendar-body"); // Selecting the section of the html document where the constructed document element will be inserted

// Buttons for navigating the calendar, event listeners are added below
const prevbtn = document.querySelector(".prev-btn");
const nextbtn = document.querySelector(".next-btn");
const todayButton = document.querySelector(".today-button");

apiUpcomingCall(apiUpcoming); // Api call

async function apiUpcomingCall(api) {
    try {
        const response = await fetch(api);
        const respons = await fetch("https://api.spacexdata.com/v4/ships");
        const data = await response.json();
        console.log(data);
        const data2 = await respons.json(); console.log(data2);
        let firstLaunch; // Declaring a variable here in order to separate the first launch that is known with a low date_precision value

        for (i = 0; i < data.length; i++) {
            if (data[i].date_precision === "hour") { // the first launch with date_precision value of "hour" is assigned to the firstLaunch variable for later use
                firstLaunch = data[i];
                break;
            }
        }

        let remainingLaunches = []; // array for launches that aren't the firstLaunch, these are separated because createCalendar requires data array to stay intact

        for (i = 0; i < data.length; i++) { // 
            if (i != data.indexOf(firstLaunch)) {
                remainingLaunches.push(data[i]);
            }
        }

        createNextLaunch(firstLaunch); // creates left section of page
        createTimer(firstLaunch); // creates the timer on the bottom of the left section
        createCalendar(year, month, data); // creates the calendar in the center section. data array is passed through in order to highlight dates with a launch with a date_precision value of "day" or "hour"
        createUpcomingLaunches(remainingLaunches); // creates right section of page

        // Event listeners for calendar buttons are added below; prevBtn, nextBtn and todayButton
        prevbtn.addEventListener("click", function() {

            removeCalendar(); // see line 268, deletes existing calendar
        
            if (month === 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
        
            createCalendar(year, month, data); // creates a new calendar with new year and month values
        });
        
        nextbtn.addEventListener("click", function() {
            removeCalendar();
        
            if (month === 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
            
            createCalendar(year, month, data);
        });
        
        todayButton.addEventListener("click", function() {
            year = date.getFullYear(); // resetting year and month values with date object created at top of document
            month = date.getMonth();
            removeCalendar();
            createCalendar(year, month, data);
        });

    } catch (error) {
        console.log(error);
    }
}






function createNextLaunch(launch) { // Creates left section
    let html = "";  

    html += `<div class="ld-name">Name: ${launch.name}</div>
    <div class="ld-date">Launch Date: ${new Date(launch.date_unix * 1000).toString()}</div>
    <div class="ld-date-precision">Launch date accurate to within the ${launch.date_precision}</div>
    <div class="ld-details">${launch.details ? launch.details : "No details available at this moment"}</div>
    <div class="ld-crew">${launch.crew}</div>
    <div class="ld-patch-image"><img src="${launch.links.patch.small ? launch.links.patch.small : 'media/nextLaunchDefault.jpg'}" alt="${launch.links.patch.small ? "launch patch image" : "Falcon Heavy demo"}" title="${launch.links.patch.small ? "" : "Falcon Heavy demo mission"}"></div>
    `;

    document.querySelector(".next-launch-info").innerHTML = html;
}





function createTimer(launch) { // timer on the bottom of left section

    const countDownTimer = document.querySelector(".launch-countdown"); // assigns to a variable the html element which is the parent element to all the individual timer elements, that way they can be cycled through in a for loop when updating them

    const nowTime = new Date().getTime(); // creates a new date object for more accurate measurement
    const launchTime = launch.date_unix; // assigns the unix time for next launch to launchTime variable
    const toSeconds = 1000 - (nowTime % 1000); // creating the toSeconds variable in order to synchronize browser timer with system clock

    let timeArray = []; // for storing calculated values
    let remainder = launchTime - Math.floor(nowTime / 1000) - 1; // using remainder as a value that is carried through from calculation to calculation, sort of like a temp variable in a basic sorting algorithm. 1 is subtracted at the end because the toSeconds value is used to delay the update for the html content until the next second passes and the use of Math.floor in this calculation would otherwise cause the timer to be 1 second off

    timeArray.push(remainder % 60); // adds the number of seconds to timeArray
    remainder = Math.floor(remainder / 60); // updates remainder variable to reflect previous calculation, done again 2 lines down
    timeArray.push(remainder % 60); // adds the number of minutes to timeArray
    remainder = Math.floor(remainder / 60);
    timeArray.push(remainder % 24); // adds the number of hours to timeArray
    timeArray.push(Math.floor(remainder / 24)); // adds the number of days to timeArray. timeArray is, at this point, in the format of [sec, min, hour, day]


    setTimeout(function() { // using timeout(function, toSeconds) in order to synchronize time, as mentioned in previous comment

        for (let i = 0; i < countDownTimer.childElementCount; i++) { // this loop cycles through the countDownTimer child elements (and the timeArray, but in reverse) and creates a textNode, appended to a div element, appended to said countDownTimer child element

            const content = document.createTextNode(timeArray[timeArray.length - (i + 1)] < 10 ? `0${timeArray[timeArray.length - (i + 1)]}` : timeArray[timeArray.length - (i + 1)]);
            const div = document.createElement("div");
            div.appendChild(content);

            countDownTimer.children[i].appendChild(div);
        }

        var updateTimer = setInterval(function() { // when the timers are synced an interval is set to update the timer every 1000ms

            if (timeArray[0] === 0) { // checks if sec value is 0, sets to 59 and checks minutes value if true, sec-- if false
                timeArray[0] = 59;
                if (timeArray[1] === 0) { // same, but for mins and hours
                    timeArray[1] = 59
                    if (timeArray[2] === 0) { // same, but for hours and days
                        timeArray[2] = 23;
                        if (timeArray[3] === 0) { // same, but for days, clears interval if true, as this would mean that timeArray = [0, 0, 0, 0]
                            timeArray = [0, 0, 0, 0]; // Specified to avoid being set to [0, 23, 59, 59]
                            clearInterval(updateTimer);
                        } else {
                            timeArray[3]--;
                        }
                    } else {
                        timeArray[2]--;
                    }
                } else {
                    timeArray[1]--;
                }
            } else {
                timeArray[0]--;
            }

            for (let i = 0; i < countDownTimer.childElementCount; i++) { // updates timer html content
                countDownTimer.children[i].lastElementChild.innerHTML = timeArray[timeArray.length - (i + 1)] < 10 ? `0${timeArray[timeArray.length - (i + 1)]}` : timeArray[timeArray.length - (i + 1)];
            }

        }, 1000)

    }, toSeconds);

}





function createCalendar(year, month, launches) { // creates calendar, uses launches array to highlight dates with a launch, as previously mentioned

    let monthLaunches = [];

    for (let i = 0; i < launches.length; i++) { // creates an array with that month's launches in it
        const ld = new Date(launches[i].date_unix * 1000);
        
        if (ld.getFullYear() === year && ld.getMonth() == month) {
            launches[i].ccDate = ld.getDate(); // adds a property to the launch object for later use (see line 222)
            monthLaunches.push(launches[i]);
        }
    }

    let calDate = 1; // creates a counter variable to go through all the dates of that month

    for (let i = 0; i < 6; i++) { // for loop to go through the weeks of the month (up to 6 possible if month starts e.g. on a sunday)
        let newRow = document.createElement("tr"); // creates a new row in the table

        for (let j = 0; j < 7; j++) { // for loop to go through the days of the week
            
            if ((i === 0 && (j + 1) < firstDay(year, month)) || (firstDay(year, month) === 0 && i === 0 && j < 6)) { // creates a blank table cell if it's the first row of the table body and the day value is lower than that of the first day of the month OR the month starts on a sunday, it's the first row of the table and the cell will be created in sunday column (j < 6)
                const td = document.createElement("td");

                const dt = document.createTextNode("");

                td.appendChild(dt);

                newRow.appendChild(td);
            } else if (calDate > daysInMonth(year, month)) { // breaks out of the loop if all the days in the month are covered

                break;

            } else { // if prior conditions are not met, the cell should be filled with calDate variable
                const td = document.createElement("td");

                const dt = document.createTextNode(calDate);

                td.appendChild(dt);
        
                newRow.appendChild(td);

                if (year === date.getFullYear() && month === date.getMonth() && calDate === date.getDate()) { // if year, month and date match up, the cell is given the today class, with some unique css formatting
                    td.classList.add("today");
                }

                if (monthLaunches.find(function(launch) { // searches the monthLaunches array for launches with a certain date_precision and calDate match to previously created ccDate property of launch object
                    if (launch.ccDate === calDate && (launch.date_precision === "hour" || launch.date_precision === "day")) {
                        return true;
                    }
                })) {
                    td.classList.add("day-of-launch"); // adds some css formatting to these launch dates with certain date_precision
                }
                
                calDate++; // updates calDate variable whenever a cell is created with data in it
            }
            
        }

        table.appendChild(newRow); // appends row to table body
    }

    document.querySelector(".calendar-title").innerHTML = `${getMonth(month)} ${year}`; // updates the month and year labels at the top of the calendar

}

// Other functions associated with the createCalendar function
function daysInMonth(year, month) { // returns the number of days in a given month, includes the year value because of leap years (I think there are some other inconsistencies that are also year-dependent, but they are largely irrelevant to this project)
    return Math.round((new Date(year, month + 1).getTime() - new Date(year, month).getTime()) / 1000 / 60 / 60 / 24); // I find the .getTime() value for the month after the specified one, and subtract the .getTime() value for the specified month. Math.round() function is used to account for any "inaccuracies" produced by daylight savings time.
}

function firstDay(year, month) { // returns the first day of a given month
    return new Date(year, month).getDay();
}

function getMonth(month) { // returns the name of a given month
    switch (month) {
        case 0: return "January"
        case 1: return "February"
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "August";
        case 8: return "September";
        case 9: return "October";
        case 10: return "November";
        case 11: return "December";
        default: return "getMonth error";
    }
}

function removeCalendar() { // deletes the calendar, used to prepare the table for the construction of a new calendar
    const childCount = table.childElementCount;

    for(let i = 0; i < childCount; i++) {
        table.removeChild(table.firstChild);
    }
}





function createUpcomingLaunches(launches) { // cycles through the launches and creates some html to display upcoming launches

    let html = "";

    for (let i = 0; i < launches.length; i++) {
        
        html += `<div class="launch">
        <div class="launch-name">${launches[i].name}</div>
        <div class="launch-date">${new Date(launches[i].date_unix * 1000).toDateString()}</div>
        <div class="launch-date-precision">Accurate to within the ${launches[i].date_precision}</div>
        </div>`;
    }

    document.querySelector(".launches-container .scrollable").innerHTML = html;

    const lhtml = document.querySelectorAll(".launch"); // selects all .launch elements in order to add event listeners, done below

    for (let i = 0; i < lhtml.length; i++) {

        lhtml[i].addEventListener("click", function() {

            for (let j = 0; j <lhtml.length; j++) { // removes active class from all elements
                
                lhtml[j].classList.remove("active");
                
            }

            lhtml[i].classList.add("active");

            

            createLaunchDetailsWindow(launches[i]); // updates window with some more detailed information about the selected launch
        });
    }
}

// Function associated with createUpcomingLaunches function
function createLaunchDetailsWindow(launch) {
    let html = "";

    html += `<div class="ld-name">Name: ${launch.name}</div>
    <div class="ld-date">Launch Date: ${new Date(launch.date_unix * 1000).toString()}</div>
    <div class="ld-date-precision">Launch date accurate to within one ${launch.date_precision}</div>
    <div class="ld-details">${launch.details ? launch.details : "No details available at this moment"}</div>
`;

    document.querySelector(".launch-details-window").innerHTML = html;
}

