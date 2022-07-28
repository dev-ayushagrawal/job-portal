using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Model
{
    public class GetFieldsResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<GetFields> data { get; set; }
    }

    public class GetFields
    {
        public int FieldID { get; set; }
        //public string FieldStream { get; set; }
        public string FieldName { get; set; }
    }

    public class GetStreamsResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<GetStreams> data { get; set; }
        public List<GetCompanies> data1 { get; set; }
    }

    public class GetStreams
    {
        public string StreamName { get; set; }
    }

    public class GetCompanies
    {
        public string Company { get; set; }
    }

    public class GetStreamListResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public List<GetStreams> data { get; set; }
    }
}
