using System.Security.Cryptography;
using System.Text;

namespace PlanningPoker.Services.Generate;
public class CodeGeneratorService
{
    private const string PermittedChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    public string GenerateInviteCode(int length = 8)
    {
        var result = new StringBuilder(length);
        for (var i = 0; i < length; i++)
            result.Append(PermittedChars[RandomNumberGenerator.GetInt32(PermittedChars.Length)]);
        return result.ToString();
    }
}

