using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class InsertApplicationRequest
    {
        [Required]
        public int JobID { get; set; }
        [Required]
        public string JobTitle { get; set; }
        [Required]
        public string ApplicantName { get; set; }
        public string Contact{ get; set; }
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
        [Required]
        public double Standerd10_Percentage { get; set; }
        [Required]
        public double Standerd12_Percentage { get; set; }
        [Required]
        public double Graduation_Aggregation { get; set; }
        [Required]
        public string StreamName { get; set; }
    }

    public class InsertApplicationResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
