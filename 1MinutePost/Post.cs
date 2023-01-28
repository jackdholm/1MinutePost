using System;
using System.Collections.Generic;

#nullable disable

namespace _1MinutePost
{
    public partial class Post
    {
        public Post()
        {
            Votes = new HashSet<Vote>();
        }

        public int Id { get; set; }
        public Guid? Pid { get; set; }
        public int? UserId { get; set; }
        public string Text { get; set; }
        public DateTime? Created { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Vote> Votes { get; set; }
    }
}
