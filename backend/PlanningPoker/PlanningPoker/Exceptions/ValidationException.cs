namespace PlanningPoker.Exceptions
{
    public class ValidationException : AppException
    {
        public ValidationException(string message) : base(message, ErrorCode.ValidationError, HttpStatusCode.UnprocessableEntity)
        {
        }
    }
}
