function sidebar() {
    model = document.createElement("div")
    model.id = "sx_model"
    model.classList = `ui modal overlay fullscreen ${document.location.host.includes('saral') ? "saralbox" : "chatbox"}`
    model.innerHTML = `<div class="ui header"> <img class='ui centered image' src=${chrome.runtime.getURL("docs/images/logobig.svg")}></img>
    <div style="float: right;font-size: 1.3rem;" class="ui orange large basic button">What's New ?</div>
    </div><div class="content"></div>`;
    document.querySelector('body').appendChild(model)
    document.querySelector('#sx_model .header .orange.button').addEventListener('click', () => whatsNewCheck(false))
}

function refresh() {
    log.log("refersh start")
    $('#sx_model').remove();
    sleep(50)
    document.querySelector("#sx_float").dispatchEvent(new Event('click'));
    $('.menu .item').tab();
    log.log("refersh Ends")
    return true
}
function start() {
    // float button
    floatsxbutton = document.createElement("div")
    floatsxbutton.id = "sx_float";
    floatsxbutton.classList = "float loading"
    floatsxbutton.innerHTML = `<img class='ui rounded centered image' width="40" src=${chrome.runtime.getURL("docs/images/icon.svg")}></img>`
    document.querySelector('body').appendChild(floatsxbutton)
    $('#sx_float').on('click', () => {
        $('#sx_model').remove();
        sidebar();
        $('#sx_model').modal({
            closable: false,
            content: `<div class="ui active dimmer"><div class="ui massive text loader">Please Wait, While we fetch Exam Details</div>`,
            actions: [
                { text: 'Import', class: 'blue', click: () => { web_import(); return false } },
                { text: 'Export', class: 'blue', click: () => { web_export(); return false } },
                { text: 'Refresh', class: 'green', click: () => { refresh() } },
                { text: 'Save All', icon: 'exclamation', class: 'red', click: () => { web_save(); return false } },
                { text: 'Close', class: 'black' }]
        }).modal('show');
        // loading init values
        sleep(100).then(() => configuration())
    });
}
start()
whatsNewCheck()