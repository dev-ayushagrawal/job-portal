using JobPortalApplication.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SimpleAuthSystem.DataAccessLayer;
using SimpleAuthSystem.Model;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SimpleAuthSystem.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        public readonly IJobPortalApplicationDL _jobPortalApplicationDL;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        public AuthController(IJobPortalApplicationDL jobPortalApplicationDL, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _jobPortalApplicationDL = jobPortalApplicationDL;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> SignUp(SignUpRequest request)
        {
            SignUpResponse response = new SignUpResponse();
            try
            {
                _logger.LogInformation($"SignUp Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.SignUp(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> SignIn(SignInRequest request)
        {
            SignInResponse response = new SignInResponse();
            try
            {
                _logger.LogInformation($"SignIn Calling In AdminController.... Time : {DateTime.Now}");
                response = await _jobPortalApplicationDL.SignIn(request);
                if (response.IsSuccess)
                {
                    string Type = string.Empty;
                    if (response.data.Role.ToLower().Equals("admin"))
                    {
                        Type = "Admin Login";
                    }
                    else
                    {
                        Type = "User Login";
                    }

                    response = await CreateToken(response, Type);
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);

            }

            return Ok(response);
        }

        //Method to create JWT token
        private async Task<SignInResponse> CreateToken(SignInResponse request, string Type)
        {
            try
            {
                var symmetricSecuritykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var signingCreds = new SigningCredentials(symmetricSecuritykey, SecurityAlgorithms.HmacSha256);

                var claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.Role, request.data.Role));
                claims.Add(new Claim("UserName", request.data.UserName.ToString()));
                claims.Add(new Claim("UserId", request.data.UserId.ToString()));
                claims.Add(new Claim("TokenType", Type));

                var token = new JwtSecurityToken(_configuration["Jwt:Issuer"],
                    _configuration["Jwt:Audiance"],
                    claims,
                    expires: DateTime.Now.AddHours(1),
                    signingCredentials: signingCreds);
                    request.data.Token = new JwtSecurityTokenHandler().WriteToken(token);
                    
            }
            catch (Exception ex)
            {
                request.IsSuccess = false;
                request.Message = "Exception Occur In Token Creation : Message : " + ex.Message;
                _logger.LogError("Exception Occur In Token Creation : Message : " , ex.Message);
            }
            return request;
        }
    }
}
