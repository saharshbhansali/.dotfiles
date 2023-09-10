const get_time_table_details = () => {
    let details = {
        courseCode: [],
        courseTitle: [],
        slot: [],
        venue: [],
        facName: [],
        facSchool: [],
        allSlots: []
    };
    let table_rows = document.getElementsByTagName("tbody")[0].children;
    for (let i = 2; i < table_rows.length - 2; i++) {
        let td = table_rows[i].children;
        let code_title = td[2].innerText.split("\n")[0].trim();
        let code = code_title.split("-")[0].trim();
        details.courseCode.push(code);

        let title = code_title.split("-")[1].trim();
        details.courseTitle.push(title);

        let slot_venue = td[7].innerText.replace(/(\r\n|\n|\r)/gm, "").split("-");
        let slot = slot_venue[0].trim();
        details.slot.push(slot);
        details.allSlots = details.allSlots.concat(slot.split("+"));

        let venue = slot_venue[1].trim();
        details.venue.push(venue);

        let facName_school = td[8].innerText.replace(/(\r\n|\n|\r)/gm, "").split("-");
        let fac_name = facName_school[0].trim();
        details.facName.push(fac_name);

        let facSchool = facName_school[1].trim();
        details.facSchool.push(facSchool);
    }
    return details;
};

const add_buttons = () => {

    let div = document.createElement("div");
    div.style.textAlign = "center";

    let label = document.createElement("label");
    label.innerText = "*Choose Date for syncing time table :";
    label.style.color = "red";
    label.style.textAlign = "center";
    div.appendChild(label);

    let date_holder = document.createElement("input");
    date_holder.type = "date";
    date_holder.style.width = "105px";
    date_holder.style.height = "35px";
    date_holder.style.fontSize = "1rem";
    date_holder.style.borderRadius = "10px";
    date_holder.style.margin = "10px";
    date_holder.style.textAlign = "center";
    date_holder.id = "min_date";
    let date = new Date();
    date_holder.min = date.toISOString().split("T")[0];
    date_holder.max = new Date(date.setMonth(date.getMonth() + 6)).toISOString().split("T")[0];
    div.appendChild(date_holder);

    var btn = document.createElement("button");
    btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 141.7 141.7" width="24" height="24"><path fill="#fff" d="M95.8,45.9H45.9V95.8H95.8Z"/><path fill="#34a853" d="M95.8,95.8H45.9v22.5H95.8Z"/><path fill="#4285f4" d="M95.8,23.4H30.9a7.55462,7.55462,0,0,0-7.5,7.5V95.8H45.9V45.9H95.8Z"/><path fill="#188038" d="M23.4,95.8v15a7.55462,7.55462,0,0,0,7.5,7.5h15V95.8Z"/><path fill="#fbbc04" d="M118.3,45.9H95.8V95.8h22.5Z"/><path fill="#1967d2" d="M118.3,45.9v-15a7.55462,7.55462,0,0,0-7.5-7.5h-15V45.9Z"/><path fill="#ea4335" d="M95.8,118.3l22.5-22.5H95.8Z"/><polygon fill="#2a83f8" points="77.916 66.381 75.53 63.003 84.021 56.868 87.243 56.868 87.243 85.747 82.626 85.747 82.626 62.772 77.916 66.381"/><path fill="#2a83f8" d="M67.29834,70.55785A7.88946,7.88946,0,0,0,70.78,64.12535c0-4.49-4-8.12-8.94-8.12a8.77525,8.77525,0,0,0-8.74548,6.45379l3.96252,1.58258a4.41779,4.41779,0,0,1,4.473-3.51635,4.138,4.138,0,1,1,.06256,8.24426v.00513h-.0559l-.00666.00061-.00964-.00061H59.15v3.87677h2.70642L61.88,72.65a4.70514,4.70514,0,1,1,0,9.37,5.35782,5.35782,0,0,1-3.96588-1.69354,4.59717,4.59717,0,0,1-.80408-1.2442l-.69757-1.69946L52.23005,79c.62,4.33,4.69,7.68,9.61,7.68,5.36,0,9.7-3.96,9.7-8.83A8.63346,8.63346,0,0,0,67.29834,70.55785Z"/></svg><span>Sync assignments with Google Calendar</span>`;
    btn.style = `display: flex;align-items: center;gap: 1rem;font-family: inherit;justify-content: space-around;color: #535353;font-size: 13px;font-weight: 500;margin: 8px auto;cursor: pointer;background-color: white;border-radius: 32px;transition: all 0.2s ease-in-out;padding: 6px 10px;border: 1px solid rgba(0, 0, 0, 0.25);`;
    btn.id = "sync_dates_btn";
    div.appendChild(btn);

    let table = document.getElementsByClassName("table-responsive")[0];
    table.insertAdjacentElement("beforebegin", div);
};

