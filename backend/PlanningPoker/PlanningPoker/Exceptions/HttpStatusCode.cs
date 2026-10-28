namespace PlanningPoker.Exceptions
{
    public enum HttpStatusCode
    {
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        NotFound = 404,
        Conflict = 409,
        InternalServerError = 500,
        UnprocessableEntity = 422
    }
}
