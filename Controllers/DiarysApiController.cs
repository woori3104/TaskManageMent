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
    public class DiarysApiController : ApiController
    {
        [HttpGet]
        public DataTable GetAllDataTable()
        {
            var m = new DiaryManager();
            return m.GetAllDataTable();
        }

        [HttpGet]
        public IEnumerable<DiaryItem> GetAll()
        {
            var diary = new DiaryManager();
            var result = diary.GetAll();

            return result;
        }


        [HttpGet]
        public DiaryItem Get(string id)
        {
            var m = new DiaryManager();
            return m.Get(id);
        }

        [HttpGet]
        public IEnumerable<DiaryItem> GetDiaryTitle(string date)
        {
            var m = new DiaryManager();
            return m.GetDiaryTitle(date);
        }

        [HttpPost]
        public DiaryItem Update([FromBody] DiaryItem item)
        {
            var m = new DiaryManager();
            return m.Update(item);
        }

        [HttpPost]
        public void Delete([FromBody] DiaryItem item)
        {
            var m = new DiaryManager();
            m.Delete(item.Id);
        }


    }
}
