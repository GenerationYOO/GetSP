namespace PlanningPoker.Services.Import
{
    public interface IImportService
    {
        public interface IImportService
        {
            Task<List<Models.SessionTask>> ParseFileAsync(Stream fileStream, string fileName);
        }
    }
}
