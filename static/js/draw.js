var context = document.getElementById('myCanvas').getContext("2d");
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var colors = new Array();
var strokeWidth = new Array();
var opacity = new Array();
var simultaneousAnim = {};
var paint;
var currentAnim = null;

var simultaneous = $('#simultaneous').prop('checked');
colors.push($('#cp2').colorpicker('getValue'));
strokeWidth.push(parseInt($("#strokeWidth").val()));
opacity.push(parseFloat($("#opacity").val()));
//list of lines created
var lines = new Array();

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

function simultaneousOptions() {
    if ($('#simultaneous').prop('checked')) {
        console.log("INSERT AFTER");
        $("#simult").append('<label for = "simult_anim_num">Number of simultaneous animations<input class="form-control" id="simult_anim_num" value="0" placeholder="Number of simultaneous animations" type="number" min="0" step="1" /></label>');
    }
    detectChange("#simult_anim_num", function(data) {
        $(".simult_anim").remove();
        for (var i = 0; i < data; i++) {
            $("label[for='simult_anim_num']").append('<div class = "simult_anim" class="checkbox">' +
                '<label><input class = "simult_an_box" onclick="currentAnimation(' + i + ')" type="checkbox" id = "simult_anim' + i + '" value="1">Animation ' + i + '</label></div>');

            simultaneousAnim["animation_" + i] = {};
        }
    });
}

function currentAnimation(divCount) {
    var id = "#simult_anim" + divCount;
    console.log("currentAnimation clicked");
    if ($(id).prop('checked')) {
        $(".simult_an_box:not(" + id + ")").attr("disabled", "");

        currentAnim = "animation_" + divCount;
        simultaneousAnim[currentAnim] = { "clickX": [], "clickY": [], "colors": [], "strokeWidth": [], "opacity": [], "clickDrag": [] };

    } else {
        $(".simult_an_box").removeAttr("disabled");
        currentAnim = null;
    }

}

function detectChange(divID, callback) {
    $(divID).bind('keyup input change', function() {
        var data = parseInt($(this).val());
        callback(data);
    });
}

//save the click position and other data
function addClick(x, y, dragging, i = 1) {
    if (currentAnim != null) {
        simultaneousAnim[currentAnim]["in_use"] = true;
        simultaneousAnim[currentAnim]["clickX"].push(x);
        simultaneousAnim[currentAnim]["clickY"].push(y);
        simultaneousAnim[currentAnim]["colors"].push($('#cp2').colorpicker('getValue'));
        simultaneousAnim[currentAnim]["strokeWidth"].push(parseInt($("#strokeWidth").val()));
        simultaneousAnim[currentAnim]["opacity"].push(parseFloat($("#opacity").val()));
        simultaneousAnim[currentAnim]["clickDrag"].push(dragging);

        console.log(simultaneousAnim);
    } else {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        colors.push($('#cp2').colorpicker('getValue'));
        strokeWidth.push(parseInt($("#strokeWidth").val()));
        opacity.push(parseFloat($("#opacity").val()));
    }
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
    if (currentAnim != null) {
        redraw(0);
    }
});


//draw on canvas when user is pressing down
$('#myCanvas').mousemove(function(e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
        if (currentAnim != null) {
            redraw(0);
        }
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

/**
 * [setLine description]
 * @param {[type]} i        [description]
 * @param {Number} anim_num [description]
 */
function setLine(i, anim_num = 1) {
    var j = anim_num;
    var currentAnim = "animation_" + j;
    if (j != 1) {
        context.lineWidth = simultaneousAnim[currentAnim]["strokeWidth"][i];
        if (simultaneousAnim[currentAnim]["colors"][i] != null) {
            context.strokeStyle = simultaneousAnim[currentAnim]["colors"][i]; // window["colors" + j][i];
        } else {
            context.strokeStyle = $('#cp2').colorpicker('getValue');
        }
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
        if (colors[i] != null) {
            context.strokeStyle = colors[i];
        } else {
            context.strokeStyle = $('#cp2').colorpicker('getValue');
        }
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


function redraw(anim_count = 1) {
    var j = anim_count;
    var currentAnim = "animation_" + j;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.lineJoin = "round";

    if (j == 1) {

        for (var i = 0; i < clickX.length; i++) {
            setLine(i);
        }
    } else {
        for (var i = 0; i < simultaneousAnim[currentAnim]["clickX"].length; i++) {
            setLine(i, j);
        }
    }
}

function clearCanvas(reset = false) {
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
    clearCanvas();
    animateLines();
    animateLines(0);
}

var lineCount = 1;

function animateLines(anim_count = 1) {
    var j = anim_count;
    var currentAnim = "animation_" + j;
    i = lineCount;
    setLine(i, anim_count);
    lineCount += 1;

    if (anim_count == 1) {

        if (i > clickX.length) {
            cancelAnimationFrame(requestID);
        } else {
            requestID = requestAnimationFrame(function() {
                animateLines(anim_count);
            });
        }
    } else {
        if (i > simultaneousAnim[currentAnim]["clickX"].length) {
            cancelAnimationFrame(window["requestID"+j]);
        } else {
            window["requestID"+j] = requestAnimationFrame(function() {
                animateLines(anim_count);
            });
        }
    }
}
