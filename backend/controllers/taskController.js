const db = require("../config/db");

// Get all tasks for user
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = "SELECT * FROM tasks WHERE userId = ? ORDER BY dueDate ASC";
    
    db.query(sql, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, tasks: results });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cropId, title, description, taskType, dueDate, priority, reminderTime } = req.body;
    
    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: "Title and due date required" });
    }
    
    const sql = `
      INSERT INTO tasks (userId, cropId, title, description, taskType, dueDate, priority, reminderTime, reminderSet)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      sql,
      [userId, cropId, title, description, taskType, dueDate, priority, reminderTime, reminderTime ? true : false],
      (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: "Task created successfully", taskId: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { title, description, dueDate, status, priority } = req.body;
    
    const sql = `
      UPDATE tasks 
      SET title = ?, description = ?, dueDate = ?, status = ?, priority = ?
      WHERE id = ? AND userId = ?
    `;
    
    db.query(sql, [title, description, dueDate, status, priority, taskId, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      
      res.json({ success: true, message: "Task updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete task
exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    
    const sql = "UPDATE tasks SET status = 'completed', completedAt = NOW() WHERE id = ? AND userId = ?";
    
    db.query(sql, [taskId, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      
      res.json({ success: true, message: "Task completed successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    
    const sql = "DELETE FROM tasks WHERE id = ? AND userId = ?";
    
    db.query(sql, [taskId, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      
      res.json({ success: true, message: "Task deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//optional