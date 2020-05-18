// ToDoの一覧
var todoItems = [];
// 選択されたToDo
var selectedItem;
// 画面の項目
var elements = {
    newBtn: document.getElementById("newBtn"),
    delBtn: document.getElementById("delBtn"),
    id: document.getElementById("todos_Id"),
    state: document.getElementById("todos_state"),
    priority: document.getElementById("todos_priority"),
    title: document.getElementById("todos_Title"),
    starttime: document.getElementById("starttime"),
    endtime: document.getElementById("endtime"),
    todos_memo: document.getElementById("todos_memo"),
    submitBtn: document.getElementById("todos_submit"),
    new_cancelBtn: document.getElementById("todos_cancel"),
    inputFrom: document.getElementById("todos_inform"),
    todosUl: document.getElementById("todos_ul")
};
var visibleInputForm = function () {
    if (elements.inputFrom.classList.contains("showing_on")) {
        elements.inputFrom.classList.remove("showing_on");
        elements.inputFrom.classList.add('showing_off');
    }
    else {
        elements.inputFrom.classList.add("showing_on");
        elements.inputFrom.classList.remove('showing_off');
    }
};
elements.delBtn.addEventListener("click", function () {
    if (confirm("Are you sure delete?") !== true) {
        return;
    }
    // APIの呼び出し
    $.ajax("/api/todosapi/clear", { method: "POST" })
        .done(function (result) {
        // 完了したら一覧をロードする
        loadItems();
    })
        .fail(function () {
        alert("Faild to delete all todo items.");
    });
});
// ページロード時
elements.newBtn.addEventListener("click", function () {
    initElements();
    elements.submitBtn.removeEventListener("click", updateTask);
    elements.submitBtn.addEventListener("click", insertTask);
    elements.new_cancelBtn.addEventListener("click", function () {
    });
});
//アイテム初期化
var initElements = function () {
    elements.id["value"] = "";
    elements.state["value"] = "";
    elements.priority["value"] = "";
    elements.title["value"] = "";
    elements.starttime["value"] = "";
    elements.endtime["value"] = "";
    elements.todos_memo["value"] = "";
    visibleInputForm();
};
//アイテム入力
var insertTask = function () {
    var id = "#" + Math.random().toString(36).substr(2, 4);
    var saveItem = {
        Id: id,
        State: elements.state["value"],
        Priority: elements.priority["value"],
        Title: elements.title["value"],
        StartDate: elements.starttime["value"],
        EndDate: elements.endtime["value"],
        Memo: elements.todos_memo["value"],
        UserName: "admin"
    };
    // 入力チェック
    if (!saveItem.Title) {
        alert("Title is required.");
        return;
    }
    $.ajax("/Todos/todos", { method: "POST", data: saveItem })
        .done(function () {
        initElements();
        loadItems();
    })
        .fail(function () {
        alert("Faild to insert items.");
    });
};
// アイテムアップデート
var updateTask = function () {
    var saveItem = {
        Id: elements.id["value"],
        State: elements.state["value"],
        Priority: elements.priority["value"],
        Title: elements.title["value"],
        StartDate: elements.starttime["value"],
        EndDate: elements.endtime["value"],
        Memo: elements.todos_memo["value"],
        UserName: "admin"
    };
    // 入力チェック
    if (!saveItem.Title) {
        alert("Title is required.");
        return;
    }
    $.ajax("/api/todosapi/update", { method: "POST", data: saveItem })
        .done(function () {
        loadItems();
        initElements();
    })
        .fail(function () {
        alert("Faild to insert items.");
    });
};
// ページロード時
window.addEventListener("load", function () {
    // 一覧をロードする
    loadItems();
});
// 一覧のロード
var loadItems = function () {
    $.ajax("/api/todosapi/getall")
        .done(function (result) {
        // 取得したToDo一覧を退避
        todoItems = result;
        if (document.getElementsByClassName("todo_list").length > 0) {
            var num = document.getElementsByClassName("todo_list").length;
            for (var i = 0; i < num; i++) {
                document.getElementsByClassName("todo_list").item(i).parentNode.removeChild(document.getElementsByClassName("todo_list").item(i));
                i--;
                num--;
            }
        }
        // リストにToDoを追加していく
        for (var _i = 0, todoItems_1 = todoItems; _i < todoItems_1.length; _i++) {
            var item = todoItems_1[_i];
            addTotoList(item);
        }
    })
        .fail(function () {
        alert("Faild to load todo items.");
    });
};
//画面にリスト追加
var addTotoList = function (item) {
    var listItem = document.createElement("li");
    var column_id = document.createElement("div");
    var column_state = document.createElement("div");
    var column_priority = document.createElement("div");
    var column_taskTitle = document.createElement("div");
    var column_startDate = document.createElement("div");
    var column_endDate = document.createElement("div");
    var column_modify = document.createElement("div");
    var column_delete = document.createElement("div");
    column_id.classList.add("showing_off");
    column_id.classList.add("todos_input__column");
    column_state.classList.add("todos_input__column");
    column_priority.classList.add("todos_input__column");
    column_taskTitle.classList.add("todos_input__column");
    column_startDate.classList.add("todos_input__column");
    column_endDate.classList.add("todos_input__column");
    column_modify.classList.add("todos_input__column");
    column_delete.classList.add("todos_input__column");
    var span_id = document.createElement("span");
    var span_state = document.createElement("span");
    var span_priority = document.createElement("span");
    var span_taskTitle = document.createElement("span");
    var span_startDate = document.createElement("span");
    var span_endDate = document.createElement("span");
    var mody_btn = document.createElement("button");
    var del_btn = document.createElement("button");
    var startDate = item.StartDate;
    var endDate = item.EndDate;
    span_id.innerText = item.Id;
    span_state.innerText = item.State;
    span_priority.innerText = item.Priority;
    span_taskTitle.innerText = item.Title;
    span_startDate.innerText = startDate.toString().substr(0, 10);
    span_endDate.innerText = endDate.toString().substr(0, 10);
    mody_btn.innerText = "Modify";
    del_btn.innerText = "Delete";
    listItem.appendChild(column_id).appendChild(span_id);
    listItem.appendChild(column_state).appendChild(span_state);
    listItem.appendChild(column_priority).appendChild(span_priority);
    listItem.appendChild(column_taskTitle).appendChild(span_taskTitle);
    listItem.appendChild(column_startDate).appendChild(span_startDate);
    listItem.appendChild(column_endDate).appendChild(span_endDate);
    listItem.appendChild(column_modify).appendChild(mody_btn);
    listItem.appendChild(column_delete).appendChild(del_btn);
    listItem.classList.add("todo_list");
    elements.todosUl.appendChild(listItem);
    mody_btn.addEventListener("click", function () {
        ModifyTodoItem(item);
    });
    del_btn.addEventListener("click", function () {
        DeleteTodoItem(item);
    });
};
//アイテム修正
var ModifyTodoItem = function (item) {
    visibleInputForm();
    changeSelectedItem(item);
    elements.submitBtn.innerText = "UPDATE";
    elements.submitBtn.removeEventListener("click", insertTask);
    elements.submitBtn.addEventListener("click", updateTask);
};
//アイテム削除
var DeleteTodoItem = function (item) {
    // APIの呼び出し
    $.ajax("/api/todosapi/Delete?id=" + selectedItem.Id, { method: "POST", data: item })
        .done(function (result) {
        changeSelectedItem(result);
        // 完了したら一覧をロードする
        loadItems();
    })
        .fail(function () {
        alert("Faild to delete all todo items.");
    });
};
// 選択項目の変更
var changeSelectedItem = function (item) {
    selectedItem = item;
    if (!item) {
        elements.id["value"] = "";
        elements.state["value"] = "";
        elements.priority["value"] = "";
        elements.title["value"] = "";
        elements.starttime["value"] = "";
        elements.endtime["value"] = "";
        elements.todos_memo["value"] = "";
    }
    else {
        elements.id["value"] = selectedItem.Id;
        elements.state["value"] = selectedItem.State;
        elements.priority["value"] = selectedItem.Priority;
        elements.title["value"] = selectedItem.Title;
        elements.starttime["value"] = selectedItem.StartDate.toString().substr(0, 10);
        elements.endtime["value"] = selectedItem.EndDate.toString().substr(0, 10);
        elements.todos_memo["value"] = "";
    }
};
//登録ボタンにインサートイベントバインディング
elements.submitBtn.addEventListener("click", insertTask);
//# sourceMappingURL=todos.js.map