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
    i = 0
    index = 8
    while (payload.length < index) {
        var msg_u = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-messages', `{"bot_uuid":"0296339483100153","direction":"backward","next_token":${tokendata}}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]))
        log.log(msg_u)
        payload = load(payload, msg_u.messages)
        tokendata = JSON.stringify(msg_u.next_token)
        i++
    }
    return payload
}
function GetTeacherData(lastmsglist, teacherDetails) {
    var get_bot_static = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-bot-user-details', `{"bot_uuid":"0296339483100153"}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]));
    var div = $('<div>').addClass('ui menu segment');
    var segement = $('<span>').addClass('ui item small header').text('Teacher Details');
    $.each(lastmsglist, function (i, value) {
        if (i in teacherDetails) {
            var label = $('<a>').addClass('ui active item large basic label').append(
                $('<div>').text(teacherDetails[i]),
                $('<div>').addClass('detail').text(value)
            );
            segement.append(label);
        }
    });
    var imageLabel = $('<a>').addClass('ui right item image label').append(
        $('<img>').addClass('ui rounded centered image').attr('src', get_bot_static.configuration.photo),
        $('<span>').text(get_bot_static.configuration.name),
        $('<span>').addClass(`ui basic ${get_bot_static.configuration.status === "ACTIVE" ? "green" : "red"} basic label`).text(get_bot_static.subscriber_count)
    );
    div.append(segement, imageLabel);
    return div;
}

function examdetails(data) {
    $.each(data, function (index, item) {
        var payload = JSON.parse(item);
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`;
        var subtab = $(`div.tab.segment[data-tab="${id}"]`);
        subtab.html(`<div style="width: 100%;display: inline-flex;justify-content: space-between;"><span>
            <a class="ui black basic label" data="${payload.examID}">Subject :<div class="detail">${payload.subject.split(":")[0]}</div></a>
            <a class="ui black basic label">Date :<div class="detail">${payload.subject.split(":")[1]}</div></a>
            <a class="ui black basic label">Grade :<div class="detail">${payload.grade}-${payload.section}</div></a>
            <a class="ui black basic label">Eduction Medium :<div class="detail">${payload.userMedium}</div></a>
        </span>
        <span>
            <a class="ui brown basic label" style="align-content: center;display: inline-flex;flex-wrap: wrap;align-items: center;padding: .2em;">Absent
            <div class="detail" style="margin: 0 .5rem"><div class="ui fitted slider checkbox" style="padding: 0.3em;"><input checked type="checkbox"><label></label>
            </div></div>Present</a>
            <a class="ui blue basic tertiary label">Entry<div class="detail">Ready to Save</div></a>
            <a class="ui red basic tertiary label">Absent<div class="detail">Saved</div></a>
            <a class="ui green basic tertiary label">Present<div class="detail">Saved</div></a>
            <a class="ui tertiary basic label">Not Saved</a>
        </span></div>
        <div class="ui fluid fitted segment" style="text-wrap: nowrap;overflow-x: scroll;">
        <table class="ui last selectable stuck sortable table"  id="${id}_table"></table></div>`);
    });
}

function fetchmenu(listdata) {
    const container = $('#sx_model .content');
    var menuItems = '';
    $.each(listdata, function (index, item) {
        var payload = JSON.parse(item);
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`;
        menuItems += `<div class="item fluid" data-tab="${id}">${id}</div>`;
        container.append($(`<div class="ui tab segment" data-tab="${id}"></div>`));
    });
    var menuDiv = $('<div class="ui secondary pointing menu"></div>');
    menuDiv.append(`<div class="item">Select Your Exam: </div>${menuItems}`);
    container.prepend(menuDiv);
}

