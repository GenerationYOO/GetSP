namespace PlanningPoker.Exceptions
{
    public class UnauthorizedException : AppException
    {
        public UnauthorizedException(string message) : base(message, ErrorCode.InvalidCredentials, HttpStatusCode.Unauthorized)
        { }
    }
}
