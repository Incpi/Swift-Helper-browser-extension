function sxinfonode(config) {
    var div = `<div class="ui horizontal divider header">Links</div>
        <div class="ui fluid buttons">
            <a class="ui black basic button" target="_blank" href="${config.sglink}"> SARALGUJARAT</a>
            <a class="ui black basic button" target="_blank" href="${config.sclink}"> SWIFTCHAT LITE</a>
            <a class="ui black basic button" target="_blank" href="${config.help}">HELP</a>
        </div>
        <p class="ui horizontal divider header">About</p>
        <div class="ui relaxed divided list">
            <div class="item">
                <div class="content">
                    <span class="header">This plugin is developed by
                    <a href="${config.linkedin}" target="_blank" class="tertiary ui blue button"><i class="linkedin icon"></i>linkedin (${config.author})</a></span>
                </div>
            </div>
            <div class="item">
                <div class="content">
                    <span class="header">Feel free to contribute on our
                    <a href="${config.github}" target="_blank" class="tertiary ui purple button"><i class="github icon"></i>Github</a></span>
                </div>
            </div>
            <div class="item">
                <div class="content">
                    <span class="header">License: *we are not responsible for the content of external links
                    <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank" class="tertiary ui orange button"><i class="award icon"></i>GNU GPL v3</a></span>
                </div>
            </div>
        </div>
    </div>`
    document.querySelector('#sxinfo').innerHTML = div
    //<iframe id='kofiframe' src='https://ko-fi.com/omiswave/?hidefeed=true&widget=true&embed=true&preview=true' style='border:none;width:100%;padding:4px;background:#f9f9f9;' height='712' title='omiswave'></iframe>
}

    // const setlang = String(localStorage.getItem('sxlang'))
    // div = createElementFromHTML('<div id="sx_lang" className="ui buttons"></div>')
    // div.innerHTML = `<span data="false" class="ui toggle fluid button ${setlang !== 'true' ? 'active' : ''}">English</span><span data="true" class="ui toggle fluid button ${setlang === 'true' ? 'active' : ''}">Gujarati</span>`
    // document.querySelector('#sxhelp').innerHTML = '<span className="ui large label">Translate </span>';
    // document.querySelector('#sxhelp').append(div)
    // document.querySelector('#sx_lang').addEventListener('click', () => {
    //     document.querySelectorAll('#sx_lang>*').forEach(e => e.classList.toggle('active'))
    //     localStorage.setItem('sxlang', document.querySelector('#sx_lang>.active').getAttribute('data') === "true")
    // })
    /*
function sxsetting(config) {
    st = [{ label: "Zoom of SWIFT CHAT (in %)", min: 80, max: 120, id: "setchatzoom" }]//{label: "Zoom of saralgujarat (in %)", min: 80, max: 120, id: "setsaralzoom" }
    st.forEach(e => {
        div = createElementFromHTML(`<div class="ui labeled input"><div class="ui label">${e.label}</div><input type="number" min=${e.min} max=${e.max} name="${e.id}" id="${e.id}"></div><br />`)
        document.querySelector('#sxset').append(div)
        chrome.storage.sync.get([e.id], function (result) {
            document.getElementById(e.id).value = parseInt(result[e.id])
        });
        document.getElementById(e.id).addEventListener('change', () => {
            chrome.storage.sync.set(JSON.parse(`{"${e.id}":"${document.getElementById(e.id).value}"}`), function () {
                log.log('Value is set to' + e.id + ":" + document.getElementById(e.id).value)
            });
        })
    })
}*/
function checkUpdate() {
    document.querySelectorAll(".version").forEach(e => e.innerHTML += chrome.runtime.getManifest().version);
}
async function main() {
    const config = {
        sglink: "https://www.saralgujarat.in/",
        sclink: "https://web.convegenius.ai/",
        linkedin: "https://www.linkedin.com/in/omiswave/",
        github: "https://github.com/incpi/Swift-Helper-browser-extension",
        author: "Omkar",
      "help": "https://incpi.github.io/Swift-Helper-browser-extension"
    }
    checkUpdate();
    sxinfonode(config);
    // sxsetting(config);
}

main().catch(e => console.error(e))

// Activate tab on hover
$('.top div.item').on('mouseenter', function () {
    $(this).tab('change tab', $(this).attr('id'));
});

// Initialize tabs
$('.top div.item').tab();
$('.ui.dropdown').dropdown('show');
