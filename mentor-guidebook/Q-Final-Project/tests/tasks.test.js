const request = require('supertest');
const app = require('../app');

describe('Task Endpoints', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Register and login a user for testing
    const userData = {
      username: 'taskuser',
      email: 'tasks@example.com',
      password: 'Password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Task created successfully');
      expect(response.body.task).toHaveProperty('title', taskData.title);
      expect(response.body.task).toHaveProperty('user_id', userId);
    });

    it('should reject task creation without authentication', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
    });

    it('should reject task creation with invalid data', async () => {
      const taskData = {
        title: '', // Empty title should be rejected
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/tasks', () => {
    it('should retrieve user tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    it('should reject task retrieval without authentication', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeAll(async () => {
      // Create a task to update
      const taskData = {
        title: 'Task to Update',
        description: 'This task will be updated'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      taskId = response.body.task.id;
    });

    it('should update a task with valid data', async () => {
      const updateData = {
        title: 'Updated Task Title',
        completed: true
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Task updated successfully');
      expect(response.body.task).toHaveProperty('title', updateData.title);
      expect(response.body.task).toHaveProperty('completed', true);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeAll(async () => {
      // Create a task to delete
      const taskData = {
        title: 'Task to Delete',
        description: 'This task will be deleted'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      taskId = response.body.task.id;
    });

    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Task deleted successfully');
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .delete('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});