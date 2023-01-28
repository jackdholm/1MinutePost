using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;

namespace _1MinutePost.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private mpostContext _context;
        private JwtService _jwtService;

        public VoteController(mpostContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        [HttpGet]
        [Route("GetVotesForPost/{postId}")]
        public int GetVotesForPost(Guid postId)
        {
            int id = _context.Posts.FirstOrDefault(p => p.Pid == postId).Id;
            var total = _context.Votes.Count(v => v.PostId == id);
            return total;
        }

        [HttpPost]
        [Route("VotePost/{postId}")]
        public IActionResult VotePost(Guid postId)
        {
            User user;
            try
            {
                string jwt = Request.Cookies["jwt"];
                var token = _jwtService.VerifyUser(jwt);
                int id = Int32.Parse(token.Issuer);

                user = _context.Users.FirstOrDefault(u => u.Id == id);
                if (user == null)
                    return Unauthorized();
            }
            catch
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error with validating user");
            }

            Post post = _context.Posts.Include(p => p.Votes).FirstOrDefault(p => p.Pid == postId);
            if (post == null)
                return BadRequest("Post does not exist");
            Vote vote = post.Votes.FirstOrDefault(v => v.UserId == user.Id);
            if (vote == null)
            {
                vote = new Vote()
                {
                    UserId = user.Id,
                    Voted = DateTime.Now
                };
                post.Votes.Add(vote);
            }
            else
            {
                post.Votes.Remove(vote);
            }
            _context.SaveChanges();
            return Ok();
        }
    }
}
