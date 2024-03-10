function sidebar() {
    var model = $("<div>").attr("id", "sx_model").addClass(`ui modal overlay fullscreen ${document.location.host.includes('saral') ? "saralbox" : "chatbox"}`).html(`<div class="ui header"> <img class='ui centered image' src=${chrome.runtime.getURL("docs/images/logobig.svg")}></img>
    <div style="float: right;font-size: 1.3rem;" class="ui orange large basic button">What's New ?</div>
    </div><div class="content"></div>`);
    $('body').append(model);
    $('#sx_model .header .orange.button').on('click', function () {
        whatsNewCheck(false);
    });
}

function refresh() {
    console.log("refresh start");
    $('#sx_model').remove();
    setTimeout(function () {
        $("#sx_float").trigger("click");
        $('.menu .item').tab();
        console.log("refresh Ends");
    }, 50);
    return true;
}

function start() {
    // Float button
    var floatsxbutton = $("<div>")
        .attr("id", "sx_float")
        .addClass("float loading")
        .html(`<img class='ui rounded centered image' width="40" src=${chrome.runtime.getURL("docs/images/icon.svg")}></img>`);
    $("body").append(floatsxbutton);

    $('#sx_float').on('click', function () {
        $('#sx_model').remove();
        sidebar();
        $('#sx_model').modal({
            closable: false,
            content: `<div class="ui active dimmer"><div class="ui massive text loader">Please Wait, While we fetch Exam Details</div></div>`,
            actions: [
                { text: 'Import', class: 'blue', click: function () { web_import(); return false; } },
                { text: 'Export', class: 'blue', click: function () { web_export(); return false; } },
                { text: 'Refresh', class: 'green', click: function () { refresh(); } },
                { text: 'Save All', icon: 'exclamation', class: 'red', click: function () { web_save(); return false; } },
                { text: 'Close', class: 'black' }]
        }).modal('show');

        // Loading initial values
        sleep(100).then(function () {
            configuration();
        });
    });
}

start()
whatsNewCheck()