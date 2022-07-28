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
    public class UserController : ControllerBase
    {
        private readonly IJobPortalApplicationDL _jobPortalApplicationDL;
        private readonly ILogger<UserController> _logger;
        public UserController(IJobPortalApplicationDL jobPortalApplicationDL, ILogger<UserController> logger)
        {
            _jobPortalApplicationDL = jobPortalApplicationDL;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> InsertApplication(InsertApplicationRequest request)
        {
            InsertApplicationResponse response = new InsertApplicationResponse();
            try
            {
                _logger.LogInformation($"InsertApplication Calling In UserController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.InsertApplication(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In UserController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> JobFilter(JobFilterRequest request)
        {
            JobFilterResponse response = new JobFilterResponse();
            try
            {
                _logger.LogInformation($"JobFilter Calling In UserController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.JobFilter(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In UserController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult> GetStreamList()
        {
            GetStreamListResponse response = new GetStreamListResponse();
            try
            {
                _logger.LogInformation($"GetStreamList Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.GetStreamList();
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs In AdminController : Message : " + ex.Message;
                _logger.LogError("Exception Occurs In AdminController : Message : ", ex.Message);
            }

            return Ok(response);
        }

    }
}
