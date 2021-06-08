let myCanvas;
let myCanvasContext;
let interval;
let priceHistory;
let currentX;
let consecutiveRises;
let consecutiveDrops;
let scaleLow;
let firstPriceIndexToBeShown;

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.getElementById("btnStart").addEventListener("click", startGame);
    myCanvas  = document.getElementById("myCanvas");
    myCanvasContext = myCanvas.getContext("2d");
    myCanvasContext.lineWidth = 3;
    priceHistory = [100.0];
    currentX = 100;
    consecutiveRises = 0;
    consecutiveDrops = 0;
    scaleLow = 80;
    firstPriceIndexToBeShown = 0;
    drawScale(80);
}

function drawScale(low) {
    myCanvasContext.lineWidth = 1;
    myCanvasContext.font = "50px Calibri";
    myCanvasContext.fillStyle = "lightgray"; //font color
    myCanvasContext.strokeStyle = "lightgray"; //line color

    for (let i = 0; i < 5; i++) myCanvasContext.fillText(`${i*10+low}`, 5, 915-i*200); //draw horizontal lines

    myCanvasContext.beginPath(); //draw scale numbers
    for (let i = 1; i < 10; i++) {
        myCanvasContext.moveTo(100, 100*i);
        myCanvasContext.lineTo(2000, 100*i);
    }
    myCanvasContext.stroke();
}

function startGame() {
    interval = setInterval(refreshChart, 100);
}

function refreshChart() {
    myCanvasContext.strokeStyle = "black";
    myCanvasContext.lineWidth = 3;

    priceHistory.push(getNewPrice());

    if (currentX+10 > myCanvas.width) {
        expandChartRight();
    }

    myCanvasContext.beginPath();
    myCanvasContext.moveTo(currentX, getY(priceHistory[priceHistory.length-2]));
    myCanvasContext.lineTo(currentX+=10, getY(priceHistory[priceHistory.length-1]));
    myCanvasContext.stroke();

    //console.log(priceHistory[priceHistory.length-1]);
}

function getY(price) {
    return myCanvas.height + 75*20 - price * 20;
}

function getNewPrice() {
    let random = Math.ceil(Math.random()*4); //random number between 1 and 4
    let difference = Math.ceil(Math.random()*9)/10; //random number between 0.1 and 0.9

    if (consecutiveRises === 3) {
        if (random === 1) {
            consecutiveRises = 0;
            consecutiveDrops = 1;
            return Math.round((priceHistory[priceHistory.length-1] - difference) * 10) / 10;
        }
        else return Math.round((priceHistory[priceHistory.length-1] + difference) * 10) / 10;
    }
    else if (consecutiveDrops === 3) {
        if (random === 1) {
            consecutiveDrops = 0;
            consecutiveRises = 1;
            return Math.round((priceHistory[priceHistory.length-1] + difference) * 10) / 10;
        }
        else return Math.round((priceHistory[priceHistory.length-1] - difference) * 10) / 10;
    }
    else {
        if (random === 1 || random === 2) {
            consecutiveDrops = 0;
            consecutiveRises++;
            return Math.round((priceHistory[priceHistory.length-1] + difference) * 10) / 10;
        }
        else {
            consecutiveRises = 0;
            consecutiveDrops++;
            return Math.round((priceHistory[priceHistory.length-1] - difference) * 10) / 10;
        }
    }
}

function expandChartRight() {
    firstPriceIndexToBeShown += 20;

    let index = firstPriceIndexToBeShown;

    myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
    drawScale(scaleLow);

    myCanvasContext.strokeStyle = "black";
    myCanvasContext.lineWidth = 3;

    myCanvasContext.beginPath();
    for(let i = 0; i < 170; i++) {
        myCanvasContext.moveTo(100+i*10, getY(priceHistory[index]));
        myCanvasContext.lineTo(110+i*10, getY(priceHistory[++index]));

    }
    myCanvasContext.stroke();

    currentX = 1800;
}