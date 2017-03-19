var effectMap = { "breakGlass": function() { breakGlassHTML() }, "waterRipple": null }
var jsPath = "/static/js/effects/";

function useEffect(effectType) {
    console.log("useEffect called");
    effectMap[effectType]();
    appendScript(jsPath + effectType + ".js");
}

function appendScript(src) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
}


function breakGlassHTML() {
    console.log("insert before!");
    $("#main").append('<div class="wrapper">' +
        '<img class="bg-image main animated" src="" alt="">' +
        '<div class="drawing ui-corner-all animated">' +
        '<canvas id="draw-refract"></canvas>' +
        '<canvas id="draw-reflect"></canvas>' +
        '<canvas id="draw-fractures"></canvas>' +
        '<canvas id="draw-mainline"></canvas>' +
        '<canvas id="draw-noise"></canvas>' +
        '<canvas id="draw-debug" style="display: none;"></canvas>' +
        '<div id="draw-picker"></div>' +
        '</div></div>');
    var width = $("#myImage").width() + "px";
    var height = $("#myImage").height() + "px";
    $(".bg-image").css({
        display: "block",
        position: "absolute",
        width: width,
        height: height
    });
    $("#draw-picker").css({
        top: "0px",
        position: "absolute",
        width: width,
        height: height
    });

    $(".wrapper").css({
        top: "0px",
        position: "absolute",
        border: "none",
        "z-index": "-1"
    });

    $(document).click(function(e) {
        $('#draw-picker').trigger(e);
    });
}
