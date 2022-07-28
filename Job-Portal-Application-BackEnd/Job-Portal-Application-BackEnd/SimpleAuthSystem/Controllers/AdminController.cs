using JobPortalApplication.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SimpleAuthSystem.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalApplication.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
    public class AdminController : ControllerBase
    {
        private readonly IJobPortalApplicationDL _jobPortalApplicationDL;
        private readonly ILogger<AdminController> _logger;
        public AdminController(IJobPortalApplicationDL jobPortalApplicationDL, ILogger<AdminController> logger)
        {
            _jobPortalApplicationDL = jobPortalApplicationDL;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> GetStreams()
        {
            GetStreamsResponse response = new GetStreamsResponse();
            try
            {
                _logger.LogInformation($"GetStreams Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.GetStreams();
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs In AdminController : Message : "+ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult> GetFields([FromQuery] string FieldName)
        {

            GetFieldsResponse response = new GetFieldsResponse();
            try
            {
                _logger.LogInformation($"GetFields Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.GetFields(FieldName);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> AddJob(AddJobRequest request)
        {
            AddJobResponse response = new AddJobResponse();
            try
            {
                _logger.LogInformation($"AddJob Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.AddJob(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> UpdateJob(UpdateJobRequest request)
        {
            UpdateJobResponse response = new UpdateJobResponse();
            try
            {
                _logger.LogInformation($"UpdateJob Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.UpdateJob(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteJob([FromQuery] int JobID)
        {
            DeleteJobResponse response = new DeleteJobResponse();
            try
            {
                _logger.LogInformation($"DeleteJob Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.DeleteJob(JobID);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }


        //GetJob
        [HttpPost]
        public async Task<ActionResult> GetJob(GetJobRequest request)
        {
            GetJobResponse response = new GetJobResponse();
            try
            {
                _logger.LogInformation($"GetJob Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.GetJob(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }


        [HttpPost]
        public async Task<ActionResult> GetApplications(GetApplicationsRequest request)
        {
            GetApplicationsResponse response = new GetApplicationsResponse();
            try
            {
                _logger.LogInformation($"GetApplications Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.GetApplications(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpDelete]
        public async Task<ActionResult> RejectApplication([FromQuery] int JobID)
        {
            RejectApplicationResponse response = new RejectApplicationResponse();
            try
            {
                _logger.LogInformation($"RejectApplication Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.RejectApplication(JobID);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }


    }
}
