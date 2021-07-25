let myCanvas;
let myCanvasContext;
let stockPrice;
let interval;
let countDownInterval;
let priceHistory;
let currentX;
let consecutiveRises;
let consecutiveDrops;
let scaleLow;
let indexOfFirstPriceToBeDrawn;
let gameStarted;
let gameCountDown;
let budget;
let numberOfStocks;
let buyingPrices;

document.addEventListener("DOMContentLoaded", init);

function init() {
    document.getElementById("btnStart").addEventListener("click", startGame);
    document.getElementById("btnBuy").addEventListener("click", buy);
    document.getElementById("btnSell").addEventListener("click", sell);
    document.getElementById("btnReset").addEventListener("click", resetGame);
    myCanvas  = document.getElementById("myCanvas");
    myCanvasContext = myCanvas.getContext("2d");
    stockPrice = document.getElementById("stockPrice");
    priceHistory = [100.0];
    currentX = 100;
    consecutiveRises = 0;
    consecutiveDrops = 0;
    scaleLow = 75;
    indexOfFirstPriceToBeDrawn = 0;
    gameStarted = false;
    gameCountDown = 300;
    budget = 1000.00;
    numberOfStocks = 0;
    buyingPrices = [];
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        countDownInterval = setInterval(refreshGameCountDown, 1000);
        drawScale();
        interval = setInterval(refreshChart, 100);
    }
}

function refreshGameCountDown() {
    gameCountDown--;

    if (gameCountDown === 0 || priceEqualsZero()) {
        clearInterval(countDownInterval);
        clearInterval(interval);
        document.getElementById("infoText").innerText = `Das Spiel ist zu Ende. Sie haben nun ein Guthaben von ${getEndBudget()}€`;
        let myModal = new bootstrap.Modal(document.getElementById("gameOverInfo"), {backdrop: "static"});
        myModal.show();
    }

    let min;
    let sec;

    min = Math.floor(gameCountDown/60).toString();
    sec = gameCountDown % 60;
    if (sec < 10) {
        sec = "0" + sec.toString();
    }

    document.getElementById("gameCountDown").innerText = `${min}:${sec}`;
}

function drawScale() {
    myCanvasContext.lineWidth = 1;
    myCanvasContext.font = "50px Calibri";
    myCanvasContext.fillStyle = "lightgray"; //font color
    myCanvasContext.strokeStyle = "lightgray"; //line color

    for (let i = 0; i < 5; i++) myCanvasContext.fillText(`${i*10+scaleLow+5}`, 10, 915-i*200); //draw scale numbers

    myCanvasContext.beginPath(); //draw horizontal lines
    for (let i = 1; i < 10; i++) {
        myCanvasContext.moveTo(100, 100*i);
        myCanvasContext.lineTo(myCanvas.width-100, 100*i);
    }
    myCanvasContext.stroke();

    myCanvasContext.strokeStyle = "black"; //setup for drawing the chart
    myCanvasContext.lineWidth = 3;
}

function refreshChart() {
    priceHistory.push(getNewPrice());

    if (currentX === myCanvas.width-100) expandChartRight();

    if (priceHistory[priceHistory.length-1] < scaleLow || priceHistory[priceHistory.length-1] > scaleLow+50) expandChartTopBottom();

    stockPrice.innerText = `EUR ${priceHistory[priceHistory.length-1].toFixed(2)}`;

    myCanvasContext.beginPath();
    myCanvasContext.moveTo(currentX, getY(priceHistory[priceHistory.length-2]));
    myCanvasContext.lineTo(currentX+=10, getY(priceHistory[priceHistory.length-1]));
    myCanvasContext.stroke();
}

function priceEqualsZero() {
    if (priceHistory[priceHistory.length-1] <= 0) return true;
}

function getY(price) {
    return myCanvas.height + scaleLow*20 - price*20;
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
    indexOfFirstPriceToBeDrawn++;

    let index = indexOfFirstPriceToBeDrawn;

    myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
    drawScale(scaleLow);

    myCanvasContext.beginPath();
    for (let i = 0; i < 180; i++) {
        myCanvasContext.moveTo(100+i*10, getY(priceHistory[index]));
        myCanvasContext.lineTo(110+i*10, getY(priceHistory[++index]));

    }
    myCanvasContext.stroke();

    currentX = myCanvas.width-110;
}

function expandChartTopBottom() {
    myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);

    if (priceHistory[priceHistory.length-1] < scaleLow) drawScale(scaleLow-=10);
    else drawScale(scaleLow+=10);

    let index = indexOfFirstPriceToBeDrawn;

    myCanvasContext.beginPath();
    for (let i = 0; i < priceHistory.length-indexOfFirstPriceToBeDrawn; i++) {
        myCanvasContext.moveTo(100+i*10, getY(priceHistory[index]));
        myCanvasContext.lineTo(110+i*10, getY(priceHistory[++index]));
    }
    myCanvasContext.stroke();
}

function buy() {
    if (budget >= priceHistory[priceHistory.length-1]) {
        budget -= priceHistory[priceHistory.length-1];
        numberOfStocks++;
        buyingPrices.push(priceHistory[priceHistory.length-1]);
        document.getElementById("numberOfStocks").innerText = `Anzahl Aktien: ${numberOfStocks}`;
        document.getElementById("budget").innerText = `Budget: ${budget.toFixed(2)}€`;
        document.getElementById("averageBuyingPrice").innerText = `Kaufpreis (Ø): ${getAverageBuyingPrice()}`;
    }
}

function sell() {
    if (numberOfStocks > 0) {
        budget += priceHistory[priceHistory.length-1];
        numberOfStocks--;
        buyingPrices.shift();
        document.getElementById("numberOfStocks").innerText = `Anzahl Aktien: ${numberOfStocks}`;
        document.getElementById("budget").innerText = `Budget: ${budget.toFixed(2)}€`;
        document.getElementById("averageBuyingPrice").innerText = `Kaufpreis (Ø): ${getAverageBuyingPrice()}`;
    }
}

function getAverageBuyingPrice() {
    let sum = 0;
    buyingPrices.forEach(element => sum += element);
    if (numberOfStocks > 0) return (sum / numberOfStocks).toFixed(2);
    else return "-";
}

function getEndBudget() {
    return (budget + (numberOfStocks*priceHistory[priceHistory.length-1])).toFixed(2);
}

function resetGame() {
    priceHistory = [100.0];
    currentX = 100;
    consecutiveRises = 0;
    consecutiveDrops = 0;
    scaleLow = 75;
    indexOfFirstPriceToBeDrawn = 0;
    gameStarted = false;
    gameCountDown = 300;
    budget = 1000.00;
    numberOfStocks = 0;
    buyingPrices = [];
    window.location.href="boersenspiel.html";
}