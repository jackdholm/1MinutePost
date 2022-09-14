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
        public PostController(DbContext context)
        {
            _context = (mpostContext)context;
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
                    Created = (DateTime)p.Created
                };
                posts.Add(i);
            }
            return posts.ToArray();
            //return new IPost[] { new _1MinutePost.IPost { Username = "Chuck", Text = "First"}, new _1MinutePost.IPost { Username = "Sneed", Text = "Second" },
            //new _1MinutePost.IPost { Username = "Feed", Text = "Seed" }};
        }

        // POST api/<PostController>
        [HttpPost]
        public void Post([FromBody]IPost post)
        {
            Console.WriteLine(post.Text);
            Post p = new Post()
            {
                UserId = 0,
                Text = post.Text,
                Created = DateTime.UtcNow
            };
            User u = _context.Users.FirstOrDefault(u => u.Id == 0);
            u.Posts.Add(p);
            p.User = u;
            _context.Add(p);
            _context.SaveChanges();
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
