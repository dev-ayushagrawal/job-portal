using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class AddJobRequest
    {
/*        Title varchar(255) not null,
	Description varchar(255),
	Field varchar(512),
	Salary int, 
	DocumentUrl varchar(1024),*/
        public string Title { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string Stream { get; set; }
        public string Field { get; set; }
        public double Salary { get; set; }
        public string DocumentUrl { get; set; }
        public bool IsActive { get; set; }
    }

    public class AddJobResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
