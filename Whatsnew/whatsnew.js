async function whatsNewCheck(showOnlyOnce = true) {
    var manifestVersion = chrome.runtime.getManifest().version;
    check = await storageGetPromise("WN_V" + manifestVersion);
    if (!check || showOnlyOnce == false) {
        $("#WN_V").remove();
        const Content = `
        <div class="ui positive message">
            <div class="header content">You updated successfully to Version: ${manifestVersion}</div>
            <p>Just started ? go at <a href="https://incpi.github.io/Swift-Helper-browser-extension/" target="_blank">Details
                    Page</a> for updates and news.</p>
        </div>
        <div class="ui segment">
            <div class="ui top secondary pointing equal orange width menu">
                <a class="item active" data-tab="two">Features</a>
                <a class="item" data-tab="three">About</a>
            </div>
            <div class="ui segment"><div class="ui relaxed list">
                <div class="item">
                    <div class="content">
                        <span class="ui medium header">${manifestVersion}</span>
                        <ul>
                            <li>[BugFix] BugFix and Go Live on Chrome Store.</li><br>
                        </ul>
                    </div>
                </div>
            </div></div>
            <div class="ui tab segment" data-tab="two">
                <h3 class="ui header">
                    <div class="content">
                        Main Features
                    </div>
                </h3>
                <div class="ui bulleted list">
                    <a class="item">
                        <div class="content">
                            <div class="description">Populating for quick Checkups</div>
                        </div>
                    </a>
                    <a class="item">
                        <div class="content">
                            <div class="description">Tabular format for quick Inputs/Changes</div>
                        </div>
                    </a>
                    <a class="item">
                        <div class="content">
                            <div class="description">Import - Export Exam Files</div>
                        </div>
                    </a>
                </div>
                <p>Unfortunately, SwiftChat Organization does not work with us together and does not inform us when the APIs change. So be gentle if tool does not work. We do this in our free time and sometimes it takes a while to adapt to NEW changes.</p>
            </div>
            <div class="ui tab segment active" data-tab="three">
                <h3 class="ui header">
                    <div class="content">
                        About us
                    </div>
                </h3>
                <div class="ui relaxed divided list">
                    <div class="item">
                        <div class="content">
                            <span class="header">This plugin is developed by
                            <a href="https://www.linkedin.com/in/omiswave/" target="_blank" class=" ui blue horizontal large label">linkedin (Omkar)</a></span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="content">
                            <span class="header">Feel free to contribute on our
                            <a href="https://github.com/incpi/Swift-Helper-browser-extension" target="_blank" class=" ui purple horizontal large label">Github</a></span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="content">
                            <span class="header">License: *we are not responsible for the content of external links
                            <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank" class=" ui orange horizontal large label">GNU GPL v3</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        var textElement = $("<div>").html(`<div class="ui header">
            <img class='ui centered image' src=${chrome.runtime.getURL("docs/images/logobig.svg")}></img>
            <div style="float: right;font-size: 1.3rem;" class="ui orange large basic text">Version: ${manifestVersion}</div>
        </div><div class="scrolling content">${Content}</div>`).addClass("ui fullscreen modal").attr("id", "WN_V");
        $("body").append(textElement);
        $("#WN_V").modal({
            blurring: true,
            allowMultiple: true,
            scrollbarWidth: 20,
            actions: [{ text: 'Close', class: 'black' }]
        }).modal('show');
        $('.menu .item').tab();
        var obj = {};
        obj["WN_V" + manifestVersion] = "show";
        chrome.storage.local.set(obj, function () {
            log.log("whats new displayed and saved");
        });
        return true;
    }
    return false;
}