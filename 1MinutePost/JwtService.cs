using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _1MinutePost
{
    public class JwtService
    {
        private string _key = "";

        public JwtService(IConfiguration configuration)
        {
            _key = configuration.GetValue<string>("SecretKey");
            if (string.IsNullOrWhiteSpace(_key) || _key == "SET_THIS_IN_PRODUCTION_ENV")
            {
                throw new InvalidOperationException("SecretKey is not configured. Set it in appsettings or environment variable 'SecretKey'.");
            }
        }

        public string Generate(int id)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

            var header = new JwtHeader(credentials);
            var payload = new JwtPayload(id.ToString(), null, null, null, DateTime.Today.AddDays(1));
            var token = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public JwtSecurityToken VerifyUser(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_key);
            tokenHandler.ValidateToken(jwt, new TokenValidationParameters()
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false
            }
            , out SecurityToken securityToken);

            return (JwtSecurityToken)securityToken;
        }
    }
}
