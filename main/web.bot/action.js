function web_import() {
    filename = []
    document.querySelectorAll('#sx_model div.ui.tab.segment.active span:nth-child(1) .detail').forEach(e => filename.push(e.innerText))
    const closeButton = document.querySelector("dialog button");
    dialog = document.querySelector("dialog");
    dialog.showModal();
    closeButton.addEventListener("click", () => {
        dialog.close();
    });
    const Approvebtn = document.querySelector("dialog button.green");
    Approvebtn.addEventListener("click", () => {
        file_input(localStorage.activeimport)
        dialog.close();
    });

}

//pending
function file_input(varinput) {
    listraw = varinput.split("\n").slice(1)
    for (const iterator of listraw) {
        classlist = iterator.split(",").slice(0, 4)
        if (classlist.length > 0) { continue }
        marks = iterator.split(",").slice(4).slice(0, iterator.split(",").length - 5)
        total = 0;
        marks.forEach(e => total += parseInt(e))
        cell = document.querySelector(`#sx_model .active table tr[class= ${classlist[2]}']`)
        if (cell) {
            var cell_count = 0
            cell.querySelector('.checkbox input').checked = classList[4] === "P" ? true : false;
            for (var iter = 0; iter < cell.children.length; iter++) {
                if (cell.children[iter].lastChild.nodeType === 1) {
                    cell.children[iter].lastChild.lastChild.value = marks[cell_count]
                    cell_count++;
                }
            }
            cell.children[cell.childElementCount - 1].innerText = total
        }
    }
    console.log('import is completed')
    return 1
}

function web_export(x = 0) {
    // Getting values of current time for generating the file name
    const dateTime = new Date();
    const postfix = `${dateTime.getDate()}.${dateTime.getMonth() + 1}.${dateTime.getFullYear()}_${dateTime.getHours()}.${dateTime.getMinutes()}`;

    filename = []
    document.querySelectorAll('#sx_model div.ui.tab.segment.active span:nth-child(1) .detail').forEach(e => filename.push(e.innerText))

    let tablecsv = "";
    raw = document.querySelectorAll('#sx_model > div.content > div.ui.tab.segment.active table tr')
    for (const cell of raw) {
        cell_count = 1
        for (const iterator of cell.children) {
            mark = ""
            tablecsv += cell_count == 3 ? "'" : ""
            if (iterator.lastChild.nodeType === 1) {
                if (iterator.lastChild.classList.contains('checkbox')) {
                    tablecsv += `${iterator.lastChild.childNodes[0].checked ? "P" : "A"},`
                }
                else if (iterator.lastChild.classList.contains('button')) {
                    tablecsv += ","
                }
                else {
                    tablecsv += iterator.lastChild.lastChild.value + ","
                }

            }
            else if (iterator.lastChild.nodeType === 3) {
                tablecsv += iterator.innerText + ","
            }
            cell_count += 1
        }
        tablecsv = tablecsv.slice(0, tablecsv.lastIndexOf(','))//, tablecsv.lastIndexOf(',')))
        tablecsv = tablecsv.slice(0, tablecsv.lastIndexOf(','))//, tablecsv.lastIndexOf(',')))
        tablecsv += "\n"
    }
    console.log("exporting ", filename)
    tablecsv = tablecsv.replace("'", "")
    if (x === 0) {
        // csv downlaod
        const blob = new Blob([tablecsv],
            { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename.join("_")}_${postfix}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    return tablecsv
}

function web_save(id = '#progressbar') {
    data_btn = document.querySelectorAll('#sx_model div.ui.tab.segment.active tr.blue .button:not(.disabled),#sx_model div.ui.tab.segment.active tr.red .button:not(.disabled)')
    if (data_btn.length === 0) {
        sucesstoast("NO DATA FOUND", "", 0)
        return
    }
    // progressbar = document.querySelector(id)
    // progressbar.style.display = 'block'
    // progressbar.setAttribute("data-value", 0)
    // progressbar.setAttribute("data-total", x.length)
    // $(id).progress({ label: 'ratio', text: { ratio: '{value}' } })
    function myLoop() {
        data_btn = document.querySelectorAll('#sx_model div.ui.tab.segment.active tr.blue .button:not(.disabled),#sx_model div.ui.tab.segment.active tr.red .button:not(.disabled)')
        timeout = 500        //  create a loop function
        setTimeout(function () {   //  call a 3s setTimeout when the loop is called
            data_btn[0].dispatchEvent(new Event('click'))
            // $(id).progress('increment')
            // document.querySelector('#Progressbar .label').innerText = `${i} out of 30`                    //  increment the counter
            if (data_btn.length !== 0) {           //  if the counter < 10, call the loop function
                myLoop();             //  ..  again which will trigger another 
            }
        }, timeout)    //  ..  setTimeout()
    }
    myLoop();
}

function errortoast(i) {
    $.toast({
        title: student[i].studentName,
        message: student[i].studentId + " Error",
        displayTime: 0,
        closeIcon: true,
        class: "red"
    })
}
function sucesstoast(title, i, timeout) {
    $.toast({
        title: title,
        message: i,
        showProgress: 'bottom',
        classProgress: 'green',
        transition: {
            showMethod: 'zoom',
            showDuration: timeout,
            hideMethod: 'fade',
            hideDuration: timeout / 2
        }
    })
}