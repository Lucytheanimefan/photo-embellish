var context = document.getElementById('myCanvas').getContext("2d");
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var colors = new Array();
var strokeWidth = new Array();
var opacity = new Array();
var simultaneous = new Array();
var paint;


simultaneous.push($('#simultaneous').prop('checked'));
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
            $("label[for='simult_anim_num']").append('<div class = "simult_anim" class="checkbox">'+
                                                '<label><input onclick="currentAnimation(this)" type="checkbox" id = "simult_anim" value="1">Animation '+i+'</label></div>')
        }
    });
}

function currentAnimation(divElement){
    console.log("currentAnimation clicked")
    $(divElement).prevAll().parent().addClass("disabled");
}

function detectChange(divID, callback) {
    $(divID).bind('keyup input change', function() {
        var data = parseInt($(this).val());
        callback(data);
    })
}

//save the click position and other data
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    colors.push($('#cp2').colorpicker('getValue'));
    strokeWidth.push(parseInt($("#strokeWidth").val()));
    opacity.push(parseFloat($("#opacity").val()));
    simultaneous.push($('#simultaneous').prop('checked'));
    console.log(simultaneous);
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

function setLine(i) {
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


function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.lineJoin = "round";

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
