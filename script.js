import watchesNumber, { _2x3, _3x5, _3x6, _4x6 } from "./handdegrees.js";

let intervalId;
let firstAnimation = 0;
let animationSetIntervalTime = 1000;
let showClockSetIntervalTime = 3000;
let hand_transition = document.documentElement.style;

const rootStyles = getComputedStyle(document.documentElement);
const container = document.querySelector("section");
const numberSelect = document.querySelector("select[name='number']");
const sizeSelect = document.querySelector("select[name='size']");
const themeButton = document.querySelector("button[id='theme']");
const bezelSizeInput = document.querySelector(".bezel-size");

const checkboxHour = document.getElementById("checkboxHour");
const checkboxMinute = document.getElementById("checkboxMinute");
const checkboxSecond = document.getElementById("checkboxSecond");
const checkboxAnimate = document.getElementById("checkboxAnimate");

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
// test 1
let changeFunction = () => {
    firstAnimation++
    const watchNumColumns = document.querySelectorAll(".watchNumCol");

    watchNumColumns.forEach((elementWatchNumColumns, index) => {
        const bezels = elementWatchNumColumns.querySelectorAll(".bezel");

        bezels.forEach((bezel, i) => {
            const minute = bezel.querySelector(".minute-hand-circle");
            const hour = bezel.querySelector(".hour-hand-circle");
            const second = bezel.querySelector(".second-hand-circle");

            const minuteStyle = minute.style;
            const hourStyle = hour.style;
            const secondStyle = second.style;

            const minuteRotate = Number(minuteStyle.transform.replace('rotate(', '').replace('deg)', ''));
            const hourRotate = Number(hourStyle.transform.replace('rotate(', '').replace('deg)', ''));
            const secondRotate = Number(secondStyle.transform.replace('rotate(', '').replace('deg)', ''));

            let minDeg = 0;
            let hourDeg = 0;
            let secDeg = 0;

            if (firstAnimation === 1) {
                minDeg = 225;
                hourDeg = 45;
                secDeg = 225;
            } else {
                minDeg = minuteRotate + 20;
                hourDeg = hourRotate + 20;
                secDeg = secondRotate + 20;
            }

            minute.style.transform = `rotate(${minDeg}deg)`;
            hour.style.transform = `rotate(${hourDeg}deg)`;
            second.style.transform = `rotate(${secDeg}deg)`;
        });
    });
};

// test 2
const stopAnimationBackRotationHands = () => {
    const watchNumColumns = document.querySelectorAll(".watchNumCol");

    watchNumColumns.forEach((elementWatchNumColumns, index) => {
        const bezels = elementWatchNumColumns.querySelectorAll(".bezel");

        bezels.forEach((bezel, i) => {
            const minute = bezel.querySelector(".minute-hand-circle");
            const hour = bezel.querySelector(".hour-hand-circle");
            const second = bezel.querySelector(".second-hand-circle");

            const minuteStyle = minute.style;
            const hourStyle = hour.style;
            const secondStyle = second.style;

            const minuteRotate = Number(minuteStyle.transform.replace('rotate(', '').replace('deg)', ''));
            const hourRotate = Number(hourStyle.transform.replace('rotate(', '').replace('deg)', ''));
            const secondRotate = Number(secondStyle.transform.replace('rotate(', '').replace('deg)', ''));

            function normalizeAngle(angle) {
                return ((angle % 360) + 360) % 360;
            }
 
            const minDeg = normalizeAngle(minuteRotate);
            const hourDeg = normalizeAngle(hourRotate);
            const secDeg = normalizeAngle(secondRotate);

            hand_transition.setProperty('--hand-transition', 'transform 0s linear');
            minute.style.transform = `rotate(${minDeg}deg)`;
            hour.style.transform = `rotate(${hourDeg}deg)`;
            second.style.transform = `rotate(${secDeg}deg)`;
        });
    });
};

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

const animationCheckbox = (event) => {
    const checked = event.target.checked;

    if (checked) {
        const startSecond = 5
        hand_transition.setProperty('--hand-transition', `transform ${startSecond}s linear`);

        clearInterval(intervalId);
        intervalId = null;

        changeFunction();
        setTimeout(() => {
            intervalId = setInterval(changeFunction, animationSetIntervalTime);
        }, startSecond * 1000);
    } else {
        clearInterval(intervalId);
        intervalId = null;
        stopAnimationBackRotationHands()
        setTimeout(() => {
            intervalId = setInterval(updateClockHands, showClockSetIntervalTime);
            hand_transition.setProperty('--hand-transition', 'transform 2s ease-in-out');
        }, 500);
        firstAnimation = 0;
    }
}

changeSize();
intervalId = setInterval(updateClockHands, showClockSetIntervalTime);

sizeSelect.addEventListener("change", changeSize);
numberSelect.addEventListener("change", updateClockHands);
themeButton.addEventListener("click", toggleTheme);
bezelSizeInput.addEventListener("change", changeBezelSize);
checkboxHour.addEventListener("change", displayOrHideClock);
checkboxMinute.addEventListener("change", displayOrHideClock);
checkboxSecond.addEventListener("change", displayOrHideClock);
checkboxAnimate.addEventListener("change", animationCheckbox);
