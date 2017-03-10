/**
 * Copyright Lucy Zhang anime elitist snob
 */


var context = document.getElementById('myCanvas').getContext('2d');
var currentAnim = null;
var currentAnim_count = null;

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var canvas = document.getElementById("myCanvas");
canvas.width = $("#myImage").width();
canvas.height = $("#myImage").height();

function setLine(i, anim_num) {
    var j = anim_num;
    var currentAnim = "animation_" + j;
    if (j != -1) {
        context.lineWidth = simultaneousAnim[currentAnim]["strokeWidth"][i];
        context.strokeStyle = simultaneousAnim[currentAnim]["colors"][i];
        if (simultaneousAnim[currentAnim]["opacity"][i] != null) {
            context.globalAlpha = simultaneousAnim[currentAnim]["opacity"][i];
        } else {
            context.globalAlpha = parseFloat($("#opacity").val());
        }
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(simultaneousAnim[currentAnim]["clickX"][i - 1], simultaneousAnim[currentAnim]["clickY"][i - 1]);
        } else {
            context.moveTo(simultaneousAnim[currentAnim]["clickX"][i] - 1, simultaneousAnim[currentAnim]["clickY"][i]);
        }
        context.lineTo(simultaneousAnim[currentAnim]["clickX"][i], simultaneousAnim[currentAnim]["clickY"][i]);
        context.closePath();
        context.stroke();

    } else {
        context.lineWidth = strokeWidth[i];
        //if (colors[i] != null) {
        context.strokeStyle = colors[i];
        if (opacity[i] != null) {
            context.globalAlpha = opacity[i];
        } else {
            context.globalAlpha = parseFloat($("#opacity").val());
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
}


function redraw(anim_count) {
    var j = anim_count;
    var currentAnim = "animation_" + j;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.lineJoin = "round";

    if (j == -1) {

        for (var i = 0; i < clickX.length; i++) {
            setLine(i, -1);
        }
    } else {
        for (var i = 0; i < simultaneousAnim[currentAnim]["clickX"].length; i++) {
            setLine(i, j);
        }
    }
}

function clearCanvas(reset) {
    if (reset) {
        clickX = new Array();
        clickY = new Array();
        clickDrag = new Array();
        colors = new Array();
        strokeWidth = new Array();
        opacity = new Array();
        //simultaneous = new Array();
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

}


function animate() {
    clearCanvas(false);
    animateLines(-1);
    for (var val in used_animations) {
        animateLines(val);
    }

}

var lineCount = 1;

function animateLines(anim_count) {
    var j = anim_count;
    var currentAnim = "animation_" + j;
    i = lineCount;
    setLine(i, anim_count);
    lineCount += 1;

    if (anim_count == -1) {

        if (i > clickX.length) {
            cancelAnimationFrame(requestID);
        } else {
            requestID = requestAnimationFrame(function() {
                animateLines(anim_count);
            });
        }
    } else {
        if (i > simultaneousAnim[currentAnim]["clickX"].length) {
            cancelAnimationFrame(window["requestID" + j]);
        } else {
            window["requestID" + j] = requestAnimationFrame(function() {
                animateLines(anim_count);
            });
        }
    }
}

$(document).ready(function() {
    animate();
});
