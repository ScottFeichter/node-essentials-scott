const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');
const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get paginated tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated tasks
 */
router.get('/', authenticateToken, paginate, async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    const { folderId } = req.query;
    
    const where = { 
      userId: req.user.id,
      ...(folderId && { folderId: parseInt(folderId) })
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: { folder: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);

    res.json(req.pagination.createResponse(tasks, total));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * @swagger
 * /tasks/bulk:
 *   patch:
 *     summary: Bulk update tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               updates:
 *                 type: object
 *                 properties:
 *                   completed:
 *                     type: boolean
 *                   priority:
 *                     type: string
 *                   folderId:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Bulk update successful
 */
router.patch('/bulk', authenticateToken, async (req, res) => {
  try {
    const { taskIds, updates } = req.body;
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'taskIds array required' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Verify all tasks belong to user
      const tasks = await tx.task.findMany({
        where: { 
          id: { in: taskIds },
          userId: req.user.id 
        }
      });

      if (tasks.length !== taskIds.length) {
        throw new Error('Some tasks not found or unauthorized');
      }

      // Update tasks
      const updated = await tx.task.updateMany({
        where: { 
          id: { in: taskIds },
          userId: req.user.id 
        },
        data: updates
      });

      return updated;
    });

    res.json({ 
      message: `${result.count} tasks updated successfully`,
      updated: result.count 
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Bulk update failed' });
  }
});

/**
 * @swagger
 * /tasks/bulk:
 *   delete:
 *     summary: Bulk delete tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Bulk delete successful
 */
router.delete('/bulk', authenticateToken, async (req, res) => {
  try {
    const { taskIds } = req.body;
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'taskIds array required' });
    }

    const result = await prisma.task.deleteMany({
      where: { 
        id: { in: taskIds },
        userId: req.user.id 
      }
    });

    res.json({ 
      message: `${result.count} tasks deleted successfully`,
      deleted: result.count 
    });
  } catch (error) {
    res.status(500).json({ error: 'Bulk delete failed' });
  }
});

/**
 * @swagger
 * /tasks/all:
 *   get:
 *     summary: Get all users' tasks (Manager only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tasks from all users
 */
router.get('/all', authenticateToken, requireRole('manager'), paginate, async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: limit,
        include: { 
          user: { select: { id: true, name: true, email: true } },
          folder: true 
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count()
    ]);

    res.json(req.pagination.createResponse(tasks, total));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all tasks' });
  }
});

module.exports = router;