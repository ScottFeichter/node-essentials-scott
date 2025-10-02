const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /folders:
 *   get:
 *     summary: Get user's folders
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of folders
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

/**
 * @swagger
 * /folders:
 *   post:
 *     summary: Create a new folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Folder created
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Folder name required' });
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        color: color || '#3b82f6',
        userId: req.user.id
      }
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

/**
 * @swagger
 * /folders/{id}/tasks:
 *   post:
 *     summary: Move tasks to folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Tasks moved to folder
 */
router.post('/:id/tasks', authenticateToken, async (req, res) => {
  try {
    const folderId = parseInt(req.params.id);
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds)) {
      return res.status(400).json({ error: 'taskIds array required' });
    }

    // Verify folder belongs to user
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId: req.user.id }
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const result = await prisma.task.updateMany({
      where: { 
        id: { in: taskIds },
        userId: req.user.id 
      },
      data: { folderId }
    });

    res.json({ 
      message: `${result.count} tasks moved to folder`,
      moved: result.count 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to move tasks to folder' });
  }
});

module.exports = router;