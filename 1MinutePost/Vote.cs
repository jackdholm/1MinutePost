using System;
using System.Collections.Generic;

#nullable disable

namespace _1MinutePost
{
    public partial class Vote
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PostId { get; set; }
        public DateTime? Voted { get; set; }

        public virtual Post Post { get; set; }
        public virtual User User { get; set; }
    }
}
