function pc() {
    x = `<div class='ui segment '><pre>

Notice:  As Xamta is under new updates. we will wait for those update. then update this section with latest changes. 

This is under development. Thank you for understanding. 
<hr>

This extension will help you to enter marks with ease.

Step 1.  
Install the extension
    op1: use store and get it from there.
    op2: download from GitHub and use directly.

Step 2. 
Once you enable this extension, you will get float button at right bottom corner. with greyscale icon simillar to extension page icon. and once you hover over it you will get orange icon theme color option.
<img class='ui rounded centered image' src='Snapshots/floatbutton.png' style="width:200px" ></img>
Step 3.
click on this extension  it will open a popup which contains data to enter marks.
if your page is has no data of any exam, nothing wrong here. <img class='ui rounded centered image' src='Snapshots/homepage.png'></img> It's because we didn't setup anything yet. enter your relevant information in Xamta bot similar what we do in mobile.
 
<img class='ui rounded centered image' src='Snapshots/blank.png'></img>
once you select exam and subject in chat bot.
you will get data with your details.
verify and correct if needed in chatbot.

Step 4. 
All the data on screen is visible.
you can see students name there id's, make them present or absent for this exam.
<img cla5.  
Entess='ui rounded centered image' src='Snapshots/exam_snapshot1.png'></img>
step r mark questionwise. if you enter mark raw color will change it to blue. then at the end of same raw. click on save. it will save data. once data is save button will be disabled.
if it fails you can also retry.
<img class='ui rounded centered image' src='Snapshots/markentryblue.png'></img>
Step 6. 
if you enter marks for multiple students. then all blue raws will be got save by save all button at bottom
</pre>
<div class="ui header">States by Color</div>
<div class="ui fluid tertiary buttons">
      <button class="ui red button">Error</button>
      <button class="ui yellow button">Warning</button>
      <button class="ui green button">Success</button>
      <button class="ui blue button">Ready</button>
    </div>
</div>`
    document.querySelector('#pc').innerHTML = x
}

function genimgloop() {
    let x = "";
    let i = 1
    while (i <= 28) {
        x += `<img class='ui rounded centered image' src='mobile/XAMTA Tutorial-${i}.webp' class='ui fluid inage'></img>`;
        i++
    }
    document.querySelector('#imgloop').innerHTML = x
}

function how2() {
    x = `<pre >
   Step 1 - download a zip file with the extension
   If you already have downloaded a file with the plugin - skip this step.

   If you don't have a file, but have a link to a github repository - follow the link, then click the big green "Clone or download" button, then click Download ZIP.

   Step 2 - extract the contents of the zip file
   Right click on the downloaded zip file, then click "Extract Here".

   Step 3 - open the extension page in google chrome
   There are several ways todo that.

   Option 1: type chrome://extensions in the url bar and press enter.

   Option 2: click on the tree dots in the top right of the browser, then click "More tools" then click "Extensions".

   Step 4 - activate developer mode
   Turn on the switch on the top right of the page that says "Developer mode";

   Step 5 - load unpacked extension
   Click on the button on the top left of the page that says "Load unpacked".

   Then select a folder that contains the manifest.json file.
</pre>`

    document.querySelector('#h2use').innerHTML = x
}

function init() {
    how2()
    genimgloop()
    pc()
    $('.menu a:not([href]).item').tab()
}
init()