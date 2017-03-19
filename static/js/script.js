var BASE_URL = "https://photo-embellish.herokuapp.com"
var blank_img_size = 400;
//get uploaded photo
$("#fileChooser").change(function(e) {
    $("#myImage").remove();

    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

        var file = e.originalEvent.srcElement.files[i];

        var img = document.createElement("img");
        img.id = "myImage";
        var reader = new FileReader();
        reader.onloadend = function() {

            img.src = reader.result;
            var canvas = document.getElementById("myCanvas");

            canvas.width = $("#myImage").width();
            canvas.height = $("#myImage").height();
            myImage = new Image($("#myImage").width(), $("#myImage").height());
            myImage.src = reader.result;
            myImage.id = 'myImage'

        }
        reader.readAsDataURL(file);
        $(".navbar").after(img);
    }
});

//side bar
$(document).ready(function() {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function() {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function() {
        $('#wrapper').toggleClass('toggled');
    });
});

function blankProjectOptions() {
    $("#blankProjSettings").css("display", "inline");
    /*
    $("#blankProj").after('<label for="width">Width</label>' +
        '<input class="form-control" id="width" value="400" placeholder="opacity" type="number" min="1" step="1" />' + '<label for="height">Height</label>' +
        '<input class="form-control" id="height" value="400" placeholder="opacity" type="number" min="1" step="1" />');
        */

}

$("#createBlankProject").click(function() {
    var width = $("#width").val();
    var height = $("#height").val();
    createBlankProject(width, height);
})

function createBlankProject(width = blank_img_size, height = blank_img_size) {
    $("#myImage").remove();
    var myImage = new Image(width, height);
    myImage.src = '/static/img/blank.png';
    myImage.id = "myImage";
    var canvas = document.getElementById("myCanvas");
    canvas.width = width;
    canvas.height = height;
    $(".navbar").after(myImage);
}

function generateHTML() {
    var header = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Photo Embellisher</title><link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"><link rel=stylesheet type=text/css href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"}}"><link rel=stylesheet type=text/css href="style.css" }}"></head>';
    var footer = '<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script><script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" }}"></script><script type="text/javascript" src="script.js" }}"></script>';
    var html = header + "<body>" + myImage.outerHTML + "<canvas id='myCanvas'></body>" + footer + "</body>";
    return html;
}

var zip = new JSZip();

function downloadZip(data = null) {
    zip.file("index.html", generateHTML());

    zip.generateAsync({ type: "blob" })
        .then(function(blob) {
            console.log("Saving as zip");
            saveAs(blob, "photo-embellish.zip");
        });
}

function sendData() {
    var clickXString = "clickX = [" + clickX.toString() + "];";
    var clickYString = "clickY = [" + clickY.toString() + "];";
    var clickDragString = "clickDrag = [" + clickDrag.toString() + "];";
    var colorsString = "colors = ['" + colors.join("','") + "'];";
    var strokeWidthString = "strokeWidth = [" + strokeWidth.toString() + "];";
    var opacityString = "opacity = [" + opacity.toString() + "];";
    var simultaneousAnimString = "simultaneousAnim = " + JSON.stringify(simultaneousAnim) + ";";
    var used_animationsString = "used_animations = [" + used_animations.toString() + "];";

    var allVars = clickXString + clickYString + clickDragString + colorsString + strokeWidthString + opacityString + simultaneousAnimString + used_animationsString;
    getCode("js", allVars, function() {
        getCode("css", "", function() {
            downloadZip();
        });
    });
}


function getCode(file_type = "js", variables = "", callback = null) {
    file_type == "js" ? filepath = "/static/js/user.js" : filepath = "/static/css/style.css";
    file_type == "js" ? new_file = "script.js" : new_file = "style.css";
    console.log("filepath: " + filepath);
    $.get(filepath, function(data) {
        console.log(data);
        var code = variables + data;
        var dat = {};
        dat[file_type] = code;
        console.log(dat);
        $.ajax({
            type: 'POST',
            url: '/minify',
            data: JSON.stringify(dat),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(msg, status, jqXHR) {
                console.log("msg: ");
                console.log(msg);
                data = msg["result"][file_type];
                console.log("get result")
                console.log(data);
                zip.file(new_file, data);
                if (callback) {
                    callback();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(textStatus, errorThrown);
            }
        });
    });

}


var currentZoom = 1;
$("#zoomIn").click(function() {
    currentZoom += 0.1;
    $('#myImage, #myCanvas').css({
        zoom: currentZoom,
        '-moz-transform': 'scale(' + currentZoom + ')'
    });
});

var currentZoom = 1;
$("#zoomOut").click(function() {
    currentZoom -= 0.1;
    $('#myImage, #myCanvas').css({
        zoom: currentZoom,
        '-moz-transform': 'scale(' + currentZoom + ')'
    });
});

$("#animate").click(function() {
    animate();
});

$(function() {
    $('#cp2').colorpicker();
    //console.log($('#cp2').colorpicker('getValue'));
});

/* ------------- Side nav bar -------------- */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

function useMouse(){
    onMouse = !onMouse;
}