const times = {
    "A1": ["T08:00:00.000+05:30", "T09:00:00.000+05:30"],
    "B1": ["T08:00:00.000+05:30", "T09:00:00.000+05:30"],
    "C1": ["T08:00:00.000+05:30", "T09:00:00.000+05:30"],
    "D1": ["T08:00:00.000+05:30", "T10:00:00.000+05:30"],
    "E1": ["T08:00:00.000+05:30", "T10:00:00.000+05:30"],
    "F1": ["T09:00:00.000+05:30", "T10:00:00.000+05:30"],
    "G1": ["T09:00:00.000+05:30", "T10:00:00.000+05:30"],
    "TA1": ["T10:00:00.000+05:30"],
    "TB1": ["T11:00:00.000+05:30"],
    "TC1": ["T11:00:00.000+05:30"],
    "TD1": ["T12:00:00.000+05:30"],
    "TE1": ["T11:00:00.000+05:30"],
    "TF1": ["T11:00:00.000+05:30"],
    "TG1": ["T12:00:00.000+05:30"],
    "TAA1": ["T12:00:00.000+05:30"],
    "TCC1": ["T12:00:00.000+05:30"],

    "A2": ["T14:00:00.000+05:30", "T15:00:00.000+05:30"],
    "B2": ["T14:00:00.000+05:30", "T15:00:00.000+05:30"],
    "C2": ["T14:00:00.000+05:30", "T15:00:00.000+05:30"],
    "D2": ["T14:00:00.000+05:30", "T16:00:00.000+05:30"],
    "E2": ["T14:00:00.000+05:30", "T16:00:00.000+05:30"],
    "F2": ["T15:00:00.000+05:30", "T16:00:00.000+05:30"],
    "G2": ["T15:00:00.000+05:30", "T16:00:00.000+05:30"],
    "TA2": ["T16:00:00.000+05:30"],
    "TB2": ["T17:00:00.000+05:30"],
    "TC2": ["T17:00:00.000+05:30"],
    "TD2": ["T17:00:00.000+05:30"],
    "TE2": ["T17:00:00.000+05:30"],
    "TF2": ["T17:00:00.000+05:30"],
    "TG2": ["T18:00:00.000+05:30"],
    "TAA2": ["T18:00:00.000+05:30"],
    "TBB2": ["T18:00:00.000+05:30"],
    "TCC2": ["T18:00:00.000+05:30"],
    "TDD2": ["T18:00:00.000+05:30"],

    "L1": ["T08:00:00.000+05:30"],
    "L3": ["T09:51:00.000+05:30"],
    "L5": ["T11:40:00.000+05:30"],
    "L7": ["T08:00:00.000+05:30"],
    "L9": ["T09:51:00.000+05:30"],
    "L11": ["T11:40:00.000+05:30"],
    "L13": ["T08:00:00.000+05:30"],
    "L15": ["T09:51:00.000+05:30"],
    "L17": ["T11:40:00.000+05:30"],
    "L19": ["T08:00:00.000+05:30"],
    "L21": ["T09:51:00.000+05:30"],
    "L23": ["T11:40:00.000+05:30"],
    "L25": ["T08:00:00.000+05:30"],
    "L27": ["T09:51:00.000+05:30"],
    "L29": ["T11:40:00.000+05:30"],

    "L31": ["T14:00:00.000+05:30"],
    "L33": ["T15:51:00.000+05:30"],
    "L35": ["T17:40:00.000+05:30"],
    "L37": ["T14:00:00.000+05:30"],
    "L39": ["T15:51:00.000+05:30"],
    "L41": ["T17:40:00.000+05:30"],
    "L43": ["T14:00:00.000+05:30"],
    "L45": ["T15:51:00.000+05:30"],
    "L47": ["T17:40:00.000+05:30"],
    "L49": ["T14:00:00.000+05:30"],
    "L51": ["T15:51:00.000+05:30"],
    "L53": ["T17:40:00.000+05:30"],
    "L55": ["T14:00:00.000+05:30"],
    "L57": ["T15:51:00.000+05:30"],
    "L59": ["T17:40:00.000+05:30"],

    // "L71": ["T08:00:00.000+05:30"],
    // "L73": ["T09:51:00.000+05:30"],
    // "L75": ["T11:40:00.000+05:30"],
    // "L77": ["T14:00:00.000+05:30"],
    // "L79": ["T15:51:00.000+05:30"],
    // "L81": ["T17:40:00.000+05:30"],
    // "L83": ["T08:00:00.000+05:30"],
    // "L85": ["T09:51:00.000+05:30"],
    // "L87": ["T11:40:00.000+05:30"],
    // "L89": ["T14:00:00.000+05:30"],
    // "L91": ["T15:51:00.000+05:30"],
    // "L93": ["T17:40:00.000+05:30"]

};

