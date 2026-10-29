namespace PlanningPoker.Exceptions
{
    public class NotFoundException : AppException
    {
        public NotFoundException(string message) : base(message, ErrorCode.UserNotFound, HttpStatusCode.NotFound)
        { }
    }
}
