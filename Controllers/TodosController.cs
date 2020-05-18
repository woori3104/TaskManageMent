
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TaskManageMent.TodosModel;

namespace TaskManageMent.Controllers
{
    public class TodosController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Todos()
        {
            return View();
        }
        [HttpPost]
        public TodosItem Todos([System.Web.Http.FromBody] TodosItem todosItem)
        {
            var todos = new TodosManager();
            return todos.Add(todosItem);
        }


        public ActionResult TodoDetails()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }


        public ActionResult Diary()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        [HttpPost]
        public DiaryItem Diary([System.Web.Http.FromBody] DiaryItem diaryItem)
        {
            var diarys = new DiaryManager();
            return diarys.Add(diaryItem);
        }


        public ActionResult DiaryDetail()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }


        public ActionResult Calendar()
        {
            return View();
        }

        public ActionResult Address()
        {
            return View();
        }
        [HttpPost]
        public AddressItem Address([System.Web.Http.FromBody] AddressItem addressItem)
        {
            var address = new AddressManager();
            return address.Add(addressItem);
        }

    }
}