const days = {
    "A1": ["d1", "d3"], "B1": ["d2", "d4"], "C1": ["d3", "d5"], "D1": ["d4", "d1"], "E1": ["d5", "d2"],
    "F1": ["d1", "d3"], "G1": ["d2", "d4"],
    "TA1": ["d5"], "TB1": ["d1"], "TC1": ["d2"], "TD1": ["d5"], "TE1": ["d4"], "TF1": ["d5"], "TG1": ["d1"],
    "TAA1": ["d2"], "TCC1": ["d4"],

    "A2": ["d1", "d3"], "B2": ["d2", "d4"], "C2": ["d3", "d5"], "D2": ["d4", "d1"], "E2": ["d5", "d2"],
    "F2": ["d1", "d3"], "G2": ["d2", "d4"],
    "TA2": ["d5"], "TB2": ["d1"], "TC2": ["d2"], "TD2": ["d3"], "TE2": ["d4"], "TF2": ["d5"], "TG2": ["d1"],
    "TAA2": ["d2"], "TBB2": ["d3"], "TCC2": ["d4"], "TDD2": ["d5"],

    "L1": ["d1"], "L3": ["d1"], "L5": ["d1"], "L7": ["d2"], "L9": ["d2"], "L11": ["d2"], "L13": ["d3"], "L15": ["d3"],
    "L17": ["d3"], "L19": ["d4"], "L21": ["d4"], "L23": ["d4"], "L25": ["d5"], "L27": ["d5"], "L29": ["d5"],
    "L31": ["d1"], "L33": ["d1"], "L35": ["d1"], "L37": ["d2"], "L39": ["d2"], "L41": ["d2"], "L43": ["d3"], "L45": ["d3"],
    "L47": ["d3"], "L49": ["d4"], "L51": ["d4"], "L53": ["d4"], "L55": ["d5"], "L57": ["d5"], "L59": ["d5"],
    // "L71": [""], "L73": [""], "L75": [""], "L77": [""], "L79": [""], "L81": [""], "L83": [""], "L85": [""], "L87": [""], "L89": [""], "L91": [""], "L93": [""]

};

