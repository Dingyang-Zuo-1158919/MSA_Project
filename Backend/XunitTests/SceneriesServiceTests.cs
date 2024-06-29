using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.RepositoryContracts;
using Backend.Repositories;
using Backend.Entities;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Xunit;
using Moq;

namespace Backend.Tests
{
    public class SceneriesServiceTests
    {
        #region AddScenery_ValidRequest
        [Fact]
        public async Task AddScenery_ValidRequest()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            var request = new SceneryAddRequest
            {
                SceneryName = "Test Scenery",
                Country = "Test Country",
                City = "Test City",
                ImageData = new FormFile(new MemoryStream(new byte[0]), 0, 0, "ImageData", "image.jpg"),
                Comment = "Test Comment",
                UserId = 1
            };

            mockSceneriesRepository.Setup(repo => repo.AddScenery(It.IsAny<Scenery>()))
                                   .Returns<Scenery>(scenery =>
                                   {
                                       scenery.SceneryId = Guid.NewGuid();
                                       return Task.FromResult(scenery);
                                   });

            //Act
            var result = await service.AddScenery(request);

            //Assert
            Assert.NotNull(result);
            Assert.NotNull(result.SceneryId);
            Assert.Equal(request.SceneryName, result.SceneryName);
            Assert.Equal(request.Country, result.Country);
            Assert.Equal(request.City, result.City);
        }
        #endregion

        #region AddScenery_NullRequest
        [Fact]
        public async Task AddScenery_NullRequest()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            SceneryAddRequest request = null;

