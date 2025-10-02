const pool = require('../config/database');

class Task {
  static async create({ title, description, priority, userId }) {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, priority || 'medium', userId]
    );
    return result.rows[0];
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];
    
    if (filters.completed !== undefined) {
      query += ' AND completed = $2';
      params.push(filters.completed);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, userId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (['title', 'description', 'completed', 'priority'].includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id, userId);

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  }

  static async deleteMany(ids, userId) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = ANY($1) AND user_id = $2 RETURNING *',
      [ids, userId]
    );
    return result.rows;
  }
}

module.exports = Task;