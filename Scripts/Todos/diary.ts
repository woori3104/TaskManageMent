
// DiaryItemの型定義
interface DiaryItem {
    Id: string;
    Title: string;
    Contents: string;
    Password: string;
    CreatedDate: Date;
    UserName: string;

}

// Diaryの一覧
let diaryItems: DiaryItem[] = [];

// 選択されたDiary
let selectedDairyItem: DiaryItem;

// 画面の項目
const dairyElements = {
    newBtn: document.getElementById("diary_newBtn"),
    id: document.getElementById("diary_Id"),
    createdDate: document.getElementById("diary_Date"),
    title: document.getElementById("diary_title"),
    pw1: document.getElementById("password"),
    pw2: document.getElementById("password2"),
    diary_Contents: document.getElementById("diary_Contents"),
    submitBtn: document.getElementById("diary_submit"),
    new_cancelBtn: document.getElementById("diary_cancel"),
    diary_inputform: document.getElementById("diary_input_form"),
    diary_listform: document.getElementById("diary_listform") 
};


const visibleDiaryInputForm = () => {
    if (dairyElements.diary_inputform.classList.contains("showing_off")) {

        dairyElements.diary_inputform.classList.remove('showing_off');
        dairyElements.diary_inputform.classList.add('showing_on');

    } else {

        dairyElements.diary_inputform.classList.add('showing_off');
        dairyElements.diary_inputform.classList.remove('showing_on');

    }

}

// ページロード時
dairyElements.newBtn.addEventListener("click", () => {

    visibleDiaryInputForm();
    initDiaryData();
    dairyElements.submitBtn.removeEventListener("click", updateDiary);
    dairyElements.submitBtn.addEventListener("click", insertDiary);
    dairyElements.new_cancelBtn.addEventListener("click", () => {

        initDiaryData();
        dairyElements.diary_inputform.classList.add('showing_off');
        dairyElements.diary_inputform.classList.remove('showing_on');
    })

});

//ダイアリーインサート
const insertDiary =  () => {

    // 入力チェック
    if (dairyElements.pw1["value"] !== dairyElements.pw2["value"]) {
        alert("Confirm your Password");
        return;
    }


    let id = "#" + Math.random().toString(36).substr(2, 4);
    let saveItem: DiaryItem = {
        Id: id,
        CreatedDate: dairyElements.createdDate["value"],
        Title: dairyElements.title["value"],
        Contents: dairyElements.diary_Contents["value"],
        Password: dairyElements.pw1["value"],
        UserName: "admin"
    };

    // 入力チェック
    if (!saveItem.Title) {
        alert("Title is required.");
        return;
    }

    $.ajax(`/Todos/Diary`, { method: "POST", data: saveItem })
        .done(() => {

            initDiaryData();
            diaryloadItems();

        })
        .fail(() => {
            alert("Faild to insert items.");
        });
}


//ダイアリーアップデート
const updateDiary = function () {

    let saveItem: DiaryItem = {
        Id: dairyElements.id["value"],
        CreatedDate: dairyElements.createdDate["value"],
        Title: dairyElements.title["value"],
        Contents: dairyElements.diary_Contents["value"],
        Password: dairyElements.pw1["value"],
        UserName: "admin"
    };

    // 入力チェック
    if (!saveItem.Title) {
        alert("Title is required.");
        return;
    }

    $.ajax(`/api/diarysApi/update`, { method: "POST", data: saveItem })
        .done(() => {

            initDiaryData();
            diaryloadItems();
            visibleDiaryInputForm();
        })
        .fail(() => {
            alert("Faild to insert items.");
        });


}

dairyElements.submitBtn.addEventListener("click", insertDiary);

// ページロード時
window.addEventListener("load", () => {

    // 一覧をロードする
    diaryloadItems();
});


// 一覧のロード
const diaryloadItems = () => {


    $.ajax("/api/diarysapi/getall")
        .done((result: DiaryItem[]) => {

            // 取得したDiary一覧を退避
            diaryItems = result;
            if (document.getElementsByClassName("diary_list").length > 0) {

                let num = document.getElementsByClassName("diary_list").length;
                for (let i = 0; i < num; i++) {
                    document.getElementsByClassName("diary_list").item(i).parentNode.removeChild(document.getElementsByClassName("diary_list").item(i));
                    i--;
                    num--;
                }

            }

            // リストにDiaryを追加していく
            for (let item of diaryItems) {

                addDiaryItme(item);
              
            }
        })
        .fail(() => {
            alert("Faild to load Diary items.");
        });


}


