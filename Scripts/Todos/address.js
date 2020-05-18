// Addressの一覧
var addressItems = [];
// 選択されたToDo
var selectedAddressItem;
// 画面の項目
var addressElements = {
    searchForm: document.getElementById("adress_searchForm"),
    searchBtn: document.getElementById("address_search"),
    inputForm: document.getElementById("address_inputForm"),
    serchBtn: document.getElementById("address_search"),
    serchInput: document.getElementById("address_searchBtn"),
    cancelBtn: document.getElementById("address_serchcancelBtn"),
    newBtn: document.getElementById("address_newBtn"),
    delBtn: document.getElementById("address_delBtn"),
    id: document.getElementById("address_Id"),
    name: document.getElementById("address_Name"),
    tellnum: document.getElementById("address_telNum"),
    email: document.getElementById("address_email"),
    company: document.getElementById("address_company"),
    memo: document.getElementById("address_memo"),
    submitBtn: document.getElementById("address_submit"),
    new_cancelBtn: document.getElementById("address_cancel"),
    listForm: document.getElementById("address_listForm")
};
addressElements.searchBtn.addEventListener("click", function () {
    addressElements.searchForm.classList.add("showing_on");
    addressElements.searchForm.classList.remove("showing_off");
    var searchSubmit = document.getElementById("address_serachSubmit");
    var searchClose = document.getElementById("address_serachCancle");
    searchClose.addEventListener("click", function () {
        addressElements.searchForm.classList.remove("showing_on");
        addressElements.searchForm.classList.add("showing_off");
        addressloadItems("");
    });
    searchSubmit.addEventListener("click", function () {
        var searchStr = document.getElementById("serachInput")["value"];
        addressloadItems(searchStr);
    });
});
// ページロード時
addressElements.newBtn.addEventListener("click", function () {
    addressElements.inputForm.classList.remove('showing_off');
    addressElements.inputForm.classList.add('showing_on');
    addressElements.submitBtn.removeEventListener("click", updateAddress);
    addressElements.submitBtn.addEventListener("click", insertAddress);
});
addressElements.new_cancelBtn.addEventListener("click", function () {
    addressElements.inputForm.classList.add('showing_off');
    addressElements.inputForm.classList.remove('showing_on');
    addressElements.id["value"] = "";
    addressElements.name["value"] = "";
    addressElements.tellnum["value"] = "";
    addressElements.email["value"] = "";
    addressElements.company["value"] = "";
    addressElements.memo["value"] = "";
});
addressElements.delBtn.addEventListener("click", function () {
    if (confirm("Are you sure delete?") !== true) {
        return;
    }
    // APIの呼び出し
    $.ajax("/api/addressapi/clear", { method: "POST" })
        .done(function (result) {
        // 完了したら一覧をロードする
        addressloadItems("");
    })
        .fail(function () {
        alert("Faild to delete all address items.");
    });
});
var insertAddress = function () {
    var id = "#" + Math.random().toString(36).substr(2, 4);
    var saveItem = {
        Id: id,
        Name: addressElements.name["value"],
        TellNum: addressElements.tellnum["value"],
        Email: addressElements.email["value"],
        Company: addressElements.company["value"],
        Memo: addressElements.memo["value"],
        UserName: "admin"
    };
    // 入力チェック
    if (!saveItem.Name) {
        alert("Name is required.");
        return;
    }
    $.ajax("/Todos/Address", { method: "POST", data: saveItem })
        .done(function () {
        addressElements.inputForm.classList.add('showing_off');
        addressElements.inputForm.classList.remove('showing_on');
        addressElements.id["value"] = "";
        addressElements.name["value"] = "";
        addressElements.tellnum["value"] = "";
        addressElements.email["value"] = "";
        addressElements.company["value"] = "";
        addressElements.memo["value"] = "";
        addressloadItems("");
    })
        .fail(function () {
        alert("Faild to insert items.");
    });
};
var updateAddress = function () {
    var saveItem = {
        Id: addressElements.id["value"],
        Name: addressElements.name["value"],
        TellNum: addressElements.tellnum["value"],
        Email: addressElements.email["value"],
        Company: addressElements.company["value"],
        Memo: addressElements.memo["value"],
        UserName: "admin"
    };
    // 入力チェック
    if (!saveItem.Name) {
        alert("Name is required.");
        return;
    }
    $.ajax("/api/addressApi/update", { method: "POST", data: saveItem })
        .done(function () {
        addressloadItems("");
    })
        .fail(function () {
        alert("Faild to update items.");
    });
    addressElements.inputForm.classList.add('showing_off');
    addressElements.inputForm.classList.remove('showing_on');
};
addressElements.submitBtn.addEventListener("click", insertAddress);
// ページロード時
window.addEventListener("load", function () {
    // 一覧をロードする
    addressloadItems("");
});
// 一覧のロード
function addressloadItems(searchStr) {
    $.ajax("/api/addressapi/getall")
        .done(function (result) {
        // 取得したToDo一覧を退避
        addressItems = result;
        if (document.getElementsByClassName("address_list").length > 0) {
            var num = document.getElementsByClassName("address_list").length;
            for (var i = 0; i < num; i++) {
                document.getElementsByClassName("address_list").item(i).parentNode.removeChild(document.getElementsByClassName("address_list").item(i));
                i--;
                num--;
            }
        }
        var _loop_1 = function (item) {
            if (searchStr !== "") {
                if (item.Name.search(searchStr)) {
                    return "continue";
                }
            }
            // li要素を生成
            var listItem = document.createElement("li");
            var column_id = document.createElement("div");
            var column_name = document.createElement("div");
            var column_phoneNum = document.createElement("div");
            var column_email = document.createElement("div");
            var column_company = document.createElement("div");
            var column_memo = document.createElement("div");
            var column_modify = document.createElement("div");
            var column_delete = document.createElement("div");
            column_id.classList.add("showing_off");
            column_id.classList.add("input__column");
            column_name.classList.add("input__column");
            column_phoneNum.classList.add("input__column");
            column_email.classList.add("input__column");
            column_company.classList.add("input__column");
            column_memo.classList.add("input__column");
            column_modify.classList.add("input__column");
            column_delete.classList.add("input__column");
            var span_id = document.createElement("span");
            var span_name = document.createElement("span");
            var span_phoneNum = document.createElement("span");
            var span_email = document.createElement("span");
            var span_company = document.createElement("span");
            var span_memo = document.createElement("span");
            var mody_btn = document.createElement("button");
            var del_btn = document.createElement("button");
            span_id.innerText = item.Id;
            span_name.innerText = item.Name;
            span_phoneNum.innerText = item.TellNum;
            span_email.innerText = item.Email;
            span_company.innerText = item.Company;
            span_memo.innerText = item.Memo;
            mody_btn.innerText = "Modify";
            del_btn.innerText = "Delete";
            listItem.appendChild(column_id).appendChild(span_id);
            listItem.appendChild(column_name).appendChild(span_name);
            listItem.appendChild(column_phoneNum).appendChild(span_phoneNum);
            listItem.appendChild(column_email).appendChild(span_email);
            listItem.appendChild(column_company).appendChild(span_company);
            listItem.appendChild(column_memo).appendChild(span_memo);
            listItem.appendChild(column_modify).appendChild(mody_btn);
            listItem.appendChild(column_delete).appendChild(del_btn);
            listItem.classList.add("address_list");
            addressElements.listForm.appendChild(listItem);
            mody_btn.addEventListener("click", function () {
                addressElements.inputForm.classList.add("showing_on");
                addressElements.inputForm.classList.remove('showing_off');
                addressElements.submitBtn.innerText = "UPDATE";
                changeselectedAddressItem(item);
                addressElements.submitBtn.removeEventListener("click", insertAddress);
                addressElements.submitBtn.addEventListener("click", updateAddress);
            });
            del_btn.addEventListener("click", function () {
                changeselectedAddressItem(item);
                // APIの呼び出し
                $.ajax("/api/addressapi/Delete?id=" + selectedAddressItem.Id, { method: "POST", data: item })
                    .done(function (result) {
                    changeselectedAddressItem(result);
                    // 完了したら一覧をロードする
                    addressloadItems("");
                })
                    .fail(function () {
                    alert("Faild to delete address items.");
                });
            });
        };
        // リストにToDoを追加していく
        for (var _i = 0, addressItems_1 = addressItems; _i < addressItems_1.length; _i++) {
            var item = addressItems_1[_i];
            _loop_1(item);
        }
    })
        .fail(function () {
        alert("Faild to load todo items.");
    });
}
// 選択項目の変更
function changeselectedAddressItem(item) {
    selectedAddressItem = item;
    addressElements.searchForm.classList.remove("showing_on");
    addressElements.searchForm.classList.add("showing_off");
    if (!item) {
        addressElements.id["value"] = "";
        addressElements.name["value"] = "";
        addressElements.tellnum["value"] = "";
        addressElements.email["value"] = "";
        addressElements.company["value"] = "";
        addressElements.memo["value"] = "";
    }
    else {
        addressElements.id["value"] = selectedAddressItem.Id;
        addressElements.name["value"] = selectedAddressItem.Name;
        addressElements.tellnum["value"] = selectedAddressItem.TellNum;
        addressElements.email["value"] = selectedAddressItem.Email;
        addressElements.company["value"] = selectedAddressItem.Company;
        addressElements.memo["value"] = selectedAddressItem.Memo;
    }
}
//# sourceMappingURL=address.js.map