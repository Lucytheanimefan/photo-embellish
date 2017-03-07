/**
 * Copyright Lucy Zhang anime elitist snob
 */


var context = document.getElementById('myCanvas').getContext('2d');

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

function setLine(i) {
    context.lineWidth = strokeWidth[i];
    //if (colors[i] != null) {
    context.strokeStyle = colors[i];
    //} else {
    //    context.strokeStyle = $('#cp2').colorpicker('getValue');
    //}
    if (opacity[i] != null) {
        context.globalAlpha = opacity[i];
    } else {
        context.globalAlpha = parseFloat($('#opacity').val());
    }
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


function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.lineJoin = 'round';

    for (var i = 0; i < clickX.length; i++) {
        setLine(i);
    }
}

function clearCanvas(reset) {
    if (reset) {
        clickX = new Array();
        clickY = new Array();
        clickDrag = new Array();
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

}


function animate() {
    clearCanvas(false);
    animateLines();
}

var lineCount = 1;

function animateLines() {
    i = lineCount;
    setLine(i);
    lineCount += 1;

    if (i > clickX.length) {
        cancelAnimationFrame(requestID);
    } else {
        requestID = requestAnimationFrame(animateLines);
    }
}

$(document).ready(function() {
    animate();
});
