using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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
            DateTime dt = DateTime.Now.AddMinutes(-10.0);
            var query = _context.Posts
                .Join(
                    _context.Users,
                    post => post.User.Id,
                    user => user.Id,
                    (post, user) => new
                    {
                        Name = user.Username,
                        Text = post.Text,
                        Created = post.Created
                    }
                    ).Where(p => p.Created >= dt).OrderBy(p => p.Created).ToArray();
            List<IPost> posts = new List<IPost>();
            foreach(var p in query)
            {
                IPost i = new IPost
                {
                    Text = p.Text,
                    Created = (DateTime)p.Created,
                    Username = p.Name
                };
                posts.Add(i);
            }
            return posts.ToArray();
            //return new IPost[] { new _1MinutePost.IPost { Username = "Chuck", Text = "First"}, new _1MinutePost.IPost { Username = "Sneed", Text = "Second" },
            //new _1MinutePost.IPost { Username = "Feed", Text = "Seed" }};
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
        
        // PUT api/<PostController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<PostController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
