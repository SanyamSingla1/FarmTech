import React, { useState, useEffect } from 'react';
import client from '../api/client';
import './TaskScheduler.css';

export default function TaskScheduler() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: 'general',
    dueDate: '',
    priority: 'medium',
    reminderTime: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await client.get('/tasks/all');
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/tasks/create', formData);
      fetchTasks();
      resetForm();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await client.post(`/tasks/complete/${taskId}`, {});
      fetchTasks();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await client.delete(`/tasks/delete/${taskId}`);
        fetchTasks();
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      taskType: 'general',
      dueDate: '',
      priority: 'medium',
      reminderTime: ''
    });
    setShowForm(false);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  return (
    <div className="task-scheduler">
      <div className="scheduler-header">
        <h2>Task Scheduler</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? '✕ Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Fertilize wheat field"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Task Type</label>
              <select name="taskType" value={formData.taskType} onChange={handleInputChange}>
                <option value="general">General</option>
                <option value="irrigation">Irrigation</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="harvest">Harvest</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reminder Time</label>
              <input
                type="time"
                name="reminderTime"
                value={formData.reminderTime}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Task details..."
            />
          </div>

          <button type="submit" className="btn-submit">Create Task</button>
        </form>
      )}

      <div className="tasks-section">
        <h3>Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks scheduled</p>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task.id} className={`task-item ${task.status}`}>
                <div className="task-header">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'completed'}
                    onChange={() => handleComplete(task.id)}
                  />
                  <h4>{task.title}</h4>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="task-due">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-actions">
                  <button onClick={() => handleDelete(task.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
