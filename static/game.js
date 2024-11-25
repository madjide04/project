
function selected2() {
    var black = document.getElementById("black");
    black.classList.toggle("clicked");
    white.classList.remove("clicked");
    const form_color = document.querySelector("#subForm #color");
    form_color.setAttribute("value", "b")
}
function selected1() {
    var white = document.getElementById("white");
    white.classList.toggle("clicked");
    black.classList.remove("clicked");
    const form_color = document.querySelector("#subForm #color");
    form_color.setAttribute("value", "w")
}
function selected4() {
    var blackf = document.getElementById("blackf");
    blackf.classList.toggle("clicked");
    whitef.classList.remove("clicked");
}
function selected3() {
    var white = document.getElementById("whitef");
    whitef.classList.toggle("clicked");
    blackf.classList.remove("clicked");
}
function togglefriend() {
    var boxfriend = document.getElementById("boxfriend");
    var button2 = document.getElementById("button2");
    var boxai = document.getElementById("boxai");
    var transparentDiv = document.querySelector(".transparent");

    // Toggle display of boxfriend
    boxfriend.style.display = (boxfriend.style.display == "none") ? "block" : "none";
    button2.classList.toggle("clicked");

    // Hide boxai and remove clicked class from button1 if boxfriend is displayed
    if (boxfriend.style.display == "block") {
        boxai.style.display = "none";
        button1.classList.remove("clicked");
    }

    // Apply styling to transparent div
    transparentDiv.style.display = (boxfriend.style.display == "block") ? "block" : "none";
}




function toggleAI() {
    var boxai = document.getElementById("boxai");
    var button1 = document.getElementById("button1");
    var boxfriend = document.getElementById("boxfriend");
    var transparentDiv = document.querySelector(".transparent");

    // Toggle display of boxai
    boxai.style.display = (boxai.style.display == "none") ? "block" : "none";
    button1.classList.toggle("clicked");

    // Hide boxfriend and remove clicked class from button2 if boxai is displayed
    if (boxai.style.display == "block") {
        boxfriend.style.display = "none";
        button2.classList.remove("clicked");
    }

    // Apply styling to transparent div
    transparentDiv.style.display = (boxai.style.display == "block") ? "block" : "none";
}


// Add event listener to the transparent div
document.addEventListener('DOMContentLoaded', function() {
    var transparentDiv = document.querySelector(".transparent");
    transparentDiv.addEventListener('click', function() {
        // Hide the friend div and remove 'clicked' class from button2
        var boxfriend = document.getElementById("boxfriend");
        var button2 = document.getElementById("button2");
        boxfriend.style.display = "none";
        button2.classList.remove("clicked");

        // Hide the AI div and remove 'clicked' class from button1
        var boxai = document.getElementById("boxai");
        var button1 = document.getElementById("button1");
        boxai.style.display = "none";
        button1.classList.remove("clicked");

        // Remove overlay styling from the transparent div
        transparentDiv.classList.remove("overlay");
    });
});
// Get the button elements and the number display span
const decreaseBtn = document.getElementById('decrease-btn');
const increaseBtn = document.getElementById('increase-btn');
const numberDisplay = document.getElementById('number-display');

// Add event listeners for the buttons
decreaseBtn.addEventListener('click', decreaseNumber);
increaseBtn.addEventListener('click', increaseNumber);

// Initial number value
let number = 1;
const hardnessdiv = document.querySelector("#number-container");
hardness = hardnessdiv.getAttribute("hardness");
console.log("hardness is :",hardness);
const form = document.querySelector("#subForm");
// Function to decrease the number
function decreaseNumber() {
    if (number > 1) {
        number--;
        updateNumberDisplay();
    }
}

// Function to increase the number
function increaseNumber() {
    if (number < hardness) {
        number++;
        updateNumberDisplay();
    }
}

// Function to update the number display
function updateNumberDisplay() {
    numberDisplay.textContent = number;
    const form_hardness = document.querySelector("#subForm #hardness");
    form_hardness.setAttribute("value", number)
}


const selectBtn = document.getElementById('select-btn');
const botList = document.getElementById('bot-list');
const botItems = document.querySelectorAll('#bot-list li');

selectBtn.addEventListener('click', function() {
    botList.classList.toggle('visible');
});

botItems.forEach(function(botItem) {
    botItem.addEventListener('click', function() {
        selectBtn.textContent = this.textContent;
        hardness = this.getAttribute("hardness");
        number = 1;
        const form_name = document.querySelector("#subForm #name");
        form_name.setAttribute("value", this.textContent)
        updateNumberDisplay();
        botList.classList.remove('visible'); // Hide the bot list
    });
});

function selectedColor(color) {
    document.getElementById('selected-color').value = color;
}

