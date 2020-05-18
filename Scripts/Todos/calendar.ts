
// ToDoItemの型定義
interface DiaryItem {
    Id: string;
    Title: string;
    Contents: string;
    Password: string;
    CreatedDate: Date;
    UserName: string;

}
let dItem: DiaryItem[] = [];


// ToDoItemの型定義
interface ToDoItem {
    Id: string;
    State: string;
    Priority: string;
    Title: string;
    StartDate: Date;
    EndDate: Date;
    Memo: string;
    UserName: string;

}
let tItem: ToDoItem[] = [];

let today = new Date();
let first = new Date(today.getFullYear(), today.getMonth(), 1);


const dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const notLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let pageFirst = first;
let pageYear;
let activeDate;
let selectedDate;

if (first.getFullYear() % 4 === 0) {
    pageYear = leapYear;
} else {
    pageYear = notLeapYear;
}

// calendar Elements
const calendarElements = {
    currentYear: document.getElementById("current-year"),
    currentMonth:document.getElementById("current-year-month"),
    calendarBody: document.getElementById("calendar-body"),
    prevBtn: document.getElementById("prev"),
    nextBtn: document.getElementById("next"),
    diaryList: document.getElementById("diary_list"),
    titleDay: document.getElementById("title-Day"),
    titletMonth: document.getElementById("titlet-Month"),
    titleYear: document.getElementById("title-Year"),
    todoInput: document.getElementById("todoInput")
};

const showCalendar = ()=> {
    let monthCnt = 100;
    let cnt = 1;

    calendarElements.currentMonth.innerHTML = monthList[first.getMonth()];
    calendarElements.currentYear.innerText = (today.getFullYear()).toString();
    for (let i = 0; i < 6; i++) {
        let tr = document.createElement('tr');
        tr.setAttribute('id', monthCnt.toString());
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < first.getDay()) || cnt > pageYear[first.getMonth()]) {
                let td = document.createElement('td');
                tr.appendChild(td);
                td.classList.add("date");
                td.addEventListener("click", handleDate);
                
            } else {
                let td = document.createElement('td');
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

    let selectedyear = today.getFullYear().toString();
    let selectedMonth = (today.getMonth() + 1).toString();
    let selectedDay = today.getDate().toString();

    selectedMonth = selectedMonth.length < 2 ? `0${selectedMonth}` : selectedMonth;
    selectedDay = selectedDay.length < 2 ? `0${selectedDay}` : selectedDay;
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
}


const handleDate = (e) => {

    activeDate.classList.remove('active');
    activeDate = document.getElementById(e.currentTarget.innerHTML);
    activeDate.classList.add('active');
    setSelectedDate();

}


const setSelectedDate = () => {
    let selectedyear = today.getFullYear().toString();
    let selectedMonth = (today.getMonth() + 1).toString();
    let selectedDay = activeDate.innerHTML.toString();
    selectedMonth = selectedMonth.length < 2 ? `0${selectedMonth}` : selectedMonth;
    selectedDay = selectedDay.length < 2 ? `0${selectedDay}` : selectedDay;
    selectedDate = selectedyear + "-" + selectedMonth + "-" + selectedDay;

    //$.ajax("/api/diarysapi/getall")
    $.ajax(`/api/diarysapi/getall`)
        .done((result: DiaryItem[]) => {

            dItem = result;
            if (document.getElementsByClassName("diarys").length > 0) {

                for (let i = 0; i < document.getElementsByClassName("diarys").length; i++) {
                    document.getElementsByClassName("diarys").item(i).innerHTML = "";
                }

            }

            // リストにToDoを追加していく
            for (let item of dItem) {
                
                let date = item.CreatedDate.toString().substr(0, 10);
                if (date === selectedDate) {
                    let diarylist = document.getElementById("diarylist");
                    let div = document.createElement("div");
                    div.innerText = item.Title;
                    div.classList.add("diarys");
                    diarylist.appendChild(div);
                }
            }

        })
        .fail(() => {
            alert("Faild to load diary items.");
        });

    //$.ajax("/api/diarysapi/getall")
    $.ajax(`/api/todosapi/getall`)
        .done((result: ToDoItem[]) => {

            tItem = result;
            if (document.getElementsByClassName("todos").length > 0) {

                for (let i = 0; i < document.getElementsByClassName("todos").length; i++) {
                    document.getElementsByClassName("todos").item(i).innerHTML = "";
                }

            }

            // リストにToDoを追加していく
            for (let item of tItem) {

                let date = item.EndDate.toString().substr(0, 10);
                if (date === selectedDate) {
                    let diarylist = document.getElementById("todoslist");
                    let div = document.createElement("div");
                    div.classList.add("todos");
                    div.innerText = item.Title;
                    diarylist.appendChild(div);
                }
            }

        })
        .fail(() => {
            alert("Faild to load diary items.");
        });

    calendarElements.titleDay.innerText = selectedDay;
    calendarElements.titletMonth.innerText = selectedMonth;
    calendarElements.titleYear.innerText = selectedyear;
}

const prev = () =>{

    if (pageFirst.getMonth() === 1) {
        pageFirst = new Date(first.getFullYear() - 1, 12, 1);
        first = pageFirst;
        if (first.getFullYear() % 4 === 0) {
            pageYear = leapYear;
        } else {
            pageYear = notLeapYear;
        }
    } else {
        pageFirst = new Date(first.getFullYear(), first.getMonth() - 1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    removeCalendar();
    showCalendar();
}

const next = () => {

   
    if (pageFirst.getMonth() === 12) {
        pageFirst = new Date(first.getFullYear() + 1, 1, 1);
        first = pageFirst;
        if (first.getFullYear() % 4 === 0) {
            pageYear = leapYear;
        } else {
            pageYear = notLeapYear;
        }
    } else {
        pageFirst = new Date(first.getFullYear(), first.getMonth() + 1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    removeCalendar();
    showCalendar();
 
}

const removeCalendar= ()  => {
    let catchTr = 100;
    for (let i = 100; i < 106; i++) {
        let tr = document.getElementById(catchTr.toString());
        tr.remove();
        catchTr++;
    }
}

showCalendar();