using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{

    public class InsertFeedbackRequest
    {
        public string FeedBack { get; set; }
    }

    public class InsertFeedbackResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class GetFeedbackRequest
    {
        public int PageNumber { get; set; }
        public int NumberOfRecordPerPage { get; set; }
    }

    public class GetFeedbackResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int CurrentPage { get; set; }
        public double TotalRecords { get; set; }
        public int TotalPage { get; set; }
        public List<GetFeedback> data { get; set; }
    }

    public class GetFeedback
    {
        public int FeedbackID { get; set; }
        public string FeedBack { get; set; }
    }
}
