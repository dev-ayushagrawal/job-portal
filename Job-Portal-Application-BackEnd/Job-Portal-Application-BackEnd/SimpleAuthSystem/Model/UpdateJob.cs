using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class UpdateJobRequest
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string Stream { get; set; }
        public string Field { get; set; }
        public double Salary { get; set; }
        public string DocumentUrl { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateJobResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}

