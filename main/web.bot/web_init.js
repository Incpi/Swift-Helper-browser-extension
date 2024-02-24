function lastbotmsg() {
    var msg = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-messages', `{"bot_uuid":"0296339483100153","direction":"backward"}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]))

    let payload = [];
    function load(payload, msg = msg.messages) {
        log.log(msg)
        for (i = 0; i < msg.length; i++) {
            if (msg[i].type === 'article') {
                const x = msg[i].article[0].actions[0].website.payload.replaceAll("\'", "\"")
                if (!payload.includes(x)) { payload.push(x) }
            }
        }
        return payload
    }
    tokendata = JSON.stringify(msg.next_token)
    payload = load(payload, msg.messages)
    // i = 0
    // while (payload.length < 3 || i <= 3) {
    var msg_u = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-messages', `{"bot_uuid":"0296339483100153","direction":"backward","next_token":${tokendata}}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]))
    payload = load(payload, msg_u.messages)
    tokendata = JSON.stringify(msg_u.next_token)
    //     i++
    // }
    return payload
}
function GetTeacherData(lastmsglist, teacherDetails) {

    // data = `<button class="ui secondary fluid  button"><i class="icon double fan loading"></i>Loading</button>`;
    // container.innerHTML += data;
    get_bot_static = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-bot-user-details', `{"bot_uuid":"0296339483100153"}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]))
    div = document.createElement('div')
    div.classList = "ui menu segment"
    segement = `<span class="ui item small header">Teacher Details</span>`
    for (i in lastmsglist) {
        if (Object.keys(teacherDetails).includes(i)) {
            segement += `<a class="ui active item large basic label">${teacherDetails[i]}<div class="detail">${lastmsglist[i]}</div> </a>`
        }
    }
    segement += `
    <a class="ui right item image label"><img class='ui rounded centered image' src="${get_bot_static.configuration.photo}"> ${get_bot_static.configuration.name} <span class="ui basic ${get_bot_static.configuration.status === "ACTIVE" ? "green" : "red"} basic label"> ${get_bot_static.subscriber_count} </span></a></div >`
    div.innerHTML += segement
    return div
}
function examdetails(data) {
    for (i of data) {
        payload = JSON.parse(i)
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
        subtab = document.querySelector(`div.tab.segment[data-tab="${id}"]`)
        subtab.innerHTML = `<div  style="display: inline-flex;"><span>
            <a class="ui black basic label" data="${payload.examID}">Subject :<div class="detail">${payload.subject.split(":")[0]}</div></a>
            <a class="ui black basic label">Date :<div class="detail">${payload.subject.split(":")[1]}</div></a>
            <a class="ui black basic label">Grade :<div class="detail">${payload.grade}-${payload.section}</div></a>
            <a class="ui black basic label">Eduction Medium :<div class="detail">${payload.userMedium}</div></a>
        </span>
        <span style="float: right">
            <a class="ui brown basic label" style="align-content: center;display: inline-flex;flex-wrap: wrap;align-items: center;padding: .2em;">Absent
            <div class="detail" style="margin: 0 .5rem"><div class="ui fitted slider checkbox" style="padding: 0.3em;"><input type="checkbox"><label></label>
            </div></div>Present</a>
            <a class="ui blue basic tertiary label">Entry<div class="detail">Ready to Save</div></a>
            <a class="ui red basic tertiary label">Absent<div class="detail">Saved</div></a>
            <a class="ui green basic tertiary label">Present<div class="detail">Saved</div></a>
            <a class="ui  tertiary basic label">Not Saved</a>
        </span></div>
        <div class="ui fluid fitted segment" style="text-wrap: nowrap;overflow-x: scroll;">
        <table class="ui last selectable stuck sortable table"  id="${id}_table"></table></div>`
    }
}
function fetchmenu(listdata) {
    const container = document.querySelector('#sx_model .content')
    element = []
    div = document.createElement('div')
    div.classList = "ui secondary pointing menu"
    x = `<div class="item">Select Your Exam: </div> `
    for (i of listdata) {
        payload = JSON.parse(i)
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
        x += `<div class="item fluid" data-tab="${id}">${id}</div>`
    }
    div.innerHTML = x,
        container.appendChild(div)
    for (i of listdata) {
        payload = JSON.parse(i)
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
        container.appendChild(createElementFromHTML(`<div class="ui tab segment" data-tab="${id}"></div>`))
    }
}
function fetch_table(id, exam, student) {
    tablegen = `<thead><tr><th>Sr No.</th><th>Student Name</th><th>Student ID</th><th>Gender</th><th>P/A</th>`
    for (i = 0; i < exam.length; i++) { tablegen += `<th>${exam[i].questionTitle}</th>` }
    tablegen += `  <th>Total</th><th>Submit</th></tr></thead><tbody>`;
    for (st = 0; st < student.length; st++) {
        tablegen += `<tr sid="${student[st].studentId}">
                    <td class="pi1 enter fluid" >${((st + 1) < 10) ? '0' + (st + 1).toString() : st + 1}</td>
                    <td class="pi1 enter fluid" >${student[st].studentName} ${student[st].fatherName[0]}. ${student[st].surName}</td>
                    <td class="pi1 enter fluid">${student[st].studentId}</td> 
                    <td class="pi1 enter fluid">${student[st].gender}</td>
                    <td class="pi1 enter fluid left marked">
                    <div class="ui fitted slider checkbox"><input type="checkbox"><label></label></div></td>`
        for (i = 0; i < exam.length; i++) {
            tablegen += `<td><div class="ui fluid input"><input max="${find_obj_value(exam, 'questionTitle', exam[i].questionTitle, 'questionMaxScore')}" placeholder="${exam[i].questionTitle}" min="0" type="number"></div></td>`
        }
        tablegen += `<td class="pi1 enter fluid">${student[st].scores ? (student[st].scores.status === 1 ? student[st].scores.obtainedMarks : 0) : 0}</td>
            <td><div class="ui icon fluid ${student[st].scores ? ((student[st].scores.status === 1) ? "green disabled" : "disabled") : ""} animated fade button" tabindex="0">
            <div class="visible content">Done</div><div class="hidden content">Save</div></div></td></tr>`
    }
    tablegen += "</tbody>"
    document.querySelector(`#${id}`).innerHTML = tablegen
}
function load_marks_online(id, exam, student) {
    for (st = 0; st < student.length; st++) {
        if (student[st].scores) {
            if (student[st].scores.status === 1) {//p
                $(`#${id} tr[sid=${student[st].studentId}]`).addClass("green");
                $(`#${id} tr[sid=${student[st].studentId}] input[type="checkbox"]`).prop('checked', true);
                examdata = sort(student[st].scores.questions, "questionID")
                for (i = 0; i < examdata.length; i++) {
                    document.querySelectorAll(`#${id} tr[sid="${student[st].studentId}"] input[type="number"]`)[i].value = find_obj_value(examdata, 'questionTitle', document.querySelectorAll(`#${id} thead > tr > th`)[i + 5].innerText, 'score')
                }
            } else {//a
                $(`#${id} tr[sid=${student[st].studentId}]`).addClass("red");
                document.querySelectorAll(`#${id} tr[sid="${student[st].studentId}"] input[type="number"]`).forEach(e => e.classList.add('disabled'))
                $(`#${id} tr[sid=${student[st].studentId}] input[type="checkbox"]`).prop('checked', false);
            }
        } else {
            $(`#${id} tr[sid=${student[st].studentId}]`).addClass("");
            $(`#${id} tr[sid=${student[st].studentId}] input[type="checkbox"]`).prop('checked', true);
        }
    }
}
function tablelisten(id, exam, lastdata) {
    document.querySelectorAll(`#${id} tr`).forEach(e => e.addEventListener('change', () => {
        m = 0; document.querySelectorAll(`#${id} tr[sid="${e.getAttribute('sid')}"] input[type="number"]`).forEach(mark => m += parseInt(mark.value))
        document.querySelector(`#${id} tr[sid="${e.getAttribute('sid')}"] td:nth-last-child(2)`).innerHTML = m;
        e.classList.contains('green') ? e.classList.remove('green') : ""
        !(e.classList.contains('blue')) ? e.classList.add('blue') : ""
        document.querySelector(`#${id} tr[sid="${e.getAttribute('sid')}"] .animated`).classList.remove('disabled', 'green')
    }))
    document.querySelectorAll(`#${id} tr[sid]`).forEach(e => {
        e.querySelector(`.slider.checkbox`).addEventListener('click', () => {
            x = e.querySelector(`input[type="checkbox"]`);
            inputs = e.querySelectorAll(`input[type="number"]`);
            x.checked ? x.parentNode.parentNode.classList.replace('red', "green") : x.parentNode.parentNode.classList.replace("green", 'red')
            x.checked ? inputs.forEach(i => i.parentNode.classList.remove('disabled')) : inputs.forEach(i => i.parentNode.classList.add('disabled'));
        });
        log.log(exam)
        e.querySelector(`.button`).addEventListener('click', () => { makebody(lastdata, e, exam) })
    })
}
function makebody(lastdata, trdata, exam) {
    suid = trdata.getAttribute('sid')
    arr = []
    maxsum = 0;
    sum = 0;
    trdata.querySelectorAll('input[type="number"]').forEach(e => arr.push(e.value))
    x = { "questions": [] };
    exam.forEach(e => {
        maxsum += e.questionMaxScore
        x.questions.push({
            "questionTitle": `${e.questionTitle}`, "questionID": String(e.questionID), "score": `${arr[parseInt(String(e.questionTitle).replace("Q", "")) - 1]}`
        })
    })
    x.questions.forEach(e => sum += parseInt(e.score))
    sleep(250).then(() => {
        present = trdata.querySelector("input[type='checkbox']").checked ? 1 : 2
        examid = document.querySelector('#sx_model div.active a[data]').getAttribute('data')
        for (i in lastdata) {
            payload = JSON.parse(lastdata[i])
            if (payload.examID == examid) {
                body = `{"data": {"studentID": "${suid}","examID": "${payload.examID}","schoolCode": "${payload.schoolCode}","section": "${payload.section}","userMobile": "${payload.userMobile}","teacherCode": "${payload.teacherCode}","teacherName": "${payload.teacherName}","userMedium": "${payload.userMedium}","grade": "${payload.grade}",`
                break
            }
        }
        if (present === 1) {
            body += `"scores": { "status": ${parseInt(present)},"totalMarks": ${parseInt(maxsum)},"obtainedMarks": ${parseInt(sum)},"questions":${JSON.stringify(x.questions)}}}}`
        } else {
            body += `"scores": { "status": ${parseInt(present)}}}}`
        }
        body = body.replaceAll(/[\n\r]+/g, "");
        log.debug(body)
        return posthttp(`https://saral-bot.gujaratvsk.org/api/save-student-scores?token=${token}`, body, [], trdata)
    });
}