/*
    **start = '2022-01-18'
    **end='2022-06-24'
*/
const get_dates = (end) => {
    let start_date = new Date();
    let end_date = new Date(end);
    let date = new Date(start_date.getTime());
    let dates = {
        "d1": [],
        "d2": [],
        "d3": [],
        "d4": [],
        "d5": []
    };
    let count = 0;
    while (date <= end_date) {
        let day = new Date(date).getDay();
        if (day == 1) { dates.d1.push(new Date(date)); };
        if (day == 2) { dates.d2.push(new Date(date)); };
        if (day == 3) { dates.d3.push(new Date(date)); };
        if (day == 4) { dates.d4.push(new Date(date)); };
        if (day == 5) { dates.d5.push(new Date(date)); };
        date.setDate(date.getDate() + 1);

        count++;
        if (count == 7) break;
    }
    return dates;
};

const add_time = (start, add) => {
    let date = new Date(`2023${start}`);
    let new_date = new Date(date.getTime() + (add * 60000));
    let time = "T" + new_date.getHours() + ":" + new_date.getMinutes() + ":" + "00.000+05:30";
    return time;
};

let error_code1 = 0;
let calendar_tt = (title, code, venue, date, facName, slot, time, token, day_count) => {
    try {
        let end_time;
        // console.log(slot);
        if (slot.charAt(0) == "L") {
            end_time = add_time(time, 100);
        } else {
            end_time = add_time(time, 50);
        }
        fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&sendNotifications=true&alt=json&key=AIzaSyCPBz-DTZdoTLQ_ZiqsVUO520XItcomTn0`,
            {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    end: {
                        dateTime: date + end_time,
                        'timeZone': 'Asia/Kolkata'
                    },
                    start: {
                        dateTime: date + time,
                        'timeZone': 'Asia/Kolkata'
                    },
                    'recurrence': [
                        "RRULE:FREQ=WEEKLY;COUNT=" + day_count
                    ],
                    eventType: "default",
                    description: code + "-" + facName,
                    summary: title + "-" + venue,
                }),
            }
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                // resolve();
                // console.log(data);
                try {
                    if (data.error.code == 401) {
                        error_code1 = 401;
                    } else if (data.error.code == 403) {
                        calendar_tt(title, code, venue, date, facName, slot, time, token, day_count);
                    }
                } catch { }
                return true;
                // return true;
            })
            .catch((err) => {
                // console.log(err);
                // reject("Error");
                // return false;
            });
    } catch (err) {
        // console.log(err);
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function format_date(date) {
    date = new Date(date);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
}

function workingDayCount(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

const changeObj = (details) => {
    let obj = {
        allSlots: details.allSlots,
        courseInfo: []
    };
    for (let i = 0; i < details.courseCode.length; i++) {
        obj.courseInfo.push({
            courseCode: details.courseCode[i],
            courseTitle: details.courseTitle[i],
            slot: details.slot[i],
            facName: details.facName[i],
            facSchool: details.facSchool[i],
            venue: details.venue[i]
        });
    }
    return obj;
};

const copyBtn = (details) => {
    let copyBtn = document.createElement("button");
    copyBtn.style.width = 'max-content';
    copyBtn.style.marginLeft = '49%';
    copyBtn.innerHTML = "Copy Time Table";
    copyBtn.className = "btn btn-primary btn-block";
    copyBtn.id = "copyTimetable";
    let facTable = document.getElementById('timeTableStyle');
    facTable.insertAdjacentElement("afterend", copyBtn);
    let obj = changeObj(details);
    copyBtn.addEventListener("click", () => {
        let str = JSON.stringify(obj);
        let encoded = window.btoa(str);
        let decoded = window.atob(encoded);
        console.log(encoded, decoded);
        navigator.clipboard.writeText(encoded);
    });
    /*var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    base64regex.test("SomeStringObviouslyNotBase64Encoded...");             // FALSE
    base64regex.test("U29tZVN0cmluZ09idmlvdXNseU5vdEJhc2U2NEVuY29kZWQ=");   // TRUE*/
};

const sync_calender_tt = () => {
    let details = get_time_table_details();
    // copyBtn(details);
    try {
        chrome.storage.sync.get(["token"], (token) => {
            if (token.token != null) {
                add_buttons();
                let sync_btn = document.getElementById("sync_dates_btn");
                sync_btn.addEventListener("click", async () => {

                    let till_date = document.getElementById("min_date").value;
                    if (till_date == "") {
                        let date = new Date();
                        let min_date = date.toISOString().split("T")[0];
                        let max_date = new Date(date.setMonth(date.getMonth() + 6)).toISOString().split("T")[0];
                        alert(`Please Enter the date in range of ${min_date} - ${max_date}!!!`);
                        return;
                    }

                    document.getElementById("sync_dates_btn").disabled = true;

                    let sync_btn = document.getElementById("sync_dates_btn");
                    let sync_wait = document.createElement("div");
                    sync_wait.className = "";
                    let stmt = document.createElement("h4");
                    stmt.innerText = `Please Wait while the dates get synced!!!`;
                    stmt.style.textAlign = "center";
                    stmt.style.color = "red";
                    sync_wait.appendChild(stmt);
                    sync_wait.id = "sync_wait_txt";
                    sync_btn.insertAdjacentElement("afterend", sync_wait);

                    let day_count = Math.ceil(workingDayCount(new Date(), new Date(till_date)) / 5);
                    let dates = get_dates(till_date);
                    for (let i = 0; i < details.slot.length; i++) {
                        let individual_slot = details.slot[i].split("+");
                        let courseCode = details.courseCode[i];
                        let courseTitle = details.courseTitle[i];
                        let facName = details.facName[i];
                        let venue = details.venue[i];
                        if (venue == "NIL") continue;
                        for (let j = 0; j < individual_slot.length; j++) {
                            let weekDay = days[individual_slot[j]];
                            if ((parseInt(individual_slot[j].slice(1)) % 2 == 0) && individual_slot[j].charAt(0) == "L") continue;
                            // console.log(dates, weekDay);

                            if (error_code1 == 401) {
                                alert("Please Re-login with your Google account and refresh the page");
                                chrome.storage.sync.set({ token: null });
                                error_code1 = 0;
                                break;
                            }

                            for (let k = 0; k < weekDay.length; k++) {

                                let date = dates[weekDay[k]];
                                date = format_date(date);
                                let time = times[individual_slot[j]][k];
                                if (date.indexOf("NaN") != 0)
                                    calendar_tt(courseTitle, courseCode, venue, date, facName, individual_slot[j], time, token.token, day_count);
                                if (error_code1 == 401) {
                                    break;
                                }
                                await sleep(500);
                            }
                        }
                        if (error_code1 != 401 && i == details.slot.length - 1) {
                            document.getElementById("sync_wait_txt").hidden = true;
                            alert(`Time Table is successfully synced to calender till ${till_date}🥳🥳`);
                            document.getElementById("sync_dates_btn").disabled = false;
                        }
                    }
                });
            }
            else {
                let div = document.createElement("div");
                div.className = "";
                let stmt = document.createElement("p");
                stmt.innerText = "**Sign in with google in extension to sync your due dates with Google Calender";
                stmt.style.color = "red";
                div.appendChild(stmt);
                document.getElementsByClassName("table-responsive")[0].insertAdjacentElement("beforebegin", div);
            }
        });
    } catch (err) {
        // console.log(err);
    }
};

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "time_table") {
        try {
            sync_calender_tt();
        } catch (error) {
            // console.log(error);
        }
    }
});