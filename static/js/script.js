//get uploaded photo
$("#fileChooser").change(function(e) {

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

        }
        reader.readAsDataURL(file);
        $(".navbar").after(img);
    }
});

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
    currentZoom += 0.1;
    $('#myImage, #myCanvas').css({
        zoom: currentZoom,
        '-moz-transform': 'scale(' + currentZoom + ')'
    });
});

$("#animate").click(function() {
    animate();
})

$(function() {
    $('#cp2').colorpicker();
    console.log($('#cp2').colorpicker('getValue'));
});
