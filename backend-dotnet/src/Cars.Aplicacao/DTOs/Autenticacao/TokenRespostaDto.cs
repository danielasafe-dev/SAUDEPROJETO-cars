using System.Text.Json.Serialization;
using Cars.Application.DTOs.Users;

namespace Cars.Application.DTOs.Auth;

public sealed class TokenResponseDto
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; init; } = string.Empty;

    [JsonPropertyName("token_type")]
    public string TokenType { get; init; } = "bearer";

    [JsonPropertyName("user")]
    public UserResponseDto User { get; init; } = null!;
}
