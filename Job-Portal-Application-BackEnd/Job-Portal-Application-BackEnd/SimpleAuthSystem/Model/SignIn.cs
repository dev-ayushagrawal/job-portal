using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleAuthSystem.Model
{
    public class SignInRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }

    public class SignInResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public SignIn data { get; set; }
    }

    public class SignIn
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string InsertionDate { get; set; }
        public string Token { get; set; }
    }
}
