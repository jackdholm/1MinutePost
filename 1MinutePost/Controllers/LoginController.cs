using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace _1MinutePost.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private mpostContext _context;
        private JwtService _jwtService;

        public LoginController(DbContext context, JwtService jwtService)
        {
            _context = (mpostContext)context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register(IRegister data)
        {
            var user = new User
            {
                Username = data.Name,
                Password = BCrypt.Net.BCrypt.HashPassword(data.Password)
            };

            _context.Users.Add(user);

            return Created("success", user);
        }

        [HttpPost("login")]
        public IActionResult Login(ILogin data)
        {
            User user = _context.Users.FirstOrDefault(u => u.Username == data.Name);

            if (user == null)
                return BadRequest("Invalid Credentials");

            if (!BCrypt.Net.BCrypt.Verify(data.Password, user.Password))
                return BadRequest("Invalid Credentials");

            string jwt = _jwtService.Generate(user.Id);

            Response.Cookies.Append("jwt", jwt, new CookieOptions{ HttpOnly = true });

            return Ok("Success");
        }

        [HttpGet("user")]
        public IActionResult UserInfo()
        {
            try
            {
                string jwt = Request.Cookies["jwt"];
                var token = _jwtService.VerifyUser(jwt);
                int id = Int32.Parse(token.Issuer);

                User user = _context.Users.FirstOrDefault(u => u.Id == id);
                return Ok(new IUser(user));
            }
            catch
            {
                return Unauthorized("Error Validating User");
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok("success");
        }
    }
}
