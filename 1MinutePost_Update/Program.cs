using Microsoft.Extensions.Configuration;
using Microsoft.Data.Sqlite;
using System.Reflection;

var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
if (environmentName == null)
    environmentName = "Production";

var configBuilder = new ConfigurationBuilder()
    .SetBasePath(Path.GetDirectoryName(Assembly.GetEntryAssembly()?.Location))
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

var config = configBuilder.Build();

string connectionString = config.GetConnectionString("mpostDB");

await using var connection = new SqliteConnection(connectionString);
await connection.OpenAsync();

await using (var setup = connection.CreateCommand())
{
    setup.CommandText = @"
        PRAGMA foreign_keys=ON;
        PRAGMA busy_timeout=5000;
        PRAGMA journal_mode=WAL;";
    await setup.ExecuteNonQueryAsync();
}

DateTime time = DateTime.UtcNow.AddHours(-1);

await using (var command = connection.CreateCommand())
{
    command.CommandText = "DELETE FROM posts WHERE datetime(created) < datetime(@p)";
    command.Parameters.AddWithValue("@p", time.ToString("o"));
    var deletedCount = await command.ExecuteNonQueryAsync();
    Console.WriteLine($"Deleted {deletedCount} post(s) older than one hour.");
}