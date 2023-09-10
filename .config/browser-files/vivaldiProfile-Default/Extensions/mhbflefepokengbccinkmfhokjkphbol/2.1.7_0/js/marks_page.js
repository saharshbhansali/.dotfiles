let modify_marks_page = () => {
    let other = false, colspan = 8;
    let tables = document.querySelectorAll(".customTable-level1 > tbody"); // select all Tables
    let subject_header = Array.from(document.querySelectorAll(".tableContent"));
    let i = 0;
    for (let j = 0; j < tables.length; j++) {
        // To get the subject code
        let sub_header_row = subject_header[i].getElementsByTagName("td");
        let sub_type = sub_header_row[4].innerHTML;
        i += 2;
        let tot_max_marks = 0,
            tot_weightage_percent = 0,
            tot_scored = 0,
            tot_weightage_equi = 0,
            tot_class_avg = 0;

        table_marks = tables[j].querySelectorAll(".tableContent-level1"); // select rows excluding header
        table_marks = Array.from(table_marks);

        for (let k = 0; k < table_marks.length; k++) {
            if (table_marks[k].style.background != '') {
                other = true;
                colspan = 11;
                continue;
            }

            let content = table_marks[k].innerHTML.split("<td>");

            //Removing the tabs and other tags
            let max_marks = content[3].replace(/[^0-9.]+/g, "");
            let weightage_percent = content[4].replace(/[^0-9.]+/g, "");
            let scored = content[6].replace(/[^0-9.]+/g, "");
            let weightage_equi = content[7].replace(/[^0-9.]+/g, "");
            let class_avg = content[8].replace(/[^0-9.]+/g, "");

            //converting string to float
            tot_max_marks += parseFloat(max_marks);
            tot_weightage_percent += parseFloat(weightage_percent);
            tot_scored += parseFloat(scored);
            tot_weightage_equi += parseFloat(weightage_equi);
            tot_class_avg += parseFloat(class_avg);
        };

        //Add the row to display totals
        if (!other) {
            tables[j].innerHTML += `
        <tr class="tableContent-level1" style='background: rgb(60,141,188,0.8);'>
            <td></td>
            <td><b>Total:</b></td>
            <td>${tot_max_marks.toFixed(2)}</td>
            <td>${tot_weightage_percent.toFixed(2)}</td>
            <td></td>
            <td><b>${tot_scored.toFixed(2)}</b></td>
            <td><b>${tot_weightage_equi.toFixed(2)}</b></td>
            <td><b>Lost Weightage Marks: ${(tot_weightage_percent.toFixed(2) - tot_weightage_equi.toFixed(2)).toFixed(2)}</b></td>
        </tr>
        `;
        } else {
            tables[j].innerHTML += `
        <tr class="tableContent-level1" style='background: rgb(60,141,188,0.8);'>
            <td></td>
            <td><b>Total:</b></td>
            <td>${tot_max_marks.toFixed(2)}</td>
            <td>${tot_weightage_percent.toFixed(2)}</td>
            <td></td>
            <td><b>${tot_scored.toFixed(2)}</b></td>
            <td><b>${tot_weightage_equi.toFixed(2)}</b></td>
            <td>${tot_class_avg.toFixed(2)}</td>
            <td> </td>
            <td><b>Lost Weightage Marks:</b></td>
            <td>${(tot_weightage_percent.toFixed(2) - tot_weightage_equi.toFixed(2)).toFixed(2)}</td>
        </tr>
        `;
        }

        //FAT passing marks
        let pass_marks;

        //Theory Subjects
        if (sub_type.includes("Theory") && tot_weightage_percent == 60) {
            if (tot_weightage_equi >= 34) {
                pass_marks = 40;
                tables[j].innerHTML += `
                <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
                    <td colspan="${colspan}" style="text-align:center">You need only ${pass_marks} marks out of 100 in FAT to pass theory component 🥳</td>
                </tr>
                `;
            }
            else {
                pass_marks = ((34 - tot_weightage_equi) * 2.5) + 40;
                tables[j].innerHTML += `
                <tr class="tableContent-level1" style='background: rgb(255,0,0,0.6);'>
                    <td colspan="${colspan}" style="text-align:center"><b>Minimum marks required to clear this component is : ${pass_marks.toFixed(2)} in FAT<b></td>
                </tr>
                `;
            }
        }

        //Labs
        else if ((sub_type.includes("Lab") || sub_type.includes("Online")) && tot_weightage_percent == 60) {
            if (tot_weightage_equi >= 50) {
                pass_marks = "You have fulfilled the criteria of passing the Lab Component 🥳";
                tables[j].innerHTML += `
                <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
                    <td colspan="${colspan}" style="text-align:center">${pass_marks}</td>
                </tr>
                `;
            }
            else {
                pass_marks = 50 - tot_weightage_equi;
                tables[j].innerHTML += `
                <tr class="tableContent-level1" style='background: rgb(255,0,0,0.6);'>
                    <td colspan="${colspan}" style="text-align:center"><b>Minimum marks required to clear this component is : ${pass_marks.toFixed(2)} in FAT<b></td>
                </tr>
                `;
            }
        }

        //STS
        else if (sub_type.includes("Soft") && tot_weightage_percent == 60) {
            if (tot_weightage_equi >= 50) {
                pass_marks = "You have fulfilled the criteria of passing the STS 🥳";
                tables[j].innerHTML += `
                <tr class="tableContent-level1" style='background: rgb(170, 255, 0,0.6);'>
                    <td colspan="${colspan}" style="text-align:center">${pass_marks}</td>
                </tr>
                `;
            }
            else {
                pass_marks = 50 - tot_weightage_equi;
                tables[j].innerHTML += `
                <tr class="tableContent-level1" style='background: rgb(255,0,0,0.6);'>
                    <td colspan="${colspan}" style="text-align:center"><b>Minimum marks required to clear STS is : ${pass_marks.toFixed(2)} marks<b></td>
                </tr>
                `;
            }
        }
    };
};
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "mark_view_page") {
        try {
            modify_marks_page();
        } catch (error) {
            // console.log(error);
        }
    }
});