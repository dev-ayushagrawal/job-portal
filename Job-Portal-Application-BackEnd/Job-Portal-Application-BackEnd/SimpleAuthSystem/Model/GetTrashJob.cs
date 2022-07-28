using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class GetTrashJobRequest
    {
        public int PageNumber { get; set; }
        public int NumberOfRecordPerPage { get; set; }
    }

    public class GetTrashJobResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int CurrentPage { get; set; }
        public double TotalRecords { get; set; }
        public int TotalPage { get; set; }
        public List<GetJob> data { get; set; }

    }

}
