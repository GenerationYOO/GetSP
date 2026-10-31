namespace PlanningPoker.Exceptions
{
    public class ConflictException : AppException
    {
        public ConflictException(string message): base(message, ErrorCode.EmailAlreadyExists, HttpStatusCode.Conflict)
        { 
        }
    }
}