function sort(data, key) {
    return data.sort((a, b) => parseInt(a[key]) - parseInt(b[key]))
}

//trigger
function loading_data(token) {
    const container = document.querySelector('#sx_model .content')
    container.innerHTML = "";
    lastdata = lastbotmsg()
    if (lastdata.length === 0) {
        let Nodiv = document.createElement('div')
        Nodiv.classList = "ui segment"
        Nodiv.innerHTML = `
            <div class="ui segment fluid">
            No data is available. Please select exam in Xamta-bot. <br/> Please goto help section below for more information,</div>
            <a class="fluid ui secondary button" target="_blank" href="https://incpi.github.io">Go to Help Site</a> `
        container.appendChild(Nodiv)
    } else {
        const lists = { "schoolCode": "School Code :", "userMobile": "Teacher's Mobile :", "teacherCode": "Teacher's Code :", "teacherName": "Teacher's Name :" }
        //teacher data
        container.appendChild(GetTeacherData(JSON.parse(lastdata[0]), lists))
        //GET exam MENU
        fetchmenu(lastdata)
        examdetails(lastdata)
        for (i of lastdata) {
            const payload = JSON.parse(i)
            var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
            let exam = JSON.parse(httpGet(`https://saral-bot.gujaratvsk.org/api/get-exam-details?token=${token}&examID=${payload.examID}`))
            var student = JSON.parse(httpGet(`https://saral-bot.gujaratvsk.org/api/get-student-list?token=${token}&schoolCode=${payload.schoolCode}&grade=${payload.grade}&section=${payload.section}&examID=${payload.examID}`))
            fetch_table(`${id}_table`, exam, student)
            log.debug(exam)
            tablelisten(`${id}_table`, exam, lastdata)
            load_marks_online(`${id}_table`, exam, student)
            $(`#${id}_table`).tablesort()
        }
    }
    // Activate tab on hover
    $('.menu .item.fluid').on('mouseenter', function () { $(this).tab('change tab', $(this).attr('id')) });
    // Initialize tabs
    $('.menu .item.fluid').tab();
}
function configuration() {
    loading_data(token = 'f9b9ba1f-bf3a-450e-8d67-6c2a9f7977f55')
}


