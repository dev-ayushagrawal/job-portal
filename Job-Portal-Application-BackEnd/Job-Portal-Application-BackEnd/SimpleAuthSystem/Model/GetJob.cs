using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class GetJobRequest
    {
        public int PageNumber { get; set; }
        public int NumberOfRecordPerPage { get; set; }
    }

    public class GetJobResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int CurrentPage { get; set; }
        public double TotalRecords { get; set; }
        public int TotalPage { get; set; }
        public List<GetJob> data { get; set; }
    }

    public class GetJob
    {
        //
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string Stream { get; set; }
        public string Field { get; set; }
        public int Salary { get; set; }
        public string DocumentUrl { get; set; }
        public bool IsActive { get; set; }
    }
}
