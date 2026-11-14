using Microsoft.EntityFrameworkCore;
using PlanningPoker.Data;
using PlanningPoker.Services.Auth;
using PlanningPoker.Contracts.Auth;
using PlanningPoker.Exceptions;
using PlanningPoker.Models;
using NUnit.Framework;
using Moq;

namespace PlanningPoker.Tests.Services
{
    [TestFixture]
    public class AuthServiceTests
    {
        private AppDbContext dbContext;
        private Mock<IJwtTokenGenerator> jwtGeneratorMock;
        private AuthService authService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            dbContext = new AppDbContext(options);

            jwtGeneratorMock = new Mock<IJwtTokenGenerator>();
            jwtGeneratorMock.Setup(x => x.GenerateToken(It.IsAny<User>())).Returns("fake-access-token");
            jwtGeneratorMock.Setup(x => x.GenerateRefreshToken()).Returns("fake-refresh-token");

            authService = new AuthService(dbContext, jwtGeneratorMock.Object);
        }

        [Test]
        public async Task RegisterAsync_ShouldCreateUser_WhenDataIsValid()
        {
            var request = new RegisterRequest
            {
                Username = "Тестовый",
                Email = "test@example.com",
                Password = "Password123!"
            };

            var result = await authService.RegisterAsync(request);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.AccessToken, Is.EqualTo("fake-access-token"));

            var userInDb = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
            Assert.That(userInDb, Is.Not.Null);
            Assert.That(userInDb.Username, Is.EqualTo("Тестовый"));
            Assert.That(userInDb.PasswordHash, Is.Not.EqualTo("Password123!"));
        }

        [Test]
        public async Task RegisterAsync_ShouldThrowConflictException_WhenEmailAlreadyExists()
        {
            var request = new RegisterRequest { Username = "Первый", Email = "test@example.com", Password = "Password123!" };
            await authService.RegisterAsync(request);

            var duplicateRequest = new RegisterRequest { Username = "Второй", Email = "test@example.com", Password = "Password123!" };

            Assert.ThrowsAsync<ConflictException>(async () => await authService.RegisterAsync(duplicateRequest));
        }

        [Test]
        public async Task LoginAsync_ShouldReturnTokens_WhenCredentialsAreValid()
        {
            var request = new RegisterRequest { Username = "Юзер", Email = "login@example.com", Password = "Password123!" };
            await authService.RegisterAsync(request);

            var loginRequest = new LoginRequest { Email = "login@example.com", Password = "Password123!" };

            var result = await authService.LoginAsync(loginRequest);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.AccessToken, Is.EqualTo("fake-access-token"));
        }

        [Test]
        public async Task LoginAsync_ShouldThrowUnauthorizedException_WhenPasswordIsWrong()
        {
            var request = new RegisterRequest { Username = "Юзер", Email = "wrong@example.com", Password = "Password123!" };
            await authService.RegisterAsync(request);

            var loginRequest = new LoginRequest { Email = "wrong@example.com", Password = "WrongPassword!" };

            Assert.ThrowsAsync<UnauthorizedException>(async () => await authService.LoginAsync(loginRequest));
        }
    }
}