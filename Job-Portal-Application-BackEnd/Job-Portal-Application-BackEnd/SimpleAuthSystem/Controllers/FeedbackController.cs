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
    public class FeedbackController : ControllerBase
    {
        private readonly IJobPortalApplicationDL _jobPortalApplicationDL;
        private readonly ILogger<FeedbackController> _logger;
        public FeedbackController(IJobPortalApplicationDL jobPortalApplicationDL, ILogger<FeedbackController> logger)
        {
            _jobPortalApplicationDL = jobPortalApplicationDL;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> GetFeedbacks(GetFeedbacksRequest request)
        {
            GetFeedbacksResponse response = new GetFeedbacksResponse();
            try
            {
                _logger.LogInformation($"GetFeedbacks Calling In FeedbackController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.GetFeedbacks(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In FeedbackController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> AddFeedback(AddFeedbackRequest request)
        {
            AddFeedbackResponse response = new AddFeedbackResponse();
            try
            {
                _logger.LogInformation($"AddFeedback Calling In FeedbackController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.AddFeedback(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In FeedbackController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteFeedback([FromQuery] int ID)
        {
            DeleteFeedbackResponse response = new DeleteFeedbackResponse();
            try
            {
                _logger.LogInformation($"DeleteFeedback Calling In FeedbackController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.DeleteFeedback(ID);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In FeedbackController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        //GetFeedbacks, AddFeedback, DeleteFeedback
    }
}
