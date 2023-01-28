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
    public class PostController : ControllerBase
    {
        private mpostContext _context;
        private JwtService _jwtService;

        public PostController(DbContext context, JwtService jwtService)
        {
            _context = (mpostContext)context;
            _jwtService = jwtService;
        }
        // GET: api/<PostController>
        [HttpGet]
        public IEnumerable<IPost> Get()
        {
            User user;
            try
            {
                string jwt = Request.Cookies["jwt"];
                var token = _jwtService.VerifyUser(jwt);
                int id = Int32.Parse(token.Issuer);

                user = _context.Users.FirstOrDefault(u => u.Id == id);
            }
            catch
            {
                user = _context.Users.First(u => u.Id == 0);
            }

            DateTime dt = DateTime.Now.AddMinutes(-10.0);
            var query = _context.Posts.Include(p => p.Votes)
                .Join(
                    _context.Users,
                    post => post.User.Id,
                    user => user.Id,
                    (post, user) => new
                    {
                        Name = user.Username,
                        Text = post.Text,
                        Created = post.Created,
                        Votes = post.Votes,
                        PostId = post.Pid
                    }
                    ).Where(p => p.Created >= dt.AddMinutes(-p.Votes.Count)).OrderBy(p => p.Created).ToArray();
            List<IPost> posts = new List<IPost>();
            foreach(var p in query)
            {
                IPost i = new IPost
                {
                    Text = p.Text,
                    Created = (DateTime)p.Created,
                    Username = p.Name,
                    Pid = p.PostId,
                    VoteCount = p.Votes.Count,
                    Voted = p.Votes.Any(v => v.UserId == user.Id)
                };
                posts.Add(i);
            }
            return posts.ToArray();
        }

        // POST api/<PostController>
        [HttpPost]
        public IActionResult Post([FromBody]IPost post)
        {
            User user;
            try
            {
                string jwt = Request.Cookies["jwt"];
                var token = _jwtService.VerifyUser(jwt);
                int id = Int32.Parse(token.Issuer);

                user = _context.Users.FirstOrDefault(u => u.Id == id);
            }
            catch
            {
                user = _context.Users.FirstOrDefault(u => u.Id == 0);
            }

            Console.WriteLine(post.Text);
            Post p = new Post()
            {
                UserId = user.Id,
                Text = post.Text,
                Created = DateTime.UtcNow
            };
            user.Posts.Add(p);
            p.User = user;
            _context.Add(p);
            _context.SaveChanges();

            return Ok();
        }
    }
}
