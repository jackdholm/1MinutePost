using System;
using System.Collections.Generic;

#nullable disable

namespace _1MinutePost
{
    public partial class User
    {
        public User()
        {
            Posts = new HashSet<Post>();
            Votes = new HashSet<Vote>();
        }

        public int Id { get; set; }
        public Guid? Pid { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public virtual ICollection<Post> Posts { get; set; }
        public virtual ICollection<Vote> Votes { get; set; }
    }
}
