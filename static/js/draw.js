var context = document.getElementById('myCanvas').getContext("2d");
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

//list of lines created
var lines = new Array();

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

//save the click position
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
 * record the position in an array, set boolean paint to true, update canvas
 * @param  {[type]} e) {               var mouseX [description]
 * @return {[type]}    [description]
 */
$('#myCanvas').mousedown(function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});


//draw on canvas when user is pressing down
$('#myCanvas').mousemove(function(e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

//if marker is off paper
$('#myCanvas').mouseup(function(e) {
    paint = false;
});

//if marker goes off paper
$('#myCanvas').mouseleave(function(e) {
    paint = false;
});


function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}

/**
 * [setLineWidth description]
 * @param {int} width [description]
 */
function setLineWidth(width) {
    context.lineWidth = width;
}

/**
 * [setStrokeColor description]
 * @param {String} color Hex value
 */
function setStrokeColor(color) {
    context.strokeStyle = color;
}

function clearCanvas(reset = false) {
    if (reset) {
        clickX = new Array()
        clickY = new Array()
        clickDrag = new Array()
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
}


function animate() {
    console.log("IN animate");
    clearCanvas();
    animateLines()
}

var lineCount = 1;

function animateLines() {
    console.log("Animate lines")
    i = lineCount
    if (clickDrag[i]) {
        context.beginPath();
        context.moveTo(clickX[i - 1], clickY[i - 1]);
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
    lineCount += 1;

    if (i > clickX.length) {
        console.log("terminate");
        cancelAnimationFrame(requestID);
    } else {
        requestID = requestAnimationFrame(animateLines)
    }
}