const addDiaryItme = (item: DiaryItem) => {


    // li要素を生成
    let listItem = document.createElement("li");
    let column_id = document.createElement("div");
    let column_date = document.createElement("div");
    let column_title = document.createElement("div");
    let column_modify = document.createElement("div");
    let column_delete = document.createElement("div");

    column_id.classList.add("showing_off");
    column_id.classList.add("diary_input__column");
    column_date.classList.add("diary_input__column");
    column_title.classList.add("diary_input__column");
    column_title.classList.add("diary_detailtitle_column")
    column_modify.classList.add("diary_input__column");
    column_delete.classList.add("diary_input__column");


    let span_id = document.createElement("span");
    let span_date = document.createElement("span");
    let span_title = document.createElement("span");
    let mody_btn = document.createElement("button");
    let del_btn = document.createElement("button");
    let CreatedDate = item.CreatedDate;
    span_id.innerText = item.Id;
    span_date.innerText = CreatedDate.toString().substr(0, 10);
    span_title.innerText = item.Title;

    mody_btn.innerText = "Modify";
    del_btn.innerText = "Delete";

    listItem.appendChild(column_id).appendChild(span_id);
    listItem.appendChild(column_date).appendChild(span_date);
    listItem.appendChild(column_title).appendChild(span_title);
    listItem.appendChild(column_modify).appendChild(mody_btn);
    listItem.appendChild(column_delete).appendChild(del_btn);


    listItem.classList.add("diary_list");


    dairyElements.diary_listform.appendChild(listItem);

   

    mody_btn.addEventListener("click", () => {


        let confirmDiv = document.createElement("div");
        let pwInput = document.createElement("input");
        pwInput.setAttribute("type", "password");
        pwInput.setAttribute("placeholder", "input Your Password");
        let confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confrim";
        confirmBtn.classList.add("pwBtn");
        let cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelBtn.classList.add("pwBtn");
        let div = document.createElement("div");
        listItem.removeChild(column_modify);
        listItem.removeChild(column_delete);
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(pwInput));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(confirmBtn));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(cancelBtn));
        cancelBtn.addEventListener("click", () => {
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);
        });

        confirmBtn.addEventListener("click", () => {
            if (pwInput.value !== item.Password) {
                alert("confrim your pw");
                initDiaryData();

                return;

            }
            dairyElements.diary_inputform.classList.add("showing_on");
            dairyElements.diary_inputform.classList.remove('showing_off');
            dairyElements.submitBtn.innerText = "UPDATE";
            changeselectedDairyItem(item);
            dairyElements.submitBtn.removeEventListener("click", insertDiary);
            dairyElements.submitBtn.addEventListener("click", updateDiary);

        });

    });

    del_btn.addEventListener("click", () => {
        changeselectedDairyItem(item);

        let confirmDiv = document.createElement("div");
        let pwInput = document.createElement("input");
        pwInput.setAttribute("type", "password");
        pwInput.setAttribute("placeholder", "input Your Password");
        let confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confrim";
        confirmBtn.classList.add("pwBtn");
        let cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelBtn.classList.add("pwBtn");
        let div = document.createElement("div");
        listItem.removeChild(column_modify);
        listItem.removeChild(column_delete);
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(pwInput));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(confirmBtn));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(cancelBtn));

        cancelBtn.addEventListener("click", () => {
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);
        })

        confirmBtn.addEventListener("click", () => {
            if (pwInput.value !== item.Password) {
                alert("confrim your pw");
                return;

            }
            // APIの呼び出し
            $.ajax(`/api/diaryapi/Delete?id=${selectedDairyItem.Id}`, { method: "POST", data: item })
                .done(result => {

                    changeselectedDairyItem(result);
                    // 完了したら一覧をロードする
                    diaryloadItems();
                })
                .fail(() => {
                    alert("Faild to delete all Diary items.");
                });
        });


    });

    column_title.addEventListener("click", () => {

        changeselectedDairyItem(item);

        let confirmDiv = document.createElement("div");
        let pwInput = document.createElement("input");
        pwInput.setAttribute("type", "password");
        pwInput.setAttribute("placeholder", "input Your Password");
        let confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confrim";
        confirmBtn.classList.add("pwBtn");
        let cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancle";
        cancelBtn.classList.add("pwBtn");
        let div = document.createElement("div");
        listItem.removeChild(column_modify);
        listItem.removeChild(column_delete);
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(pwInput));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(confirmBtn));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(cancelBtn));

        cancelBtn.addEventListener("click", () => {

            initDiaryData();
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);
        })

        confirmBtn.addEventListener("click", () => {
            if (pwInput.value !== item.Password) {
                alert("confrim your pw");
                initDiaryData();
                return;

            }

            let diary_detail = document.getElementById("diary_detail");
            diary_detail.classList.add("showing_on");
            diary_detail.classList.remove("showing_off");
            let detailId = document.getElementById("detailId");
            detailId.innerText = item.Id;
            let detailDate = document.getElementById("detailDate");
            detailDate.innerText = item.CreatedDate.toString().substring(0, 10);
            let detail_title = document.getElementById("detail_title");
            detail_title.innerText = item.Title;
            let detailContents = document.getElementById("detailContents");
            detailContents.innerText = item.Contents;
            initDiaryData();
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);


        });
        let detailClose = document.getElementById("detailClose");

        detailClose.addEventListener("click", () => {
            let diary_detail = document.getElementById("diary_detail");
            diary_detail.classList.remove("showing_on");
            diary_detail.classList.add("showing_off");
            initDiaryData();
        })

    })

}
 
const initDiaryData = () => {

    dairyElements.id["value"] = "";
    dairyElements.pw1["value"] = "";
    dairyElements.pw2["value"] = "";
    dairyElements.title["value"] = "";
    dairyElements.createdDate["value"] = "";
    dairyElements.diary_Contents["value"] = "";
}

// 選択項目の変更
const changeselectedDairyItem = (item: DiaryItem) => {

    selectedDairyItem = item;


    if (!item) {
        dairyElements.id["value"] = "";
        dairyElements.createdDate["value"] = "";
        dairyElements.title["value"] = "";
        dairyElements.diary_Contents["value"] = "";
        dairyElements.pw1["value"] ="";
    } else {

        dairyElements.id["value"] = selectedDairyItem.Id;
        dairyElements.createdDate["value"] = selectedDairyItem.CreatedDate.toString().substr(0, 10);;
        dairyElements.title["value"] = selectedDairyItem.Title;
        dairyElements.diary_Contents["value"] = selectedDairyItem.Contents;
        dairyElements.pw1["value"] = selectedDairyItem.Password;

    }
}