var dItem = [];
var tItem = [];
var today = new Date();
var first = new Date(today.getFullYear(), today.getMonth(), 1);
var dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var notLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var pageFirst = first;
var pageYear;
var activeDate;
var selectedDate;
if (first.getFullYear() % 4 === 0) {
    pageYear = leapYear;
}
else {
    pageYear = notLeapYear;
}
// calendar Elements
var calendarElements = {
    currentYear: document.getElementById("current-year"),
    currentMonth: document.getElementById("current-year-month"),
    calendarBody: document.getElementById("calendar-body"),
    prevBtn: document.getElementById("prev"),
    nextBtn: document.getElementById("next"),
    diaryList: document.getElementById("diary_list"),
    titleDay: document.getElementById("title-Day"),
    titletMonth: document.getElementById("titlet-Month"),
    titleYear: document.getElementById("title-Year"),
    todoInput: document.getElementById("todoInput")
};
var showCalendar = function () {
    var monthCnt = 100;
    var cnt = 1;
    calendarElements.currentMonth.innerHTML = monthList[first.getMonth()];
    calendarElements.currentYear.innerText = (today.getFullYear()).toString();
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('id', monthCnt.toString());
        for (var j = 0; j < 7; j++) {
            if ((i === 0 && j < first.getDay()) || cnt > pageYear[first.getMonth()]) {
                var td = document.createElement('td');
                tr.appendChild(td);
                td.classList.add("date");
                td.addEventListener("click", handleDate);
            }
            else {
                var td = document.createElement('td');
                td.textContent = cnt.toString();
                td.setAttribute('id', cnt.toString());
                tr.appendChild(td);
                cnt++;
                td.classList.add("date");
                td.addEventListener("click", handleDate);
            }
        }
        monthCnt++;
        calendarElements.calendarBody.appendChild(tr);
    }
    var selectedyear = today.getFullYear().toString();
    var selectedMonth = (today.getMonth() + 1).toString();
    var selectedDay = today.getDate().toString();
    selectedMonth = selectedMonth.length < 2 ? "0" + selectedMonth : selectedMonth;
    selectedDay = selectedDay.length < 2 ? "0" + selectedDay : selectedDay;
    selectedDate = selectedyear + "-" + selectedMonth + "-" + selectedDay;
    activeDate = document.getElementById(today.getDate().toString());
    setSelectedDate();
    activeDate.classList.add('active');
    calendarElements.titleDay.innerText = today.getDate().toString();
    calendarElements.titletMonth.innerText = (today.getMonth() + 1).toString();
    calendarElements.titleYear.innerText = (today.getFullYear()).toString();
    calendarElements.titleDay.innerText = selectedDay;
    calendarElements.titletMonth.innerText = selectedMonth;
    calendarElements.titleYear.innerText = selectedyear;
    calendarElements.prevBtn.addEventListener('click', prev);
    calendarElements.nextBtn.addEventListener('click', next);
};
var handleDate = function (e) {
    activeDate.classList.remove('active');
    activeDate = document.getElementById(e.currentTarget.innerHTML);
    activeDate.classList.add('active');
    setSelectedDate();
};
var setSelectedDate = function () {
    var selectedyear = today.getFullYear().toString();
    var selectedMonth = (today.getMonth() + 1).toString();
    var selectedDay = activeDate.innerHTML.toString();
    selectedMonth = selectedMonth.length < 2 ? "0" + selectedMonth : selectedMonth;
    selectedDay = selectedDay.length < 2 ? "0" + selectedDay : selectedDay;
    selectedDate = selectedyear + "-" + selectedMonth + "-" + selectedDay;
    //$.ajax("/api/diarysapi/getall")
    $.ajax("/api/diarysapi/getall")
        .done(function (result) {
        dItem = result;
        if (document.getElementsByClassName("diarys").length > 0) {
            for (var i = 0; i < document.getElementsByClassName("diarys").length; i++) {
                document.getElementsByClassName("diarys").item(i).innerHTML = "";
            }
        }
        // リストにToDoを追加していく
        for (var _i = 0, dItem_1 = dItem; _i < dItem_1.length; _i++) {
            var item = dItem_1[_i];
            var date = item.CreatedDate.toString().substr(0, 10);
            if (date === selectedDate) {
                var diarylist = document.getElementById("diarylist");
                var div = document.createElement("div");
                div.innerText = item.Title;
                div.classList.add("diarys");
                diarylist.appendChild(div);
            }
        }
    })
        .fail(function () {
        alert("Faild to load diary items.");
    });
    //$.ajax("/api/diarysapi/getall")
    $.ajax("/api/todosapi/getall")
        .done(function (result) {
        tItem = result;
        if (document.getElementsByClassName("todos").length > 0) {
            for (var i = 0; i < document.getElementsByClassName("todos").length; i++) {
                document.getElementsByClassName("todos").item(i).innerHTML = "";
            }
        }
        // リストにToDoを追加していく
        for (var _i = 0, tItem_1 = tItem; _i < tItem_1.length; _i++) {
            var item = tItem_1[_i];
            var date = item.EndDate.toString().substr(0, 10);
            if (date === selectedDate) {
                var diarylist = document.getElementById("todoslist");
                var div = document.createElement("div");
                div.classList.add("todos");
                div.innerText = item.Title;
                diarylist.appendChild(div);
            }
        }
    })
        .fail(function () {
        alert("Faild to load diary items.");
    });
    calendarElements.titleDay.innerText = selectedDay;
    calendarElements.titletMonth.innerText = selectedMonth;
    calendarElements.titleYear.innerText = selectedyear;
};
var prev = function () {
    if (pageFirst.getMonth() === 1) {
        pageFirst = new Date(first.getFullYear() - 1, 12, 1);
        first = pageFirst;
        if (first.getFullYear() % 4 === 0) {
            pageYear = leapYear;
        }
        else {
            pageYear = notLeapYear;
        }
    }
    else {
        pageFirst = new Date(first.getFullYear(), first.getMonth() - 1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    removeCalendar();
    showCalendar();
};
var next = function () {
    if (pageFirst.getMonth() === 12) {
        pageFirst = new Date(first.getFullYear() + 1, 1, 1);
        first = pageFirst;
        if (first.getFullYear() % 4 === 0) {
            pageYear = leapYear;
        }
        else {
            pageYear = notLeapYear;
        }
    }
    else {
        pageFirst = new Date(first.getFullYear(), first.getMonth() + 1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    removeCalendar();
    showCalendar();
};
var removeCalendar = function () {
    var catchTr = 100;
    for (var i = 100; i < 106; i++) {
        var tr = document.getElementById(catchTr.toString());
        tr.remove();
        catchTr++;
    }
};
showCalendar();
//# sourceMappingURL=calendar.js.map