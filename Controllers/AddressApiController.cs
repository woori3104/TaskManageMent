
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
    public class AddressApiController : ApiController
    {
        [HttpGet]
        public DataTable GetAllDataTable()
        {
            var m = new AddressManager();
            return m.GetAllDataTable();
        }

        [HttpGet]
        public IEnumerable<AddressItem> GetAll()
        {
            var address = new AddressManager();
            var result = address.GetAll();
            return result;
        }


        [HttpGet]
        public AddressItem Get(string id)
        {
            var m = new AddressManager();
            return m.Get(id);
        }

        [HttpPost]
        public AddressItem Update([FromBody] AddressItem item)
        {
            var m = new AddressManager();
            return m.Update(item);
        }

        [HttpPost]
        public void Delete([FromBody] AddressItem item)
        {
            var m = new AddressManager();
            m.Delete(item.Id);
        }

        [HttpPost]
        public void Clear()
        {
            var m = new AddressManager();
            m.Clear();
        }
    }
}
