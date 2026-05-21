import React, { useState, useEffect, useContext } from 'react';
import client from '../api/client';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import './CropDashboard.css';

export default function CropDashboard() {
  const { user } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalyzing, setAIAnalyzing] = useState(null);
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    plantedDate: '',
    expectedHarvestDate: '',
    areaPlanted: '',
    soilType: '',
    location: '',
    notes: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await client.get('/crops/all');
      setCrops(response.data.crops || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setLoading(false);
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
      if (editingCrop) {
        await client.put(`/crops/update/${editingCrop.id}`, formData);
      } else {
        await client.post('/crops/add', formData);
      }
      fetchCrops();
      resetForm();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const resetForm = () => {
    setFormData({
      cropName: '',
      variety: '',
      plantedDate: '',
      expectedHarvestDate: '',
      areaPlanted: '',
      soilType: '',
      location: '',
      notes: ''
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      cropName: crop.cropName,
      variety: crop.variety || '',
      plantedDate: crop.plantedDate?.split('T')[0],
      expectedHarvestDate: crop.expectedHarvestDate?.split('T')[0] || '',
      areaPlanted: crop.areaPlanted || '',
      soilType: crop.soilType || '',
      location: crop.location || '',
      notes: crop.notes || ''
    });
    setShowForm(true);
  };

  const getAIGrowthAnalysis = async (crop) => {
    try {
      setAIAnalyzing(crop.id);
      const plantedDate = new Date(crop.plantedDate);
      const today = new Date();
      const daysGrowth = Math.floor((today - plantedDate) / (1000 * 60 * 60 * 24));

      const response = await client.post(
        '/ai',
        {
          crop: crop.cropName,
          daysGrowth,
          soilType: crop.soilType,
          location: crop.location
        }
      );

      const result = response.data.result;
      if (result) {
        const message = `${crop.cropName} Growth Analysis:\n\nDays since planting: ${daysGrowth}\n\n${typeof result === 'string' ? result : JSON.stringify(result, null, 2)}`;
        alert(message);

        // Send notification email
        await client.post(
          '/notifications/send-email',
          {
            cropId: crop.id,
            cropName: crop.cropName,
            type: 'growth_update',
            analysis: result
          }
        ).catch(err => console.log('Email notification sent'));
      }
    } catch (error) {
      alert('Error analyzing crop growth: ' + error.response?.data?.error);
    } finally {
      setAIAnalyzing(null);
    }
  };

  const handleHarvest = async (crop) => {
    const harvestedDate = prompt('Enter harvest date (YYYY-MM-DD):');
    if (!harvestedDate) return;

    const yieldAmount = prompt('Enter yield amount (kg):');
    if (!yieldAmount) return;
    
    if (harvestedDate && yieldAmount) {
      try {
        await client.post(`/crops/harvest/${crop.id}`, {
          harvestedDate,
          yield: yieldAmount
        });
        fetchCrops();
        
        // Send harvest notification email
        await client.post(
          '/notifications/send-email',
          {
            cropId: crop.id,
            cropName: crop.cropName,
            type: 'harvest_notification',
            harvestedDate,
            yieldAmount
          }
        ).catch(err => console.log('Harvest email sent'));
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await client.delete(`/crops/delete/${cropId}`);
        fetchCrops();
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'growing': return '#4caf50';
      case 'mature': return '#ff9800';
      case 'harvested': return '#9c27b0';
      default: return '#2196f3';
    }
  };

  if (loading) return <div className="crop-dashboard"><Navbar />Loading crops...</div>;

  return (
    <div className="crop-dashboard">
      <Navbar />
      
      <div className="crop-dashboard-content">
        <div className="crop-header">
          <h2>🌾 Crop Management Dashboard</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-add-crop">
            {showForm ? '✕ Cancel' : '+ Add New Crop'}
          </button>
        </div>

        {showForm && (
          <form className="crop-form" onSubmit={handleSubmit}>
            <h3>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h3>
            
            <div className="form-group">
              <label>Crop Name *</label>
              <input
                type="text"
                name="cropName"
                value={formData.cropName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Wheat, Rice, Corn"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Variety</label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleInputChange}
                  placeholder="e.g., Basmati"
                />
              </div>
              <div className="form-group">
                <label>Soil Type</label>
                <select name="soilType" value={formData.soilType} onChange={handleInputChange}>
                  <option value="">Select soil type</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Clay">Clay</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Planted Date *</label>
                <input
                  type="date"
                  name="plantedDate"
                  value={formData.plantedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expected Harvest Date</label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  value={formData.expectedHarvestDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Area Planted (hectares)</label>
                <input
                  type="number"
                  step="0.01"
                  name="areaPlanted"
                  value={formData.areaPlanted}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Field name/location"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about this crop"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-submit">{editingCrop ? 'Update' : 'Add'} Crop</button>
          </form>
        )}

        <div className="crops-container">
          <h3>Your Crops ({crops.length})</h3>
          
          {crops.length === 0 ? (
            <p className="no-crops">No crops added yet. Click "Add New Crop" to get started!</p>
          ) : (
            <div className="crops-grid">
              {crops.map(crop => (
                <div key={crop.id} className="crop-card">
                  <div className="crop-header-card">
                    <h4>{crop.cropName}</h4>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(crop.status) }}>
                      {crop.status}
                    </span>
                  </div>

                  <div className="crop-details">
                    {crop.variety && <p><strong>Variety:</strong> {crop.variety}</p>}
                    <p><strong>Planted:</strong> {new Date(crop.plantedDate).toLocaleDateString()}</p>
                    {crop.expectedHarvestDate && (
                      <p><strong>Harvest Expected:</strong> {new Date(crop.expectedHarvestDate).toLocaleDateString()}</p>
                    )}
                    {crop.growthStage && <p><strong>Growth Stage:</strong> {crop.growthStage}</p>}
                    {crop.areaPlanted && <p><strong>Area:</strong> {crop.areaPlanted} ha</p>}
                    {crop.soilType && <p><strong>Soil:</strong> {crop.soilType}</p>}
                    {crop.location && <p><strong>Location:</strong> {crop.location}</p>}
                    {crop.yield && <p><strong>Yield:</strong> {crop.yield} units</p>}
                    {crop.notes && <p><strong>Notes:</strong> {crop.notes}</p>}
                  </div>

                  <div className="crop-actions">
                    <button 
                      onClick={() => getAIGrowthAnalysis(crop)} 
                      className="btn-action ai"
                      disabled={aiAnalyzing === crop.id}
                    >
                      {aiAnalyzing === crop.id ? '⏳ Analyzing...' : '🤖 AI Analysis'}
                    </button>
                    <button onClick={() => handleEdit(crop)} className="btn-action edit">✎ Edit</button>
                    {crop.status !== 'harvested' && (
                      <button onClick={() => handleHarvest(crop)} className="btn-action harvest">
                        🌾 Harvest
                      </button>
                    )}
                    <button onClick={() => handleDelete(crop.id)} className="btn-action delete">🗑️ Delete</button>
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
