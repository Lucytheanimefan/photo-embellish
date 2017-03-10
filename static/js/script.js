var BASE_URL = "https://photo-embellish.herokuapp.com"

//get uploaded photo
$("#fileChooser").change(function(e) {
    console.log(e.originalEvent.srcElement.files[0]);
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


function generateHTML() {
    var header = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Photo Embellisher</title><link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"><link rel=stylesheet type=text/css href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"}}"><link rel=stylesheet type=text/css href="style.css" }}"></head>';
    var footer = '<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script><script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" }}"></script><script type="text/javascript" src="script.js" }}"></script>';
    var html = header + "<body>" + myImage.outerHTML + "<canvas id='myCanvas'></body>" + footer + "</body>"; //NEED TO SET SIZE OF CANVAS!
    //console.log(html);
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
        getCode("css", "" ,function() {
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
        var dat = { };
        dat[file_type]= code;
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
