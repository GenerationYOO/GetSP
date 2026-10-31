using PlanningPoker.Exceptions;

namespace PlanningPoker.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionHandlingMiddleware> logger;
        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            { 
                await next(context);
            }
            catch (AppException appEx)
            {
                logger.LogWarning(appEx, "При выполнении запроса произошло бизнес-исключение.");
                context.Response.StatusCode = (int)appEx.TypeStatusCode;
                context.Response.ContentType = "application/json";
                var response = new
                {
                    code = appEx.TypeCode.ToString(),
                    message = appEx.Message
                };
                await context.Response.WriteAsJsonAsync(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "При выполнении запроса произошло необработанное исключение.");
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                var response = new
                {
                    code = "InternalServerError",
                    message = "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже."
                };
                await context.Response.WriteAsJsonAsync(response);
            }
        }
    }
}
