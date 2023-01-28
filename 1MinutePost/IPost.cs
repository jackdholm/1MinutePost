using System;

namespace _1MinutePost
{
    public class IPost
    {
        //public string Username { get; set; }
        public string Text { get; set; }
        public DateTime Created { get; set; }
        public string Username { get; set; }
        public Guid? Pid { get; set; }
        public int VoteCount { get; set; }
        public bool Voted { get; set; }
    }
}
