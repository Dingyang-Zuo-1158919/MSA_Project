using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.RepositoryContracts;
using Backend.Repositories;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Xunit;
using Moq;

namespace Backend.Tests
{
    public class LoginTokenServiceTests
    {
        private Mock<IConfiguration> GetConfigurationMock()
        {
            var configuration = new Mock<IConfiguration>();
            configuration.SetupGet(x => x["JwtSettings:SecretKey"]).Returns("a_32_byte_secret_key_for_testing123456");
            configuration.SetupGet(x => x["JwtSettings:ExpirationMinutes"]).Returns("30");
            configuration.SetupGet(x => x["JwtSettings:Issuer"]).Returns("my_issuer");
            configuration.SetupGet(x => x["JwtSettings:Audience"]).Returns("my_audience");
            return configuration;
        }

        private Mock<UserManager<User>> GetUserManagerMock()
        {
            var store = new Mock<IUserStore<User>>();
            return new Mock<UserManager<User>>(store.Object,null, null, null, null, null, null, null, null);
        }

        #region GenerateTokenAsync_ValidUser
        [Fact]
        public async Task GenerateTokenAsync_ValidUser()
        {
            //Arrange
            var user = new User { Id = 1, UserName = "testuser" };
            var configuration = GetConfigurationMock().Object;
            var userManagerMock = GetUserManagerMock();
            var service = new LoginTokenService(configuration, userManagerMock.Object);

            //Act
            var token = await service.GenerateTokenAsync(user);

            //Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }
        #endregion

        #region GenerateTokenAsync_NullUser
        [Fact]
        public async Task GenerateTokenAsync_NullUser()
        {
            //Arrange
            User user = null;
            var configuration = GetConfigurationMock().Object;
            var userManagerMock = GetUserManagerMock();
            var service = new LoginTokenService(configuration, userManagerMock.Object);

            //Act and Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            {
                await service.GenerateTokenAsync(user);
            });
        }
        #endregion
    }
}