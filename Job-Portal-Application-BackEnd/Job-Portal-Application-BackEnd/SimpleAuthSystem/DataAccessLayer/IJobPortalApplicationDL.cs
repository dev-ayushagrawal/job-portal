using JobPortalApplication.Model;
using SimpleAuthSystem.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleAuthSystem.DataAccessLayer
{
    public interface IJobPortalApplicationDL
    {
        public Task<SignUpResponse> SignUp(SignUpRequest request);

        public Task<SignInResponse> SignIn(SignInRequest request);

        //Admin

        public Task<GetStreamsResponse> GetStreams();
        public Task<GetFieldsResponse> GetFields(string FieldName);

        public Task<AddJobResponse> AddJob(AddJobRequest request);

        public Task<UpdateJobResponse> UpdateJob(UpdateJobRequest request);

        public Task<DeleteJobResponse> DeleteJob(int JobID);

        public Task<GetJobResponse> GetJob(GetJobRequest request);

        //public Task<GetTrashJobResponse> GetTrashJob(GetTrashJobRequest request);

        public Task<GetApplicationsResponse> GetApplications(GetApplicationsRequest request);

        public Task<RejectApplicationResponse> RejectApplication(int ApplicationID);


        // Feedback

        public Task<GetFeedbacksResponse> GetFeedbacks(GetFeedbacksRequest request);
        public Task<AddFeedbackResponse> AddFeedback(AddFeedbackRequest request);
        public Task<DeleteFeedbackResponse> DeleteFeedback(int ID);

        // User

        public Task<InsertApplicationResponse> InsertApplication(InsertApplicationRequest request);
        public Task<JobFilterResponse> JobFilter(JobFilterRequest request);
        public Task<GetStreamListResponse> GetStreamList();
    }
}
