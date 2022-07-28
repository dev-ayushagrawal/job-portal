using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class GetFeedbacksRequest
    {
        public int PageNumber { get; set; }
        public int NumberOfRecordPerPage { get; set; }
    }

    public class GetFeedbacksResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int CurrentPage { get; set; }
        public double TotalRecords { get; set; }
        public int TotalPage { get; set; }
        public List<GetFeedbacks> data { get; set; }
    }

    public class GetFeedbacks
    {
        public int FeedbackID { get; set; } 
        public string FeedBack { get; set; }
    }
}
