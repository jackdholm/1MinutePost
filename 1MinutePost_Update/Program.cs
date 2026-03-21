using Microsoft.Extensions.Configuration;
using Microsoft.Data.Sqlite;
using System.Reflection;

var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
if (environmentName == null)
    environmentName = "Production";

var configBuilder = new ConfigurationBuilder()
    .SetBasePath(Path.GetDirectoryName(Assembly.GetEntryAssembly()?.Location) ?? Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

var config = configBuilder.Build();

string? connectionString = config.GetConnectionString("mpostDB");
if (connectionString == null)
{
    Console.WriteLine("Error: Connection string 'mpostDB' not found in configuration.");
    return;
}

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

await using (var command = connection.CreateCommand())
{
    command.CommandText = "DELETE FROM posts";
    var deletedCount = await command.ExecuteNonQueryAsync();
    if (deletedCount > 0)
        Console.WriteLine(deletedCount > 1 ? $"Deleted {deletedCount} posts" : $"Deleted {deletedCount} post");
}