using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Reflection;

var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
if (environmentName == null)
    environmentName = "Production";
var config = new ConfigurationBuilder()
                 .SetBasePath(Path.GetDirectoryName(Assembly.GetEntryAssembly()?.Location))
                 .AddJsonFile($"appsettings.{environmentName}.json", optional: false, reloadOnChange: true)
                 .AddUserSecrets<Program>()
                 .Build();

string connectionString = config.GetConnectionString("mpostDB");

await using var connection   = new NpgsqlConnection(connectionString);
await connection.OpenAsync();

DateTime time = DateTime.UtcNow.AddHours(-1);

await using (var command = new NpgsqlCommand("DELETE FROM posts WHERE created < @p", connection))
{
    command.Parameters.AddWithValue("p", time);
    await command.ExecuteNonQueryAsync();
}