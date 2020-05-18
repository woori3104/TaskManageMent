using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TaskManageMent.TodosModel
{
    public class AddressItem
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string TellNum { get; set; }

        public string Email { get; set; }
        public string Company { get; set; }
        public string Memo { get; set; }
        public string UserName { get; set; }
    }
}