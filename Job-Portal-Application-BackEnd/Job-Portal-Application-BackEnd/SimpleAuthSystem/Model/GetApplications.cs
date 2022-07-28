using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class GetApplicationsRequest
    {
        public int PageNumber { get; set; }
        public int NumberOfRecordPerPage { get; set; }
    }

    public class GetApplicationsResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int CurrentPage { get; set; }
        public double TotalRecords { get; set; }
        public int TotalPage { get; set; }
        public List<GetApplications> data { get; set; }
    }

    public class GetApplications
    {
        public int ApplicationID { get; set; }
        public int JobID { get; set; }
        public string JobTitle { get; set; }
        public string ApplicantName { get; set; }
        public string Contact { get; set; }
        public string EmailID { get; set; }
        public string Address { get; set; }
        public string WorkExperience { get; set; }
        public string DateOfBirth { get; set; }
        public string PassingYear { get; set; }
        public string CollegeName { get; set; }
        public string Degree { get; set; }
        public string CurrentStatus { get; set; }
        public string Skill { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public int PinCode { get; set; }
        public double Standerd10_Percentage { get; set; }
        public double Standerd12_Percentage { get; set; }
        public double Graduation_Aggregation { get; set; }
        public string StreamName { get; set; }
    }
}