function fetch_table(id, exam, student) {
    var tablegen = '<thead><tr><th>Sr No.</th><th>Student Name</th><th>Student ID</th><th>Gender</th><th>P/A</th>';
    $.each(exam, function (index, item) {
        tablegen += `<th>${item.questionTitle}</th>`;
    });
    tablegen += '<th>Total</th><th>Submit</th></tr></thead><tbody>';
    $.each(student, function (index, item) {
        var marks = item.scores ? (item.scores.status === 1 ? item.scores.obtainedMarks : 0) : 0;
        var buttonDisabledClass = item.scores ? (item.scores.status === 1 ? "green disabled" : "red disabled") : "blue disabled";
        var row = `<tr sid="${item.studentId}">
            <td class="pi1 enter fluid">${((index + 1) < 10) ? '0' + (index + 1).toString() : index + 1}</td>
            <td class="pi1 enter fluid">${item.studentName} ${item.fatherName[0]}. ${item.surName}</td>
            <td class="pi1 enter fluid">${item.studentId}</td> 
            <td class="pi1 enter fluid">${item.gender}</td>
            <td class="pi1 enter fluid left marked">
            <div class="ui fitted slider checkbox"><input type="checkbox"><label></label></div></td>`;
        $.each(exam, function (idx, it) {
            row += `<td><div class="ui fluid input"><input max="${find_obj_value(exam, 'questionTitle', it.questionTitle, 'questionMaxScore')}" placeholder="${it.questionTitle}" min="0" type="number"></div></td>`;
        });
        row += `<td class="pi1 enter fluid">${marks}</td>
            <td><div class="ui icon fluid ${buttonDisabledClass} inverted animated fade button" tabindex="0">
            <div class="visible content">Done</div><div class="hidden content">Save</div></div></td></tr>`;
        tablegen += row;
    });
    tablegen += '</tbody>';
    $('#' + id).html(tablegen);
}

function load_marks_online(id, exam, student) {
    student.forEach(function (data) {
        if (data.scores) {
            if (data.scores.status === 1) { // Passed
                $(`#${id} tr[sid=${data.studentId}]`).addClass("positive");
                $(`#${id} tr[sid=${data.studentId}] input[type="checkbox"]`).prop('checked', true);
                var examdata = sort(data.scores.questions, "questionID");
                for (var i = 0; i < examdata.length; i++) {
                    $(`#${id} tr[sid="${data.studentId}"] input[type="number"]`).eq(i).val(find_obj_value(examdata, 'questionTitle', $(`#${id} thead > tr > th`).eq(i + 5).text(), 'score'));
                }
            } else { // Failed
                $(`#${id} tr[sid=${data.studentId}]`).addClass("negative");
                $(`#${id} tr[sid="${data.studentId}"] input[type="number"]`).addClass('disabled');
                $(`#${id} tr[sid=${data.studentId}] input[type="checkbox"]`).prop('checked', false);
            }
        } else { // No score
            $(`#${id} tr[sid=${data.studentId}]`).removeClass("positive negative");
            $(`#${id} tr[sid=${data.studentId}] input[type="checkbox"]`).prop('checked', true);
        }
    });
}

