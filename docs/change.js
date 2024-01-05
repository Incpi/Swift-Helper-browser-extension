import object from './readme.json' assert { type: 'json' };
let readme = '<h2 class="ui big horizontal divider">Change logs</h2><div class="ui relaxed list">'
for (const key of object) {
    readme += `<div class="item"><i class="large github top aligned icon"></i><div class="content"><a class="ui medium header">${key.version}</a><ul> `
    for (const iter of key.text) {
        readme += `<li>${iter}</li>`
    }
    readme += `</ul></div></div>`
}

readme += '</div>'
let changelog = `<h2 class="ui  big horizontal divider">Contributing</h2>
<div class=" ui description">I am looking forward to collaborating with the community on this project and I appreciate any contributions and feedback.
 Before making any significant changes, please create an issue to discuss yr proposal and rationale. 
 This is my first attempt at an Open Source project, 
 so I welcome any suggestions on how to improve the code quality, architecture and project management. 
<br>
Working on your first Pull Request? You can learn how from this free series How to <a href="https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github"> Contribute to an Open Source Project on GitHub<a></div>`

let container = `<div class="ui segment">${readme}</div><div class="ui segment">${changelog}</div>`

document.querySelector('#readme').innerHTML = container