function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
function find_obj_value(obj, fkey, key, returnval) {
    result = obj.find((find) => find[fkey] === key)
    return result ? result[returnval] : ""
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function posthttp(url, body, header = [], datamessage = null) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    if (header != [] || header !== null) {
        for (i = 0; i < header.length; i++) { xhr.setRequestHeader(header[i].split(",")[0], header[i].split(",")[1]) }
    }
    xhr.onload = () => {
        if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) { datamessage === null ? log.log(`Safe: ${xhr.status}`) : successDataSave(datamessage) }
        else {datamessage === null ? log.log(`Error: ${xhr.status}`) : errorDataSave(datamessage,xhr.status) }
    };
    xhr.send(body);
    return xhr.responseText
}

async function storageGetPromise(name) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([name], function (result) {
            resolve(result[name]);
        });
    })
}

async function storageSetPromise(obj) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(obj, function (result) {
            resolve("OK");
        });
    })
}