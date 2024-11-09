import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import '../App.css'; // Import the CSS file

function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
  });

  useEffect(() => {
    // Fetch settings from local storage
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
      setSettings(savedSettings);
      applyTheme(savedSettings.theme);
    } else {
      // Apply default theme (light) on startup
      applyTheme('light');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Save settings to local storage
    localStorage.setItem('settings', JSON.stringify(settings));
    applyTheme(settings.theme);
    console.log('Settings saved:', settings);
  };

  const applyTheme = (theme) => {
    document.body.className = theme;
  };

  return (
    <div className="settings-container">
      <Navbar />
      <div className="settings-card">
        <h1>Settings</h1>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <button className="primary-button" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;