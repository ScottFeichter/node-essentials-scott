const { StatusCodes } = require("http-status-codes");
const prisma = require("../prisma/db");

const getUserAnalytics = async (req, res) => {
  const userId = parseInt(req.params.id);
  
  try {
    // Task stats using groupBy
    const taskStats = await prisma.task.groupBy({
      by: ['isCompleted'],
      where: { userId },
      _count: { id: true }
    });

    // Recent tasks with user info
    const recentTasks = await prisma.task.findMany({
      where: { userId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Weekly progress
    const weeklyProgress = await prisma.task.groupBy({
      by: ['createdAt'],
      where: { userId },
      _count: { id: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      taskStats,
      recentTasks,
      weeklyProgress
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getUsersList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: { select: { tasks: true } },
          tasks: {
            where: { isCompleted: false },
            select: { id: true },
            take: 5
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users list error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const searchTasks = async (req, res) => {
  const { q: query } = req.query;
  
  if (!query) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Search query required" });
  }

  try {
    const results = await prisma.$queryRaw`
      SELECT t.*, u.name as user_name
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE t.title ILIKE ${`%${query}%`} OR u.name ILIKE ${`%${query}%`}
      ORDER BY 
        CASE WHEN t.title ILIKE ${`%${query}%`} THEN 1 ELSE 2 END,
        t.created_at DESC
    `;

    res.json({
      results,
      query,
      count: results.length
    });
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

module.exports = { getUserAnalytics, getUsersList, searchTasks };