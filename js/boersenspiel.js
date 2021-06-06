let myCanvas;
let myCanvasContext;
let interval;
let x;
let y;
let consecutiveRises;
let consecutiveDrops;

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.getElementById("btnStart").addEventListener("click", startGame);
    myCanvas  = document.getElementById("myCanvas");
    myCanvasContext = myCanvas.getContext("2d");
    myCanvasContext.lineWidth = 3;
    x = 0;
    y = 500;
    consecutiveRises = 0;
    consecutiveDrops = 0;
}

function startGame() {
    interval = setInterval(refreshStockChart, 10);
}

function refreshStockChart() {
    if (x+10 > myCanvas.width) {
        myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
        x = 0;
    }
    myCanvasContext.beginPath();
    myCanvasContext.moveTo(x, y);
    myCanvasContext.lineTo(x+=10, y+=getPriceDifference()*2);
    myCanvasContext.stroke();
}

function getPriceDifference() {
    let priceTrend = Math.ceil(Math.random()*4); //random number between 1 and 4
    let difference = Math.ceil(Math.random()*9); //random number between 1 and 9

    if (consecutiveRises >= 3) {
        if (priceTrend === 1 || priceTrend === 2 || priceTrend === 3) {
            consecutiveRises++;
            return -difference;
        }
        else {
            consecutiveRises = 0;
            return difference;
        }
    }
    else if (consecutiveDrops >= 3) {
        if (priceTrend === 1 || priceTrend === 2 || priceTrend === 3) {
            consecutiveDrops++;
            return difference;
        }
        else {
            consecutiveDrops = 0;
            return -difference;
        }
    }
    else {
        if (priceTrend === 1 || priceTrend === 2) {
            consecutiveRises++;
            consecutiveDrops = 0;
            return -difference;
        }
        else {
            consecutiveDrops++;
            consecutiveRises = 0;
            return difference;
        }
    }
}