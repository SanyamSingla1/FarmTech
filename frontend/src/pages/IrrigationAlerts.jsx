import React, { useState, useEffect } from 'react';
import client from '../api/client';
import './IrrigationAlerts.css';

export default function IrrigationAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cropId: '',
    alertLevel: 'medium',
    moistureLevel: '',
    recommendedWaterAmount: '',
    message: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await client.get('/irrigation/all');
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
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
      await client.post('/irrigation/create', formData);
      fetchAlerts();
      resetForm();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await client.put(`/irrigation/read/${alertId}`, {});
      fetchAlerts();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteAlert = async (alertId) => {
    if (window.confirm('Delete this alert?')) {
      try {
        await client.delete(`/irrigation/delete/${alertId}`);
        fetchAlerts();
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      cropId: '',
      alertLevel: 'medium',
      moistureLevel: '',
      recommendedWaterAmount: '',
      message: ''
    });
    setShowForm(false);
  };

  const getAlertLevelColor = (level) => {
    switch(level) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const readAlerts = alerts.filter(alert => alert.isRead);

  return (
    <div className="irrigation-alerts">
      <div className="alerts-header">
        <h2>💧 Smart Irrigation Alerts</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-add-alert">
          {showForm ? '✕ Cancel' : '+ Create Alert'}
        </button>
      </div>

      {showForm && (
        <form className="alert-form" onSubmit={handleSubmit}>
          <h3>Create New Alert</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Alert Level</label>
              <select name="alertLevel" value={formData.alertLevel} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Moisture Level (%)</label>
              <input
                type="number"
                name="moistureLevel"
                value={formData.moistureLevel}
                onChange={handleInputChange}
                placeholder="e.g., 45"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Recommended Water (mm)</label>
              <input
                type="number"
                name="recommendedWaterAmount"
                value={formData.recommendedWaterAmount}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Crop ID (optional)</label>
              <input
                type="number"
                name="cropId"
                value={formData.cropId}
                onChange={handleInputChange}
                placeholder="Leave empty for general alert"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Alert Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Describe the irrigation alert..."
              rows="3"
              required
            />
          </div>

          <button type="submit" className="btn-submit">Create Alert</button>
        </form>
      )}

      <div className="alerts-sections">
        {unreadAlerts.length > 0 && (
          <div className="alerts-section">
            <h3>🔴 Unread Alerts ({unreadAlerts.length})</h3>
            <div className="alerts-list">
              {unreadAlerts.map(alert => (
                <div key={alert.id} className="alert-card unread">
                  <div className="alert-header">
                    <span
                      className="alert-level"
                      style={{ backgroundColor: getAlertLevelColor(alert.alertLevel) }}
                    >
                      {alert.alertLevel.toUpperCase()}
                    </span>
                    <span className="alert-date">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="alert-content">
                    <p className="alert-message">{alert.message}</p>
                    <div className="alert-details">
                      {alert.moistureLevel && (
                        <span>💧 Moisture: {alert.moistureLevel}%</span>
                      )}
                      {alert.recommendedWaterAmount && (
                        <span>🚿 Water: {alert.recommendedWaterAmount}mm</span>
                      )}
                    </div>
                  </div>

                  <div className="alert-actions">
                    <button onClick={() => markAsRead(alert.id)} className="btn-mark-read">
                      ✓ Mark as Read
                    </button>
                    <button onClick={() => deleteAlert(alert.id)} className="btn-delete">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="alerts-section">
          <h3>📋 All Alerts ({alerts.length})</h3>
          {alerts.length === 0 ? (
            <p className="no-alerts">No irrigation alerts yet</p>
          ) : (
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-card ${alert.isRead ? 'read' : 'unread'}`}>
                  <div className="alert-header">
                    <span
                      className="alert-level"
                      style={{ backgroundColor: getAlertLevelColor(alert.alertLevel) }}
                    >
                      {alert.alertLevel.toUpperCase()}
                    </span>
                    <span className="alert-date">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="alert-content">
                    <p className="alert-message">{alert.message}</p>
                    <div className="alert-details">
                      {alert.moistureLevel && (
                        <span>💧 Moisture: {alert.moistureLevel}%</span>
                      )}
                      {alert.recommendedWaterAmount && (
                        <span>🚿 Water: {alert.recommendedWaterAmount}mm</span>
                      )}
                    </div>
                  </div>

                  <div className="alert-actions">
                    {!alert.isRead && (
                      <button onClick={() => markAsRead(alert.id)} className="btn-mark-read">
                        ✓ Mark as Read
                      </button>
                    )}
                    <button onClick={() => deleteAlert(alert.id)} className="btn-delete">
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
