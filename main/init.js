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

function init_export(host) {
    // host ? saral_export() : 
    log.log(web_export())
}
function init_import(host) {
    // host ? saral_import() : 
    web_import()
}
function init_save(host) {
    log.log("save host")
    // host ? saral_save() : 
    web_save()
}
function refresh(host) {
    $('#sx_model').remove();
    document.querySelector("#sx_float").dispatchEvent(new Event('click'))
    $('.menu .item').tab();
}
function start() {
    // float button
    floatsxbutton = document.createElement("div")
    floatsxbutton.id = "sx_float";
    floatsxbutton.classList = "float loading"
    floatsxbutton.innerHTML = `<img class='ui rounded centered image' width="40" src=${chrome.runtime.getURL("docs/images/icon.svg")}></img>`
    document.querySelector('body').appendChild(floatsxbutton)
    $('#sx_float').on('click', () => {
        const host = document.location.hostname.includes('saral');
        $('#sx_model').remove();
        sidebar();
        $('#sx_model').modal({
            closable: false,
            content: `<div class="ui active dimmer"><div class="ui massive text loader">Please Wait, While we fetch Exam Details</div>`,
            actions: [
                { text: 'Import', class: 'blue', click: () => { init_import(host); return false } },
                { text: 'Export', class: 'blue', click: () => { init_export(host); return false } },
                { text: 'Refresh', class: 'green', click: () => { refresh(host); return false } },
                { text: 'Save All', icon: 'exclamation', class: 'red', click: () => { init_save(host); return false } },
                { text: 'Close', class: 'black' }]
        }).modal('show');
        // loading init values
        sleep(100).then(() => configuration())
    });
}
start()
whatsNewCheck()