            //Act and Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            {
                await service.AddScenery(request);
            });
        }
        #endregion

        #region AddScenery_InvalidModel
        [Fact]
        public async Task AddScenery_InvalidModel()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            var request = new SceneryAddRequest
            {
                SceneryName = null,
                Country = "Test Country",
                City = "Test City",
                ImageData = new FormFile(new MemoryStream(new byte[0]), 0, 0, "ImageData", "image.jpg"),
                Comment = "Test Comment",
                UserId = 1
            };

            //Act and Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(async () =>
            {
                await service.AddScenery(request);
            });

            //Assert
            Assert.Contains("The SceneryName field is required.", exception.Message);
        }
        #endregion

        #region UpdateScenery_ValidRequest
        [Fact]
        public async Task UpdateScenery_ValidRequest()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            var request = new SceneryUpdateRequest
            {
                SceneryId = Guid.NewGuid(),
                SceneryName = "Updated Scenery",
                Country = "Updated Country",
                City = "Updated City",
                ImageData = new FormFile(new MemoryStream(new byte[0]), 0, 0, "ImageData", "image.jpg"),
                Comment = "Updated Comment"
            };

            mockSceneriesRepository.Setup(repo => repo.GetSceneryBySceneryId(request.SceneryId))
                                   .ReturnsAsync(new Scenery { SceneryId = request.SceneryId });

            mockSceneriesRepository.Setup(repo => repo.UpdateScenery(It.IsAny<Scenery>()))
                                   .Returns<Scenery>(scenery =>
                                   {
                                       scenery.SceneryName = request.SceneryName;
                                       scenery.Country = request.Country;
                                       scenery.City = request.City;
                                       scenery.Comment = request.Comment;
                                       return Task.FromResult(scenery);
                                   });

            //Act
            var result = await service.UpdateScenery(request);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(request.SceneryId, result.SceneryId);
            Assert.Equal(request.SceneryName, result.SceneryName);
            Assert.Equal(request.Country, result.Country);
            Assert.Equal(request.City, result.City);
        }
        #endregion

        #region UpdateScenery_NullRequest
        [Fact]
        public async Task UpdateScenery_NullRequest()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            SceneryUpdateRequest request = null;

            //Act and Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            {
                await service.UpdateScenery(request);
            });
        }
        #endregion

        #region UpdateScenery_InvalidModel
        [Fact]
        public async Task UpdateScenery_InvalidModel()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            var request = new SceneryUpdateRequest
            {
                SceneryId = Guid.NewGuid(),
                SceneryName = null,
                Country = "Updated Country",
                City = "Updated City",
                ImageData = null,
                Comment = "Updated Comment"
            };

            //Act and Assert
            var exception = await Assert.ThrowsAsync<ArgumentException>(async () =>
            {
                await service.UpdateScenery(request);
            });

            //Assert
            Assert.Contains("The SceneryName field is required.", exception.Message);
        }
        #endregion

        #region DeleteScenery_ExistingSceneryId
        [Fact]
        public async Task DeleteScenery_ExistingSceneryId()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            Guid sceneryIdToBeDeleted = Guid.NewGuid();

            mockSceneriesRepository.Setup(repo => repo.GetSceneryBySceneryId(sceneryIdToBeDeleted))
                                   .ReturnsAsync(new Scenery { SceneryId = sceneryIdToBeDeleted });

            mockSceneriesRepository.Setup(repo => repo.DeleteScenery(sceneryIdToBeDeleted))
                                   .ReturnsAsync(true);

            //Act
            var result = await service.DeleteScenery(sceneryIdToBeDeleted);

            //Assert
            Assert.True(result);
        }
        #endregion

        #region DeleteScenery_NonExistingSceneryId
        [Fact]
        public async Task DeleteScenery_NonExistingSceneryId()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            Guid nonExistingSceneryId = Guid.NewGuid();

            mockSceneriesRepository.Setup(repo => repo.GetSceneryBySceneryId(nonExistingSceneryId))
                                   .ReturnsAsync((Scenery)null);

            //Act
            var result = await service.DeleteScenery(nonExistingSceneryId);

            //Assert
            Assert.False(result);
        }
        #endregion

        #region GetSceneryBySceneryId_ExistingSceneryId
        [Fact]
        public async Task GetSceneryBySceneryId_ExistingSceneryId()
        {
            // Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            Guid sceneryId = Guid.NewGuid();
            var expectedScenery = new Scenery
            {
                SceneryId = sceneryId,
                SceneryName = "Test Scenery",
                Country = "Test Country",
                City = "Test City",
                ImageData = new byte[0],
                Comment = "Test Comment",
                UserId = 1
            };

            mockSceneriesRepository.Setup(repo => repo.GetSceneryBySceneryId(sceneryId))
                                   .ReturnsAsync(expectedScenery);

            //Act
            var result = await service.GetSceneryBySceneryId(sceneryId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(sceneryId, result.SceneryId);
            Assert.Equal(expectedScenery.SceneryName, result.SceneryName);
            Assert.Equal(expectedScenery.Country, result.Country);
            Assert.Equal(expectedScenery.City, result.City);
        }
        #endregion

        #region GetSceneryBySceneryId_NonExistingSceneryId
        [Fact]
        public async Task GetSceneryBySceneryId_NonExistingSceneryId()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            Guid nonExistingSceneryId = Guid.NewGuid();

            mockSceneriesRepository.Setup(repo => repo.GetSceneryBySceneryId(nonExistingSceneryId))
                                   .ReturnsAsync((Scenery)null);

            //Act
            var result = await service.GetSceneryBySceneryId(nonExistingSceneryId);

            //Assert
            Assert.Null(result);
        }
        #endregion

        #region GetSceneriesByUserId_ExistingUserId
        [Fact]
        public async Task GetSceneriesByUserId_ExistingUserId()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            int userId = 1;
            var expectedSceneries = new List<Scenery>
            {
                new Scenery
                {
                    SceneryId = Guid.NewGuid(),
                    SceneryName = "Scenery 1",
                    Country = "Country 1",
                    City = "City 1",
                    ImageData = new byte[0],
                    Comment = "Comment 1",
                    UserId = userId
                },
                new Scenery
                {
                    SceneryId = Guid.NewGuid(),
                    SceneryName = "Scenery 2",
                    Country = "Country 2",
                    City = "City 2",
                    ImageData = new byte[0],
                    Comment = "Comment 2",
                    UserId = userId
                }
            };

            mockSceneriesRepository.Setup(repo => repo.GetSceneriesByUserId(userId))
                                   .ReturnsAsync(expectedSceneries);

            //Act
            var result = await service.GetSceneriesByUserId(userId);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(expectedSceneries.Count, result.Count);
            Assert.Equal(expectedSceneries[0].SceneryName, result[0].SceneryName);
            Assert.Equal(expectedSceneries[1].Country, result[1].Country);
        }
        #endregion

        #region GetSceneriesByUserId_NullSceneries
        [Fact]
        public async Task GetSceneriesByUserId_NullSceneries()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            int userId = 1;

            mockSceneriesRepository.Setup(repo => repo.GetSceneriesByUserId(userId))
                                   .ReturnsAsync((List<Scenery>)null);

            //Act
            var result = await service.GetSceneriesByUserId(userId);

            //Assert
            Assert.Null(result);
        }
        #endregion

        #region GetSceneriesByUserId_NonExistingUserId
        [Fact]
        public async Task GetSceneriesByUserId_NonExistingUserId()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            int nonExistingUserId = 10000;

            mockSceneriesRepository.Setup(repo => repo.GetSceneriesByUserId(nonExistingUserId))
                                   .ReturnsAsync((List<Scenery>)null);

            //Act
            var result = await service.GetSceneriesByUserId(nonExistingUserId);

            //Assert
            Assert.Null(result);
        }
        #endregion

        #region GetAllSceneries
        [Fact]
        public async Task GetAllSceneries()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);
            var expectedSceneries = new List<Scenery>
            {
                new Scenery
                {
                    SceneryId = Guid.NewGuid(),
                    SceneryName = "Scenery 1",
                    Country = "Country 1",
                    City = "City 1",
                    ImageData = new byte[0],
                    Comment = "Comment 1",
                    UserId = 1
                },
                new Scenery
                {
                    SceneryId = Guid.NewGuid(),
                    SceneryName = "Scenery 2",
                    Country = "Country 2",
                    City = "City 2",
                    ImageData = new byte[0],
                    Comment = "Comment 2",
                    UserId = 2
                }
            };

            mockSceneriesRepository.Setup(repo => repo.GetAllSceneries())
                                   .ReturnsAsync(expectedSceneries);

            //Act
            var result = await service.GetAllSceneries();

            //Assert
            Assert.NotNull(result);
            Assert.Equal(expectedSceneries.Count, result.Count);
            Assert.Equal(expectedSceneries[0].SceneryName, result[0].SceneryName);
            Assert.Equal(expectedSceneries[1].Country, result[1].Country);
        }
        #endregion

        #region GetAllSceneries_Null
        [Fact]
        public async Task GetAllSceneries_Null()
        {
            //Arrange
            var mockSceneriesRepository = new Mock<ISceneriesRepository>();
            var mockConfiguration = new Mock<IConfiguration>();

            var service = new SceneriesService(mockSceneriesRepository.Object, mockConfiguration.Object);

            mockSceneriesRepository.Setup(repo => repo.GetAllSceneries())
                                   .ReturnsAsync((List<Scenery>)null);

            //Act
            var result = await service.GetAllSceneries();

            //Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
        #endregion
    }
}