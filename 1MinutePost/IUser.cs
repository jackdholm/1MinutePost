using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace _1MinutePost
{
    public class IUser
    {
        public IUser(User user)
        {
            Pid = user.Pid;
            Username = user.Username;
        }

        public Guid? Pid { get; set; }
        public string Username { get; set; }
    }
}
