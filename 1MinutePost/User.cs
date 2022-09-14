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
        }

        public int Id { get; set; }
        public Guid? Pid { get; set; }
        public string Username { get; set; }

        public virtual ICollection<Post> Posts { get; set; }
    }
}
