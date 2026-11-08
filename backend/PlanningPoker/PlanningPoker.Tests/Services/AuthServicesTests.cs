using Microsoft.EntityFrameworkCore;
using PlanningPoker.Data;
using PlanningPoker.Services.Auth;
using PlanningPoker.Contracts.Auth;
using PlanningPoker.Exceptions;
using PlanningPoker.Models;
using Xunit;
using Moq;

namespace PlanningPoker.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly AppDbContext dbContext;
        private readonly Mock<IJwtTokenGenerator> jwtGeneratorMock;
        private readonly AuthService authService;

        public AuthServiceTests()
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

        [Fact]
        public async Task RegisterAsync_ShouldCreateUser_WhenDataIsValid()
        {
            var request = new RegisterRequest
            {
                Username = "Тестовый",
                Email = "test@example.com",
                Password = "Password123!"
            };

            var result = await authService.RegisterAsync(request);

            Assert.NotNull(result);
            Assert.Equal("fake-access-token", result.AccessToken);

            var userInDb = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
            Assert.NotNull(userInDb);
            Assert.Equal("Тестовый", userInDb.Username);
            Assert.NotEqual("Password123!", userInDb.PasswordHash); 
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrowConflictException_WhenEmailAlreadyExists()
        {
            var request = new RegisterRequest { Username = "Первый", Email = "test@example.com", Password = "Password123!" };
            await authService.RegisterAsync(request); 

            var duplicateRequest = new RegisterRequest { Username = "Второй", Email = "test@example.com", Password = "Password123!" };

            await Assert.ThrowsAsync<ConflictException>(() => authService.RegisterAsync(duplicateRequest));
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnTokens_WhenCredentialsAreValid()
        {
            var request = new RegisterRequest { Username = "Юзер", Email = "login@example.com", Password = "Password123!" };
            await authService.RegisterAsync(request);

            var loginRequest = new LoginRequest { Email = "login@example.com", Password = "Password123!" };

            var result = await authService.LoginAsync(loginRequest);

            Assert.NotNull(result);
            Assert.Equal("fake-access-token", result.AccessToken);
        }

        [Fact]
        public async Task LoginAsync_ShouldThrowUnauthorizedException_WhenPasswordIsWrong()
        {
            var request = new RegisterRequest { Username = "Юзер", Email = "wrong@example.com", Password = "Password123!" };
            await authService.RegisterAsync(request);

            var loginRequest = new LoginRequest { Email = "wrong@example.com", Password = "WrongPassword!" };

            await Assert.ThrowsAsync<UnauthorizedException>(() => authService.LoginAsync(loginRequest));
        }
    }
}