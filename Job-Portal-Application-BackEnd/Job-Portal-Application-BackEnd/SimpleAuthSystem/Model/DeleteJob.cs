using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class DeleteJobResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class RejectApplicationResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
