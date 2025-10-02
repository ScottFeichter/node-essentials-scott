const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding database...');

    // Create users with different roles
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const manager = await prisma.user.upsert({
      where: { email: 'manager@example.com' },
      update: {},
      create: {
        email: 'manager@example.com',
        name: 'Manager User',
        hashedPassword,
        roles: 'user,manager'
      }
    });

    const user1 = await prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        name: 'Regular User 1',
        hashedPassword,
        roles: 'user'
      }
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        name: 'Regular User 2',
        hashedPassword,
        roles: 'user'
      }
    });

    // Create folders
    const workFolder = await prisma.folder.create({
      data: {
        name: 'Work Projects',
        color: '#ef4444',
        userId: user1.id
      }
    });

    const personalFolder = await prisma.folder.create({
      data: {
        name: 'Personal',
        color: '#10b981',
        userId: user1.id
      }
    });

    // Create many tasks for pagination testing
    const tasks = [];
    for (let i = 1; i <= 50; i++) {
      tasks.push({
        title: `Task ${i}`,
        description: `Description for task ${i}`,
        completed: Math.random() > 0.7,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        userId: i <= 25 ? user1.id : user2.id,
        folderId: i <= 10 ? workFolder.id : (i <= 20 ? personalFolder.id : null)
      });
    }

    await prisma.task.createMany({
      data: tasks
    });

    // Create task logs
    const taskIds = await prisma.task.findMany({
      select: { id: true },
      take: 10
    });

    for (const task of taskIds) {
      await prisma.taskLog.create({
        data: {
          message: 'Task created and assigned',
          taskId: task.id
        }
      });
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${tasks.length} tasks for testing pagination`);
    console.log('Manager credentials: manager@example.com / password123');
    console.log('User credentials: user1@example.com / password123');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();