function tablelisten(id, exam, lastdata) {
    $(`#${id} tr`).on('change', function () {
        var m = 0;
        $(`#${id} tr[sid="${$(this).attr('sid')}"] input[type="number"]`).each(function () {
            m += parseInt($(this).val());
        });
        $(`#${id} tr[sid="${$(this).attr('sid')}"] td:nth-last-child(2)`).html(m);
        $(this).removeClass('positive');
        if (!$(this).hasClass('blue')) {
            $(this).addClass('blue');
        }
        $(`#${id} tr[sid="${$(this).attr('sid')}"] .animated`).removeClass('disabled positive');
    });

    $(`#${id} tr[sid]`).each(function () {
        var $this = $(this);
        $this.find('.slider.checkbox').on('click', function () {
            var x = $this.find('input[type="checkbox"]');
            var inputs = $this.find('input[type="number"]');
            if (x.prop('checked')) {
                x.closest('tr').removeClass('negative').addClass('positive');
                inputs.removeClass('disabled');
            } else {
                x.closest('tr').removeClass('positive').addClass('negative');
                inputs.addClass('disabled');
            }
        });

        $this.find('.button').on('click', function () {
            makebody(lastdata, $this[0], exam);
        });
    });
}
function makebody(lastdata, trdata, exam) {
    return new Promise((resolve, reject) => {
        var suid = trdata.getAttribute('sid');
        var arr = [];
        var maxsum = 0;
        var sum = 0;
        $(trdata).find('input[type="number"]').each(function () {
            arr.push($(this).val());
        });
        var x = { "questions": [] };
        $.each(exam, function (index, e) {
            maxsum += e.questionMaxScore;
            x.questions.push({
                "questionTitle": `${e.questionTitle}`, "questionID": String(e.questionID), "score": `${arr[parseInt(String(e.questionTitle).replace("Q", "")) - 1]}`
            });
        });
        $.each(x.questions, function (index, e) {
            sum += parseInt(e.score);
        });
        setTimeout(() => {
            var present = $(trdata).find("input[type='checkbox']").prop("checked") ? 1 : 2;
            var examid = $('#sx_model div.active a[data]').attr('data');
            var body = '';
            for (var i in lastdata) {
                var payload = JSON.parse(lastdata[i]);
                if (payload.examID == examid) {
                    body = `{"data": {"studentID": "${suid}","examID": "${payload.examID}","schoolCode": "${payload.schoolCode}","section": "${payload.section}","userMobile": "${payload.userMobile}","teacherCode": "${payload.teacherCode}","teacherName": "${payload.teacherName}","userMedium": "${payload.userMedium}","grade": "${payload.grade}",`;
                    break;
                }
            }
            if (present === 1) {
                body += `"scores": { "status": ${parseInt(present)},"totalMarks": ${parseInt(maxsum)},"obtainedMarks": ${parseInt(sum)},"questions":${JSON.stringify(x.questions)}}}}`;
            } else {
                body += `"scores": { "status": ${parseInt(present)}}}}`;
            }
            body = body.replaceAll(/[\n\r]+/g, "");
            console.log(body);
            resolve(posthttp(`https://saral-bot.gujaratvsk.org/api/save-student-scores?token=${token}`, body, [], trdata));
        }, 250);
    });
}

function sort(data, key) {
    return data.sort((a, b) => parseInt(a[key]) - parseInt(b[key]))
}

//trigger
function loading_data(token) {
    const container = $('#sx_model .content');
    container.empty();
    lastdata = lastbotmsg();

    if (lastdata.length === 0) {
        let Nodiv = $('<div>').addClass("ui segment").html(`
            <div class="ui segment fluid">
            No data is available. Please select exam in Xamta-bot. <br/> Please goto help section below for more information,</div>
            <a class="fluid ui secondary button" target="_blank" href="https://incpi.github.io">Go to Help Site</a> `);
        container.append(Nodiv);
    } else {
        const lists = { "schoolCode": "School Code :", "userMobile": "Teacher's Mobile :", "teacherCode": "Teacher's Code :", "teacherName": "Teacher's Name :" };
        //teacher data
        container.append(GetTeacherData(JSON.parse(lastdata[0]), lists));
        //GET exam MENU
        fetchmenu(lastdata);
        examdetails(lastdata);
        for (i of lastdata) {
            const payload = JSON.parse(i);
            var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`;
            let exam = JSON.parse(httpGet(`https://saral-bot.gujaratvsk.org/api/get-exam-details?token=${token}&examID=${payload.examID}`));
            var student = JSON.parse(httpGet(`https://saral-bot.gujaratvsk.org/api/get-student-list?token=${token}&schoolCode=${payload.schoolCode}&grade=${payload.grade}&section=${payload.section}&examID=${payload.examID}`));
            fetch_table(`${id}_table`, exam, student);
            console.log(exam);
            tablelisten(`${id}_table`, exam, lastdata);
            load_marks_online(`${id}_table`, exam, student);
            $(`#${id}_table`).tablesort();
        }
    }
    // Activate tab on hover
    $('.menu .item.fluid').on('mouseenter', function () {
        $(this).tab('change tab', $(this).attr('id'));
    });
    // Initialize tabs
    $('.menu .item.fluid').tab();
}

function configuration() {
    loading_data(token = 'f9b9ba1f-bf3a-450e-8d67-6c2a9f7977f55')
}