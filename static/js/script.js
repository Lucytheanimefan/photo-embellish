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
            myImage.id = 'htmlImage'

        }
        reader.readAsDataURL(file);
        $(".navbar").after(img);
    }
});

function downloadHTML() {
    download("index.html", generateHTML());
}

function generateHTML() {
    var header = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Photo Embellisher</title><link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"><link rel=stylesheet type=text/css href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"}}"><link rel=stylesheet type=text/css href="style.css" }}"></head>';
    var footer = '<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script><script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" }}"></script><script type="text/javascript" src="script.js" }}"></script>';
    var html = header + "<body>" + myImage.outerHTML + "<canvas id='myCanvas'></body>" + footer + "</body>"; //NEED TO SET SIZE OF CANVAS!
    //console.log(html);
    return html;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
var zip;

function downloadZip(data) {
    zip = new JSZip();
    zip.file("index.html", generateHTML());
    zip.file("script.js", data["js"]);
    zip.file("style.css", data["css"]);
    zip.generateAsync({ type: "blob" })
        .then(function(blob) {
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

    $.ajax({
        type: 'POST',
        url: '/record_values',
        data: clickXString + clickYString + clickDragString + colorsString + strokeWidthString + opacityString,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function(msg, status, jqXHR) {
            console.log(msg);
            updateFiles();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus, errorThrown);
        }
    });

}

function updateFiles() {
    $.ajax({
        type: 'GET',
        url: '/create_files',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function(response, status, jqXHR) {
            var json = JSON.stringify(eval("(" + response + ")"));
            console.log(json)
            var data = eval("(" + json + ")");
            data = data["result"];
            console.log(data);
            downloadZip(data);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus, errorThrown);
        }
    });
}
/*
function saveTextFromPage() {
    $.get("/js.txt", function(data) {
        zip.file("script.js", data);
        $.get("/css.txt", function(data) {
            zip.file("style.css", data);
            zip.generateAsync({ type: "blob" })
                .then(function(blob) {
                    saveAs(blob, "photo-embellish.zip");
                });
        });
    });
}*/

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
