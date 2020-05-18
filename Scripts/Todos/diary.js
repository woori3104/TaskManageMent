// Diaryの一覧
var diaryItems = [];
// 選択されたDiary
var selectedDairyItem;
// 画面の項目
var dairyElements = {
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
var visibleDiaryInputForm = function () {
    if (dairyElements.diary_inputform.classList.contains("showing_off")) {
        dairyElements.diary_inputform.classList.remove('showing_off');
        dairyElements.diary_inputform.classList.add('showing_on');
    }
    else {
        dairyElements.diary_inputform.classList.add('showing_off');
        dairyElements.diary_inputform.classList.remove('showing_on');
    }
};
// ページロード時
dairyElements.newBtn.addEventListener("click", function () {
    visibleDiaryInputForm();
    initDiaryData();
    dairyElements.submitBtn.removeEventListener("click", updateDiary);
    dairyElements.submitBtn.addEventListener("click", insertDiary);
    dairyElements.new_cancelBtn.addEventListener("click", function () {
        initDiaryData();
        dairyElements.diary_inputform.classList.add('showing_off');
        dairyElements.diary_inputform.classList.remove('showing_on');
    });
});
//ダイアリーインサート
var insertDiary = function () {
    // 入力チェック
    if (dairyElements.pw1["value"] !== dairyElements.pw2["value"]) {
        alert("Confirm your Password");
        return;
    }
    var id = "#" + Math.random().toString(36).substr(2, 4);
    var saveItem = {
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
    $.ajax("/Todos/Diary", { method: "POST", data: saveItem })
        .done(function () {
        initDiaryData();
        diaryloadItems();
    })
        .fail(function () {
        alert("Faild to insert items.");
    });
};
//ダイアリーアップデート
var updateDiary = function () {
    var saveItem = {
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
    $.ajax("/api/diarysApi/update", { method: "POST", data: saveItem })
        .done(function () {
        initDiaryData();
        diaryloadItems();
        visibleDiaryInputForm();
    })
        .fail(function () {
        alert("Faild to insert items.");
    });
};
dairyElements.submitBtn.addEventListener("click", insertDiary);
// ページロード時
window.addEventListener("load", function () {
    // 一覧をロードする
    diaryloadItems();
});
// 一覧のロード
var diaryloadItems = function () {
    $.ajax("/api/diarysapi/getall")
        .done(function (result) {
        // 取得したDiary一覧を退避
        diaryItems = result;
        if (document.getElementsByClassName("diary_list").length > 0) {
            var num = document.getElementsByClassName("diary_list").length;
            for (var i = 0; i < num; i++) {
                document.getElementsByClassName("diary_list").item(i).parentNode.removeChild(document.getElementsByClassName("diary_list").item(i));
                i--;
                num--;
            }
        }
        // リストにDiaryを追加していく
        for (var _i = 0, diaryItems_1 = diaryItems; _i < diaryItems_1.length; _i++) {
            var item = diaryItems_1[_i];
            addDiaryItme(item);
        }
    })
        .fail(function () {
        alert("Faild to load Diary items.");
    });
};
var addDiaryItme = function (item) {
    // li要素を生成
    var listItem = document.createElement("li");
    var column_id = document.createElement("div");
    var column_date = document.createElement("div");
    var column_title = document.createElement("div");
    var column_modify = document.createElement("div");
    var column_delete = document.createElement("div");
    column_id.classList.add("showing_off");
    column_id.classList.add("diary_input__column");
    column_date.classList.add("diary_input__column");
    column_title.classList.add("diary_input__column");
    column_title.classList.add("diary_detailtitle_column");
    column_modify.classList.add("diary_input__column");
    column_delete.classList.add("diary_input__column");
    var span_id = document.createElement("span");
    var span_date = document.createElement("span");
    var span_title = document.createElement("span");
    var mody_btn = document.createElement("button");
    var del_btn = document.createElement("button");
    var CreatedDate = item.CreatedDate;
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
    mody_btn.addEventListener("click", function () {
        var confirmDiv = document.createElement("div");
        var pwInput = document.createElement("input");
        pwInput.setAttribute("type", "password");
        pwInput.setAttribute("placeholder", "input Your Password");
        var confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confrim";
        confirmBtn.classList.add("pwBtn");
        var cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelBtn.classList.add("pwBtn");
        var div = document.createElement("div");
        listItem.removeChild(column_modify);
        listItem.removeChild(column_delete);
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(pwInput));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(confirmBtn));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(cancelBtn));
        cancelBtn.addEventListener("click", function () {
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);
        });
        confirmBtn.addEventListener("click", function () {
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
    del_btn.addEventListener("click", function () {
        changeselectedDairyItem(item);
        var confirmDiv = document.createElement("div");
        var pwInput = document.createElement("input");
        pwInput.setAttribute("type", "password");
        pwInput.setAttribute("placeholder", "input Your Password");
        var confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confrim";
        confirmBtn.classList.add("pwBtn");
        var cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelBtn.classList.add("pwBtn");
        var div = document.createElement("div");
        listItem.removeChild(column_modify);
        listItem.removeChild(column_delete);
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(pwInput));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(confirmBtn));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(cancelBtn));
        cancelBtn.addEventListener("click", function () {
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);
        });
        confirmBtn.addEventListener("click", function () {
            if (pwInput.value !== item.Password) {
                alert("confrim your pw");
                return;
            }
            // APIの呼び出し
            $.ajax("/api/diaryapi/Delete?id=" + selectedDairyItem.Id, { method: "POST", data: item })
                .done(function (result) {
                changeselectedDairyItem(result);
                // 完了したら一覧をロードする
                diaryloadItems();
            })
                .fail(function () {
                alert("Faild to delete all Diary items.");
            });
        });
    });
    column_title.addEventListener("click", function () {
        changeselectedDairyItem(item);
        var confirmDiv = document.createElement("div");
        var pwInput = document.createElement("input");
        pwInput.setAttribute("type", "password");
        pwInput.setAttribute("placeholder", "input Your Password");
        var confirmBtn = document.createElement("button");
        confirmBtn.innerText = "Confrim";
        confirmBtn.classList.add("pwBtn");
        var cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancle";
        cancelBtn.classList.add("pwBtn");
        var div = document.createElement("div");
        listItem.removeChild(column_modify);
        listItem.removeChild(column_delete);
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(pwInput));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(confirmBtn));
        listItem.appendChild(div).appendChild(confirmDiv.appendChild(cancelBtn));
        cancelBtn.addEventListener("click", function () {
            initDiaryData();
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);
        });
        confirmBtn.addEventListener("click", function () {
            if (pwInput.value !== item.Password) {
                alert("confrim your pw");
                initDiaryData();
                return;
            }
            var diary_detail = document.getElementById("diary_detail");
            diary_detail.classList.add("showing_on");
            diary_detail.classList.remove("showing_off");
            var detailId = document.getElementById("detailId");
            detailId.innerText = item.Id;
            var detailDate = document.getElementById("detailDate");
            detailDate.innerText = item.CreatedDate.toString().substring(0, 10);
            var detail_title = document.getElementById("detail_title");
            detail_title.innerText = item.Title;
            var detailContents = document.getElementById("detailContents");
            detailContents.innerText = item.Contents;
            initDiaryData();
            listItem.removeChild(div);
            listItem.appendChild(column_modify);
            listItem.appendChild(column_delete);
        });
        var detailClose = document.getElementById("detailClose");
        detailClose.addEventListener("click", function () {
            var diary_detail = document.getElementById("diary_detail");
            diary_detail.classList.remove("showing_on");
            diary_detail.classList.add("showing_off");
            initDiaryData();
        });
    });
};
var initDiaryData = function () {
    dairyElements.id["value"] = "";
    dairyElements.pw1["value"] = "";
    dairyElements.pw2["value"] = "";
    dairyElements.title["value"] = "";
    dairyElements.createdDate["value"] = "";
    dairyElements.diary_Contents["value"] = "";
};
// 選択項目の変更
var changeselectedDairyItem = function (item) {
    selectedDairyItem = item;
    if (!item) {
        dairyElements.id["value"] = "";
        dairyElements.createdDate["value"] = "";
        dairyElements.title["value"] = "";
        dairyElements.diary_Contents["value"] = "";
        dairyElements.pw1["value"] = "";
    }
    else {
        dairyElements.id["value"] = selectedDairyItem.Id;
        dairyElements.createdDate["value"] = selectedDairyItem.CreatedDate.toString().substr(0, 10);
        ;
        dairyElements.title["value"] = selectedDairyItem.Title;
        dairyElements.diary_Contents["value"] = selectedDairyItem.Contents;
        dairyElements.pw1["value"] = selectedDairyItem.Password;
    }
};
//# sourceMappingURL=diary.js.map