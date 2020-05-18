using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaskManageMent.TodosModel;

namespace TaskManageMent.Controllers
{
    public class TodosApiController : ApiController
    {
        [HttpGet]
        public DataTable GetAllDataTable()
        {
            var m = new TodosManager();
            return m.GetAllDataTable();
        }

        [HttpGet]
        public IEnumerable<TodosItem> GetAll()
        {
            var todos = new TodosManager();
            var result = todos.GetAll();

            return result;
        }


        [HttpGet]
        public TodosItem Get(string id)
        {
            var m = new TodosManager();
            return m.Get(id);
        }

        [HttpPost]
        public TodosItem Update([FromBody] TodosItem item)
        {
            var m = new TodosManager();
            return m.Update(item);
        }

        [HttpPost]
        public void Delete([FromBody] TodosItem item)
        {
            var m = new TodosManager();
            m.Delete(item.Id);
        }

        [HttpPost]
        public void Clear()
        {
            var m = new TodosManager();
            m.Clear();
        }
    }
}
