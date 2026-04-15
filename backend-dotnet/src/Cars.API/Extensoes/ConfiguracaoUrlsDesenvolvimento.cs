using System.Net.NetworkInformation;

namespace Cars.Api.Extensions;

public sealed class DevelopmentUrlOptions
{
    public string? HttpUrl { get; init; }
    public string? HttpsUrl { get; init; }
}

public static class DevelopmentUrlConfiguration
{
    public static DevelopmentUrlOptions ConfigureDevelopmentUrls(this WebApplicationBuilder builder)
    {
        var configuredUrls = builder.Configuration["ASPNETCORE_URLS"] ?? builder.Configuration["urls"];
        var urls = SplitUrls(configuredUrls);

        if (urls.Count == 0)
        {
            return new DevelopmentUrlOptions();
        }

        var selectedUrls = urls
            .Select(FindAvailableUrl)
            .ToArray();

        builder.WebHost.UseUrls(string.Join(';', selectedUrls));

        return new DevelopmentUrlOptions
        {
            HttpUrl = selectedUrls.FirstOrDefault(x => x.StartsWith("http://", StringComparison.OrdinalIgnoreCase)),
            HttpsUrl = selectedUrls.FirstOrDefault(x => x.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        };
    }

    private static List<string> SplitUrls(string? urls) =>
        (urls ?? string.Empty)
            .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

    private static string FindAvailableUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return url;
        }

        if (!IsPortOccupied(uri.Port))
        {
            return url;
        }

        for (var port = uri.Port + 1; port <= uri.Port + 100; port++)
        {
            if (!IsPortOccupied(port))
            {
                var builder = new UriBuilder(uri) { Port = port };
                return builder.Uri.ToString().TrimEnd('/');
            }
        }

        return url;
    }

    private static bool IsPortOccupied(int port) =>
        IPGlobalProperties.GetIPGlobalProperties()
            .GetActiveTcpListeners()
            .Any(endpoint => endpoint.Port == port);
}
