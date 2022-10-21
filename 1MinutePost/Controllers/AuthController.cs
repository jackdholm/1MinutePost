using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace _1MinutePost.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private mpostContext _context;
        private JwtService _jwtService;
        private IConfiguration _configuration;

        public AuthController(DbContext context, JwtService jwtService, IConfiguration configuration)
        {
            _context = (mpostContext)context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register(IRegister data)
        {
            var user = new User
            {
                Username = data.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(data.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();


            return Created("success", user);
        }

        [HttpPost("login")]
        public IActionResult Login(ILogin data)
        {
            User user = _context.Users.FirstOrDefault(u => u.Username == data.Username  );

            if (user == null)
                return BadRequest("Invalid Credentials");

            if (!BCrypt.Net.BCrypt.Verify(data.Password, user.Password))
                return BadRequest("Invalid Credentials");
            
            string jwt;
            try
            {
                jwt = _jwtService.Generate(user.Id);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

            try
            {
                Response.Cookies.Append("jwt", jwt, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Strict });
            }
            catch
            {
                return StatusCode(500, new { message = "Append Cookies Failed"});
            }

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
