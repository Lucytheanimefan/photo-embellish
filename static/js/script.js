//get uploaded photo
$("input").change(function(e) {

    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

        var file = e.originalEvent.srcElement.files[i];

        var img = document.createElement("img");
        img.id = "myImage";
        var reader = new FileReader();
        reader.onloadend = function() {
            img.src = reader.result;
            var canvas = document.getElementById("myCanvas");
            console.log("Set canvas width to: " + $("#myImage").width())
            canvas.width = $("#myImage").width();
            canvas.height = $("#myImage").height();
        }
        reader.readAsDataURL(file);
        $("input").after(img);
    }
});
