import watchesNumber, { _2x3, _3x5, _3x6, _4x6 } from "./handdegrees.js";

const rootStyles = getComputedStyle(document.documentElement);
const container = document.querySelector("section");
const numberSelect = document.querySelector("select[name='number']");
const sizeSelect = document.querySelector("select[name='size']");
const themeButton = document.querySelector("button[id='theme']");
const bezelSizeInput = document.querySelector(".bezel-size");

const checkboxHour = document.getElementById("checkboxHour");
const checkboxMinute = document.getElementById("checkboxMinute");
const checkboxSecond = document.getElementById("checkboxSecond");
const checkboxHourLabel = document.querySelector('.checkboxHour');
const checkboxMinuteLabel = document.querySelector('.checkboxMinute');
const checkboxSecondLabel = document.querySelector('.checkboxSecond');

const bezelSizeValue = parseInt(rootStyles.getPropertyValue("--bezel-size"), 10);
bezelSizeInput.value = bezelSizeValue;

let hourNumCol = checkboxHour.checked;
let minuteNumCol = checkboxMinute.checked;
let secondNumCol = checkboxSecond.checked;

const watchNumColHTML = `<div class="watchNumCol"></div>`;
const bezelHTML = `
    <div class="bezel">
        <div class="hour-hand-circle"><div class="hour-hand"></div></div>
        <div class="minute-hand-circle"><div class="minute-hand"></div></div>
        <div class="second-hand-circle"><div class="second-hand"></div></div>
    </div>
`;

const updateClockHands = () => {
    const watchNumColumns = document.querySelectorAll(".watchNumCol");
    const now = new Date();
    const nowWatch = [
        ...(hourNumCol ? [Math.floor(now.getHours() / 10), now.getHours() % 10] : []),
        ...(minuteNumCol ? [Math.floor(now.getMinutes() / 10), now.getMinutes() % 10] : []),
        ...(secondNumCol ? [Math.floor(now.getSeconds() / 10), now.getSeconds() % 10] : []),
    ];

    watchNumColumns.forEach((elementWatchNumColumns, index) => {
        const bezels = elementWatchNumColumns.querySelectorAll(".bezel");
        if (nowWatch[index] == null || nowWatch[index] == undefined) return;

        const numRotates = watchesNumber[sizeSelect.value][`_${nowWatch[index]}`];

        bezels.forEach((bezel, i) => {
            const minute = bezel.querySelector(".minute-hand-circle");
            const hour = bezel.querySelector(".hour-hand-circle");
            const second = bezel.querySelector(".second-hand-circle");
            
            const { minute: minDeg, hour: hourDeg, second: secDeg } = numRotates?.[`_${i + 1}`] || {
                minute: 225,
                hour: 225,
                second: 225,
            };

            minute.style.transform = `rotate(${minDeg}deg)`;
            hour.style.transform = `rotate(${hourDeg}deg)`;
            second.style.transform = `rotate(${secDeg}deg)`;
        });
    });
};

const changeSize = () => {
    const rowWatch = watchesNumber[sizeSelect.value]?.row || 2;
    container.innerHTML = "";
    document.documentElement.style.setProperty("--row", rowWatch);

    createBezels(sizeSelect.value);
    updateClockHands();
};

const createBezels = (value) => {
    const watchNumCols = (hourNumCol + minuteNumCol + secondNumCol) * 2;
    container.innerHTML = watchNumColHTML.repeat(watchNumCols);

    const watchNumColumns = document.querySelectorAll(".watchNumCol");
    const watches = watchesNumber[value]?.watches || 6;

    watchNumColumns.forEach((element) => {
        element.innerHTML = bezelHTML.repeat(watches);
    });
};

const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
};

const changeBezelSize = () => {
    document.documentElement.style.setProperty("--bezel-size", `${bezelSizeInput.value}px`);
};

const displayOrHideClock = (event) => {
    const { name, checked } = event.target;

    if (name === "hour") hourNumCol = checked;
    if (name === "minute") minuteNumCol = checked;
    if (name === "second") secondNumCol = checked;

    changeSize();
};

// Initialize
changeSize();
setInterval(updateClockHands, 5000);

sizeSelect.addEventListener("change", changeSize);
numberSelect.addEventListener("change", updateClockHands);
themeButton.addEventListener("click", toggleTheme);
bezelSizeInput.addEventListener("change", changeBezelSize);
checkboxHour.addEventListener("change", displayOrHideClock);
checkboxMinute.addEventListener("change", displayOrHideClock);
checkboxSecond.addEventListener("change", displayOrHideClock);
