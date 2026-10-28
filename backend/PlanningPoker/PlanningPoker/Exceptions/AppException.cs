namespace PlanningPoker.Exceptions
{
    public abstract class AppException : Exception
    {
        public ErrorCode TypeCode { get; set; }
        public HttpStatusCode TypeStatusCode { get; set; }
        protected AppException(string message, ErrorCode typeCode, HttpStatusCode typeStatusCode) : base(message)
        {
            TypeCode = typeCode;
            TypeStatusCode = typeStatusCode;
        }
    }
}
