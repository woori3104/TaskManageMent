using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TaskManageMent.TodosModel
{
    public class DiaryItem
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Contents { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
    }
}