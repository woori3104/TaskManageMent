
// AddressItemの型定義
interface AddressItem {
    Id: string;
    Name: string;
    TellNum: string;
    Email: string;
    Company: string;
    Memo: string;
    UserName: string;
}

// Addressの一覧
let addressItems: AddressItem[] = [];

// 選択されたToDo
let selectedAddressItem: AddressItem;

// 画面の項目
const addressElements = {
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


addressElements.searchBtn.addEventListener("click", () => {

    addressElements.searchForm.classList.add("showing_on");
    addressElements.searchForm.classList.remove("showing_off");
    let searchSubmit = document.getElementById("address_serachSubmit");
    let searchClose = document.getElementById("address_serachCancle");
    searchClose.addEventListener("click", () => {
        addressElements.searchForm.classList.remove("showing_on");
        addressElements.searchForm.classList.add("showing_off");
        addressloadItems("");
    });

    searchSubmit.addEventListener("click", () => {
        let searchStr = document.getElementById("serachInput")["value"];
        addressloadItems(searchStr);
    });
})

// ページロード時
addressElements.newBtn.addEventListener("click", () => {
    addressElements.inputForm.classList.remove('showing_off');
    addressElements.inputForm.classList.add('showing_on');
    addressElements.submitBtn.removeEventListener("click", updateAddress);
    addressElements.submitBtn.addEventListener("click", insertAddress);
});

addressElements.new_cancelBtn.addEventListener("click", () => {

    addressElements.inputForm.classList.add('showing_off');
    addressElements.inputForm.classList.remove('showing_on');
    addressElements.id["value"] = "";
    addressElements.name["value"] = "";
    addressElements.tellnum["value"] = "";
    addressElements.email["value"] = "";
    addressElements.company["value"] = "";
    addressElements.memo["value"] = "";
});

addressElements.delBtn.addEventListener("click", () => {


    if (confirm("Are you sure delete?") !== true) {
        return;
    }

    // APIの呼び出し
    $.ajax(`/api/addressapi/clear`, { method: "POST" })
        .done(result => {
            // 完了したら一覧をロードする
            addressloadItems("");
        })
        .fail(() => {
            alert("Faild to delete all address items.");
        });
})

const insertAddress = () => {

    let id = "#" + Math.random().toString(36).substr(2, 4);
    let saveItem: AddressItem = {
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

    $.ajax(`/Todos/Address`, { method: "POST", data: saveItem })
        .done(() => {

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
        .fail(() => {
            alert("Faild to insert items.");
        });
}

const updateAddress = function () {

    let saveItem: AddressItem = {
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

    $.ajax(`/api/addressApi/update`, { method: "POST", data: saveItem })
        .done(() => {
            addressloadItems("");
        })
        .fail(() => {
            alert("Faild to update items.");
        });
    addressElements.inputForm.classList.add('showing_off');
    addressElements.inputForm.classList.remove('showing_on');


}

addressElements.submitBtn.addEventListener("click", insertAddress);

// ページロード時
window.addEventListener("load", () => {

    // 一覧をロードする
    addressloadItems("");
});


// 一覧のロード
function addressloadItems(searchStr) {


    $.ajax("/api/addressapi/getall")
        .done((result: AddressItem[]) => {

            // 取得したToDo一覧を退避
            addressItems = result;
            if (document.getElementsByClassName("address_list").length > 0) {
                let num = document.getElementsByClassName("address_list").length;
                for (let i = 0; i< num ; i++) {
                    document.getElementsByClassName("address_list").item(i).parentNode.removeChild(document.getElementsByClassName("address_list").item(i));

                    i--;
                    num--;
                }
            }

            // リストにToDoを追加していく
            for (let item of addressItems) {

                if (searchStr !== "") {
                    if (item.Name.search(searchStr)) {
                        continue;
                    }
                }

                // li要素を生成
                let listItem = document.createElement("li");
                let column_id = document.createElement("div");
                let column_name = document.createElement("div");
                let column_phoneNum = document.createElement("div");
                let column_email = document.createElement("div");
                let column_company = document.createElement("div");
                let column_memo = document.createElement("div");
                let column_modify = document.createElement("div");
                let column_delete = document.createElement("div");

                column_id.classList.add("showing_off");
                column_id.classList.add("input__column");
                column_name.classList.add("input__column");
                column_phoneNum.classList.add("input__column");
                column_email.classList.add("input__column");
                column_company.classList.add("input__column");
                column_memo.classList.add("input__column");
                column_modify.classList.add("input__column");
                column_delete.classList.add("input__column");


                let span_id = document.createElement("span");
                let span_name = document.createElement("span");
                let span_phoneNum = document.createElement("span");
                let span_email = document.createElement("span");
                let span_company = document.createElement("span");
                let span_memo = document.createElement("span");



                let mody_btn = document.createElement("button");
                let del_btn = document.createElement("button");

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

                mody_btn.addEventListener("click", () => {
                   
                    addressElements.inputForm.classList.add("showing_on");
                    addressElements.inputForm.classList.remove('showing_off');
                    addressElements.submitBtn.innerText = "UPDATE";
                    changeselectedAddressItem(item);
                    addressElements.submitBtn.removeEventListener("click", insertAddress);
                    addressElements.submitBtn.addEventListener("click", updateAddress);

                });

                del_btn.addEventListener("click", () => {
                    changeselectedAddressItem(item);

                    // APIの呼び出し
                    $.ajax(`/api/addressapi/Delete?id=${selectedAddressItem.Id}`, { method: "POST", data: item })
                        .done(result => {
                            changeselectedAddressItem(result);
                            // 完了したら一覧をロードする
                            addressloadItems("");
                        })
                        .fail(() => {
                            alert("Faild to delete address items.");
                        });
                });
            }
        })
        .fail(() => {
            alert("Faild to load todo items.");
        });
}
// 選択項目の変更
function changeselectedAddressItem(item: AddressItem) {

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
    } else {
        addressElements.id["value"] = selectedAddressItem.Id;
        addressElements.name["value"] = selectedAddressItem.Name;
        addressElements.tellnum["value"] = selectedAddressItem.TellNum;
        addressElements.email["value"] = selectedAddressItem.Email;
        addressElements.company["value"] = selectedAddressItem.Company;
        addressElements.memo["value"] = selectedAddressItem.Memo;
    }
}