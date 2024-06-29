using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.RepositoryContracts;
using Backend.Repositories;
using Backend.ServiceContracts;
using Backend.ServiceContracts.DTO;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Xunit;
using Moq;

namespace Backend.Tests
{
    public class CollectionsServiceTests
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly CollectionsService _collectionsService;

        public CollectionsServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _dbContext = new ApplicationDbContext(options);
            _collectionsService = new CollectionsService(_dbContext);
        }

        #region AddToCollection_Success
        [Fact]
        public async Task AddToCollection_Success()
        {
            // Arrange
            var userId = 1;
            var sceneryId = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            _dbContext.Sceneries.Add(new Scenery
            {
                SceneryId = sceneryId,
                SceneryName = "Test Scenery",
                Country = "Test Country",
                City = "Test City",
                ImageData = new byte[0],
                Comment = "Test Comment",
                UserId = userId
            });
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _collectionsService.AddToCollection(userId, sceneryId);

            // Assert
            Assert.True(result);
            var collection = await _dbContext.Collections.FirstOrDefaultAsync(c => c.UserId == userId && c.SceneryId == sceneryId);
            Assert.NotNull(collection);
        }
        #endregion

        #region AddToCollection_NullInput
        [Fact]
        public async Task AddToCollection_NullInput()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _collectionsService.AddToCollection(default(int), Guid.NewGuid()));
        }
        #endregion

        #region AddToCollection_UserNotFound
        [Fact]
        public async Task AddToCollection_UserNotFound()
        {
            // Arrange
            var userId = 11;
            var sceneryId = Guid.NewGuid();

            _dbContext.Sceneries.Add(new Scenery
            {
                SceneryId = sceneryId,
                SceneryName = "Test Scenery",
                Country = "Test Country",
                City = "Test City",
                ImageData = new byte[0],
                Comment = "Test Comment",
                UserId = userId
            });
            await _dbContext.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<ApplicationException>(() => _collectionsService.AddToCollection(userId, sceneryId));
        }
        #endregion

        #region AddToCollection_SceneryNotFound
        [Fact]
        public async Task AddToCollection_SceneryNotFound()
        {
            // Arrange
            var userId = 111;
            var sceneryId = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            await _dbContext.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<ApplicationException>(() => _collectionsService.AddToCollection(userId, sceneryId));
        }
        #endregion

        #region AddToCollection_AlreadyExists
        [Fact]
        public async Task AddToCollection_AlreadyExists()
        {
            // Arrange
            var userId = 1111;
            var sceneryId = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            _dbContext.Sceneries.Add(new Scenery
            {
                SceneryId = sceneryId,
                SceneryName = "Test Scenery",
                Country = "Test Country",
                City = "Test City",
                ImageData = new byte[0],
                Comment = "Test Comment",
                UserId = userId
            });
            _dbContext.Collections.Add(new Collection { UserId = userId, SceneryId = sceneryId });
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _collectionsService.AddToCollection(userId, sceneryId);

            // Assert
            Assert.False(result);
        }
        #endregion

        #region RemoveFromCollection_Success
        [Fact]
        public async Task RemoveFromCollection_Success()
        {
            // Arrange
            var userId = 2;
            var sceneryId = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            _dbContext.Sceneries.Add(new Scenery
            {
                SceneryId = sceneryId,
                SceneryName = "Test Scenery",
                Country = "Test Country",
                City = "Test City",
                ImageData = new byte[0],
                Comment = "Test Comment",
                UserId = userId
            });
            _dbContext.Collections.Add(new Collection
            {
                UserId = userId,
                SceneryId = sceneryId
            });
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _collectionsService.RemoveFromCollection(userId, sceneryId);

            // Assert
            Assert.True(result);
            var collection = await _dbContext.Collections.FirstOrDefaultAsync(c => c.UserId == userId && c.SceneryId == sceneryId);
            Assert.Null(collection);
        }
        #endregion

        #region RemoveFromCollection_NullUserIdOrSceneryId
        [Fact]
        public async Task RemoveFromCollection_NullUserIdOrSceneryId()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _collectionsService.RemoveFromCollection(default(int), Guid.NewGuid()));
        }
        #endregion

        #region RemoveFromCollection_NotFound
        [Fact]
        public async Task RemoveFromCollection_NotFound()
        {
            // Arrange
            var userId = 22;
            var sceneryId = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _collectionsService.RemoveFromCollection(userId, sceneryId);

            // Assert
            Assert.False(result);
        }
        #endregion

        #region GetUserCollection_Success
        [Fact]
        public async Task GetUserCollection_Success()
        {
            // Arrange
            var userId = 3;
            var sceneryId1 = Guid.NewGuid();
            var sceneryId2 = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            _dbContext.Sceneries.Add(new Scenery
            {
                SceneryId = sceneryId1,
                SceneryName = "Test Scenery 1",
                Country = "Test Country 1",
                City = "Test City 1",
                ImageData = new byte[0],
                Comment = "Test Comment 1",
                UserId = userId
            });
            _dbContext.Sceneries.Add(new Scenery
            {
                SceneryId = sceneryId2,
                SceneryName = "Test Scenery 2",
                Country = "Test Country 2",
                City = "Test City 2",
                ImageData = new byte[0],
                Comment = "Test Comment 2",
                UserId = userId
            });
            _dbContext.Collections.Add(new Collection { UserId = userId, SceneryId = sceneryId1 });
            _dbContext.Collections.Add(new Collection { UserId = userId, SceneryId = sceneryId2 });
            await _dbContext.SaveChangesAsync();

            // Act
            var sceneries = await _collectionsService.GetUserCollection(userId);

            // Assert
            Assert.Equal(2, sceneries.Count);
        }
        #endregion

        #region GetUserCollection_NullUserId
        [Fact]
        public async Task GetUserCollection_NullUserId()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _collectionsService.GetUserCollection(default(int)));
        }
        #endregion

        #region GetUserCollection_UserNotFound
        [Fact]
        public async Task GetUserCollection_UserNotFound()
        {
            // Arrange
            var userId = 33;

            // Act
            var sceneries = await _collectionsService.GetUserCollection(userId);

            // Assert
            Assert.Empty(sceneries);
        }
        #endregion

        #region GetCollectionById_Success
        [Fact]
        public async Task GetCollectionById_Success()
        {
            // Arrange
            var userId = 4;
            var sceneryId = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            _dbContext.Sceneries.Add(new Scenery
            {
                SceneryId = sceneryId,
                SceneryName = "Test Scenery",
                Country = "Test Country",
                City = "Test City",
                ImageData = new byte[0],
                Comment = "Test Comment",
                UserId = userId
            });
            _dbContext.Collections.Add(new Collection { UserId = userId, SceneryId = sceneryId });
            await _dbContext.SaveChangesAsync();

            // Act
            var collection = await _collectionsService.GetCollectionById(userId, sceneryId);

            // Assert
            Assert.NotNull(collection);
        }
        #endregion

        #region GetCollectionById_NotFound
        [Fact]
        public async Task GetCollectionById_NotFound()
        {
            // Arrange
            var userId = 44;
            var sceneryId = Guid.NewGuid();

            _dbContext.Users.Add(new User { Id = userId });
            await _dbContext.SaveChangesAsync();

            // Act
            var collection = await _collectionsService.GetCollectionById(userId, sceneryId);

            // Assert
            Assert.Null(collection);
        }
        #endregion

    }
}