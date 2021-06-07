let myCanvas;
let myCanvasContext;
let interval;
let priceHistory;
let x;
let consecutiveRises;
let consecutiveDrops;

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.getElementById("btnStart").addEventListener("click", startGame);
    myCanvas  = document.getElementById("myCanvas");
    myCanvasContext = myCanvas.getContext("2d");
    myCanvasContext.lineWidth = 3;
    priceHistory = [100.0];
    x = 0;
    consecutiveRises = 0;
    consecutiveDrops = 0;
}

function startGame() {
    interval = setInterval(refreshStockChart, 100);
}

function refreshStockChart() {
    priceHistory.push(getNewPrice());
    if (x+10 > myCanvas.width) {
        myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
        x = 0;
    }
    myCanvasContext.beginPath();
    myCanvasContext.moveTo(x, getY(priceHistory[priceHistory.length-2]));
    myCanvasContext.lineTo(x+=10, getY(priceHistory[priceHistory.length-1]));
    myCanvasContext.stroke();

    console.log(priceHistory[priceHistory.length-1]);
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