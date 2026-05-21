import React, { useState, useEffect } from 'react';
import client from '../api/client';
import './Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'weather',
    title: '',
    message: '',
    priority: 'medium',
    sendEmail: false,
    sendSMS: false
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await client.get('/notifications/all');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/notifications/create', formData);
      fetchNotifications();
      resetForm();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await client.put(`/notifications/read/${notificationId}`, {});
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await client.delete(`/notifications/delete/${notificationId}`);
        fetchNotifications();
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'weather',
      title: '',
      message: '',
      priority: 'medium',
      sendEmail: false,
      sendSMS: false
    });
    setShowForm(false);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'weather': return '🌤️';
      case 'irrigation': return '💧';
      case 'fertilizer': return '🌱';
      case 'harvest': return '🌾';
      case 'disease': return '🦠';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h2>🔔 Notifications & Alerts</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-add-notification">
          {showForm ? '✕ Cancel' : '+ Create Notification'}
        </button>
      </div>

      {showForm && (
        <form className="notification-form" onSubmit={handleSubmit}>
          <h3>Create New Notification</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Notification Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="weather">Weather Alert</option>
                <option value="irrigation">Irrigation Reminder</option>
                <option value="fertilizer">Fertilizer Reminder</option>
                <option value="harvest">Harvest Notification</option>
                <option value="disease">Disease Alert</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority Level</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Notification title"
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Detailed notification message..."
              rows="4"
              required
            />
          </div>

          <div className="delivery-options">
            <h4>Delivery Options</h4>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="sendEmail"
                  checked={formData.sendEmail}
                  onChange={handleInputChange}
                />
                Send via Email
              </label>
              <label>
                <input
                  type="checkbox"
                  name="sendSMS"
                  checked={formData.sendSMS}
                  onChange={handleInputChange}
                />
                Send via SMS
              </label>
            </div>
          </div>

          <button type="submit" className="btn-submit">Create Notification</button>
        </form>
      )}

      <div className="notifications-sections">
        {unreadNotifications.length > 0 && (
          <div className="notifications-section">
            <h3>🔴 Unread Notifications ({unreadNotifications.length})</h3>
            <div className="notifications-list">
              {unreadNotifications.map(notification => (
                <div key={notification.id} className="notification-card unread">
                  <div className="notification-header">
                    <div className="notification-type">
                      <span className="type-icon">{getNotificationIcon(notification.type)}</span>
                      <span className="type-text">{notification.type.toUpperCase()}</span>
                    </div>
                    <div className="notification-meta">
                      <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      >
                        {notification.priority.toUpperCase()}
                      </span>
                      <span className="notification-date">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="notification-content">
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                  </div>

                  <div className="notification-actions">
                    <button onClick={() => markAsRead(notification.id)} className="btn-mark-read">
                      ✓ Mark as Read
                    </button>
                    <button onClick={() => deleteNotification(notification.id)} className="btn-delete">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="notifications-section">
          <h3>📋 All Notifications ({notifications.length})</h3>
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications yet</p>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}>
                  <div className="notification-header">
                    <div className="notification-type">
                      <span className="type-icon">{getNotificationIcon(notification.type)}</span>
                      <span className="type-text">{notification.type.toUpperCase()}</span>
                    </div>
                    <div className="notification-meta">
                      <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      >
                        {notification.priority.toUpperCase()}
                      </span>
                      <span className="notification-date">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="notification-content">
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                  </div>

                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button onClick={() => markAsRead(notification.id)} className="btn-mark-read">
                        ✓ Mark as Read
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notification.id)} className="btn-delete">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
