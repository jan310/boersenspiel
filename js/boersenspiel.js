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

/**
 * starts the game
 */
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        countDownInterval = setInterval(refreshGameCountDown, 1000);
        drawScale();
        interval = setInterval(refreshChart, 100);
    }
}

/**
 * refreshes the game countdown each second and informs the player at the end of the game
 * game ends if the stock price drops down to 0€ or if five minutes are over
 */
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

/**
 * draws the background lines and the scale, depending the variable "scaleLow"
 */
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

    myCanvasContext.strokeStyle = "black"; //resetting the drawing properties (setup for drawing the chart)
    myCanvasContext.lineWidth = 3;
}

/**
 * draws the stock chart and updates the stock price each second
 */
function refreshChart() {
    priceHistory.push(getNewPrice());

    if (currentX === myCanvas.width-100) expandChartRight();

    if (priceHistory[priceHistory.length-1] < scaleLow || priceHistory[priceHistory.length-1] > scaleLow+50) expandChartTopBottom();

    if (consecutiveRises === 3) stockPrice.style.color = "green";
    else if (consecutiveDrops === 3) stockPrice.style.color = "red";
    else stockPrice.style.color = "black";
    stockPrice.innerText = `EUR ${priceHistory[priceHistory.length-1].toFixed(2)}`;

    myCanvasContext.beginPath();
    myCanvasContext.moveTo(currentX, getY(priceHistory[priceHistory.length-2]));
    myCanvasContext.lineTo(currentX+=10, getY(priceHistory[priceHistory.length-1]));
    myCanvasContext.stroke();
}

/**
 * returns true, if the current stock price is less than or equal to 0€
 */
function priceEqualsZero() {
    if (priceHistory[priceHistory.length-1] <= 0) return true;
}

/**
 * returns the y-coordinate of the next point that has to be connected to to the stock chart
 * depends on the given price and the current scale (and on the canvas resolution, but this shouldn't change)
 */
function getY(price) {
    return myCanvas.height + scaleLow*20 - price*20;
}

/**
 * returns a new stock price
 */
function getNewPrice() {
    let random = Math.ceil(Math.random()*4); //random number between 1 and 4
    let difference = Math.ceil(Math.random()*9)/10; //random number between 0.1 and 0.9

    if (consecutiveRises === 3) { //if the stock price rose three consecutive times, the chance for further price gains increases to 75%
        if (random === 1) {
            consecutiveRises = 0;
            consecutiveDrops = 1;
            return Math.round((priceHistory[priceHistory.length-1] - difference) * 10) / 10;
        }
        else return Math.round((priceHistory[priceHistory.length-1] + difference) * 10) / 10;
    }
    else if (consecutiveDrops === 3) { //if the stock price dropped three consecutive times, the chance for further price losses increases to 75%
        if (random === 1) {
            consecutiveDrops = 0;
            consecutiveRises = 1;
            return Math.round((priceHistory[priceHistory.length-1] + difference) * 10) / 10;
        }
        else return Math.round((priceHistory[priceHistory.length-1] - difference) * 10) / 10;
    }
    else { //chances for price gains and drops during normal market periods are equal (50%)
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

/**
 * if the chart reaches the right end of the canvas element, everything drawn on the canvas gets cleared
 * then, a new scale gets drawn and the old chart gets drawn again, but moved one unit (10px) to the left
 */
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

/**
 * if the chart reaches the top or bottom end of the canvas element, everything drawn on the canvas gets cleared
 * then, a new scale gets drawn and the old chart gets drawn again, but moved up or down, depending on the situation
 */
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

/**
 * if the user has enough money, a new stock is added to the user's stock portfolio
 * also, the budget and the average buying price is updated
 */
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

/**
 * one stock is removed from the user's stock portfolio and the budget and average buying price is updated
 */
function sell() {
    if (numberOfStocks > 0) {
        budget += priceHistory[priceHistory.length-1];
        numberOfStocks--;
        buyingPrices.shift(); //first in, first out: when shares are sold, the ones which were bought first also also sold first first
        document.getElementById("numberOfStocks").innerText = `Anzahl Aktien: ${numberOfStocks}`;
        document.getElementById("budget").innerText = `Budget: ${budget.toFixed(2)}€`;
        document.getElementById("averageBuyingPrice").innerText = `Kaufpreis (Ø): ${getAverageBuyingPrice()}`;
    }
}

/**
 * returns the average buying price of the acquired stocks
 */
function getAverageBuyingPrice() {
    let sum = 0;
    buyingPrices.forEach(element => sum += element);
    if (numberOfStocks > 0) return (sum / numberOfStocks).toFixed(2);
    else return "-";
}

/**
 * returns the total budget at the end of the game: the remaining budget plus the number of stocks held multiplied with the latest stock price
 */
function getEndBudget() {
    return (budget + (numberOfStocks*priceHistory[priceHistory.length-1])).toFixed(2);
}

/**
 * resets all relevant variables to start a new game
 */
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