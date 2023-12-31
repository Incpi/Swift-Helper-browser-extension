function web_import() {
    prev = document.querySelector(`#activeimportcontain`)
    prev ? prev.remove() : "";
    var textElement = document.createElement('div')
    textElement.innerHTML = `<div class="ui header">Import Exam Data</div>
        <div class="content"><div class="ui file input action"><input accept=".csv,.txt" id="activeimport" type="file"><label for="activeimport" data-variation="blue"  data-tooltip="Import File for Currently visible Exam table" data-position="top center" class="ui blue button">File for active Exam</label></div></div>`
    textElement.classList = "ui fullscreen modal"
    textElement.id = `activeimportcontain`
    document.body.appendChild(textElement);
    $('#activeimportcontain').modal({
        blurring: true,
        allowMultiple: true,
        actions: [{ text: 'Close', class: 'black' }]
    }).modal('show');
    let getdata;
    document.querySelector(`#activeimport`).addEventListener('input', () => {
        file = document.querySelector(`#activeimport`).files[0];
        const reader = new FileReader()
        try {
            reader.readAsText(file)
            reader.addEventListener("load", () => {
                getdata = reader.result
                if (getdata !== "") { file_input(getdata); successToast(file.name.substring(0, 10), "Imported Successful", 3000) }
                else { errorToast("Select file", "No data found", 3000) }
            })
            document.querySelector(`#activeimport`).nextElementSibling.classList.replace('blue', "green")
        }
        catch {
            document.querySelector(`#activeimport`).nextElementSibling.classList.replace('blue', "red")
        }
        $('#activeimportcontain').modal('hide');
    });
}

//pending
function file_input(varinput) {
    listraw = varinput.split("\n").slice(1)
    for (const iterator of listraw) {
        classlist = iterator.split(",").slice(0, 4)
        if (classlist.length < 4) { continue }
        marks = iterator.split(",").slice(4).slice(0, iterator.split(",").length - 5)
        total = 0;
        marks.forEach(e => total += parseInt(e))
        cell = document.querySelector(`#sx_model .active table tr[sid= ${classlist[2]}']`)
        if (cell) {
            var cell_count = 0
            cell.querySelector('.checkbox input').checked = classlist[3] === "P" ? true : false;
            for (var iter = 4; iter < cell.children.length - 2; iter++) {
                if (cell.children[iter].lastChild.nodeType === 1) {
                    cell.children[iter].lastChild.lastChild.value = marks[cell_count]
                    cell_count++;
                }
            }
            cell.dispatchEvent(new Event('change'))
        }
    }
    log.log('import is completed')
    return 1
}

function web_export(x = 0) {    // Getting values of current time for generating the file name
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
    log.log("exporting ", filename)
    tablecsv = tablecsv.replace("'", "")
    if (x === 0 && tablecsv != "") {        // csv downlaod
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
    successToast("Exported", "SuccessFul", 3000)
    return tablecsv
}

function web_save(id = '#progressbar') {
    data_btn = document.querySelectorAll('#sx_model div.ui.tab.segment.active tr.blue .button:not(.disabled),#sx_model div.ui.tab.segment.active tr.red .button:not(.disabled)')
    if (data_btn.length === 0) {
        successToast("NO DATA FOUND", "", 0)
        return
    }
    function myLoop() {
        data_btn = document.querySelectorAll('#sx_model div.ui.tab.segment.active tr.blue .button:not(.disabled),#sx_model div.ui.tab.segment.active tr.red .button:not(.disabled)')
        timeout = 500
        setTimeout(function () {
            data_btn[0].dispatchEvent(new Event('click'))
            if (data_btn.length !== 0) {
                myLoop();
            }
        }, timeout)
    }
    myLoop();
}

function successDataSave(e) {
    btn = e.querySelector(`.button`);
    btn.classList.add('green')
    e.classList.contains('blue') || e.classList.contains('red') ? e.classList.remove('blue', 'red') : ""
    e.classList.add('green')
    btn.classList.contains('disabled') ? "" : btn.classList.add(`disabled`)
    log.log(e.children[1].innerText, e.children[2].innerText + " saved")
    successToast(e.children[1].innerText, e.children[2].innerText + " saved", 2000);
}

function errorDataSave(btn, e, status) {
    btn = e.querySelector(`.button`);
    btn.classList.contains('red') ? "" : btn.classList.add(`red`)
    log.log(e.children[1].innerText + e.children[2].innerText, " Error Occurred" + status)
    errorToast(e.children[1].innerText + e.children[2].innerText, " Error Occurred" + status, 6000);
}

function errorToast(title, i, timeout) {
    $.toast({
        title: title,
        message: `${i} Error`,
        showProgress: 'bottom',
        classProgress: 'black',
        showIcon: true,
        class: 'red',
        displayTime: timeout,
        transition: {
            closeEasing: 'easeOutBounce'
        }
    })
}
function successToast(title, i, timeout) {
    $.toast({
        title: title,
        message: i,
        showProgress: 'bottom',
        classProgress: 'green',
        transition: {
            showMethod: 'zoom',
            showDuration: timeout,
            hideMethod: 'fade',
            hideDuration: timeout / 2,
            closeEasing: 'easeOutBounce'
        }
    })
}