using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TaskManageMent.TodosModel
{
    public class TodosItem
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string State { get; set; }
        [Required]
        public string Priority { get; set; }
        [Required]
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Memo { get; set; }
        public string UserName { get; set; }
    }
}