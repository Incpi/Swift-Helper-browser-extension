function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
function find_obj_value(obj, fkey, key, returnval) {
    result = obj.find((find) => find[fkey] === key)
    return result ? result[returnval] : ""
}

function outputFileContents(id) {
    file = document.querySelector(`#${id} input`).files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.addEventListener("load", () => {
        localStorage.setItem(id, reader.result)
    })
    document.querySelector(`#${id} input`).nextElementSibling.classList.replace('blue', "green")
    return file.name.substring(0, 10)
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

function posthttp(url, body, header = []) {
    console.log(url, body, header)
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    if (header != [] || header !== null) {
        for (i = 0; i < header.length; i++) { xhr.setRequestHeader(header[i].split(",")[0], header[i].split(",")[1]) }
    }
    xhr.onload = () => {
        if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
            console.log(`Safe: ${xhr.status}`);
        }
        else {
            console.log(`Error: ${xhr.status}`);
        }
    };
    xhr.send(body);
    return xhr.responseText
}