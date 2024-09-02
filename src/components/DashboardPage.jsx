import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const location = useLocation();
  const [browserInfo, setBrowserInfo] = useState({
    batteryStatus: null,
    mediaDevices: null,
    geolocation: null,
  });

  const [vpnStatus, setVpnStatus] = useState(null);

  useEffect(() => {
    const getBrowserInfo = async () => {
      const ua = navigator.userAgent;
      const os = navigator.platform;
      const browserType = navigator.appName;
      const browserVersion = navigator.appVersion;
      const ip = location.state?.ip || '';
      const screenResolution = `${window.screen.width} x ${window.screen.height}`;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      const plugins = Array.from(navigator.plugins).map(plugin => plugin.name).join(', ');
      const fonts = '';
      const canvasFingerprinting = '';
      const webGLFingerprinting = '';
      const cssProperties = window.CSS ? Object.keys(CSS.supports) : 'CSS.supports not supported';
      const userAgent = navigator.userAgent;
      const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled';
      const tlsFingerprinting = '';
      const deviceMemory = navigator.deviceMemory || 'Device Memory API not supported';
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const audioContext = window.AudioContext ? 'Supported' : 'Not Supported';
      const hardwareConcurrency = navigator.hardwareConcurrency || 'Hardware Concurrency API not supported';
      const doNotTrack = navigator.doNotTrack || 'Do Not Track API not supported';
      const windowSize = `${window.innerWidth} x ${window.innerHeight}`;

      const batteryStatus = navigator.getBattery ? await navigator.getBattery() : null;

      let mediaDevices = null;
      if (navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        mediaDevices = devices.length;
      }

      let geolocation = null;
      if (navigator.geolocation) {
        geolocation = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => resolve(`${position.coords.latitude}, ${position.coords.longitude}`),
            error => reject('Geolocation not available')
          );
        });
      }

      setBrowserInfo({
        os,
        browserType,
        browserVersion,
        ip,
        screenResolution,
        timeZone,
        language,
        plugins,
        fonts,
        canvasFingerprinting,
        webGLFingerprinting,
        cssProperties,
        userAgent,
        cookiesEnabled,
        tlsFingerprinting,
        batteryStatus,
        deviceMemory,
        touchSupport,
        audioContext,
        mediaDevices,
        hardwareConcurrency,
        doNotTrack,
        windowSize,
        geolocation,
      });
    };

    getBrowserInfo();
  }, [location.state]);

  const analyzeIp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/vpn-check', {
        ip: browserInfo.ip,
      });
      const isVpn = response.data.vpn ? "YES" : "NO";
      setVpnStatus(isVpn);
    } catch (error) {
      console.error('Error checking VPN status:', error);
      setVpnStatus('Error detecting VPN');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2>Browser and Device Information</h2>
        <div className="info-list">
          <p><strong>Operating System (OS):</strong> {browserInfo.os}</p>
          <p><strong>Browser Type:</strong> {browserInfo.browserType}</p>
          <p><strong>Browser Version:</strong> {browserInfo.browserVersion}</p>
          <p><strong>IP Address:</strong> {browserInfo.ip}</p>
          <p><strong>Screen Resolution:</strong> {browserInfo.screenResolution}</p>
          <p><strong>Time Zone:</strong> {browserInfo.timeZone}</p>
          <p><strong>Language Preferences:</strong> {browserInfo.language}</p>
          <p><strong>Installed Plugins:</strong> {browserInfo.plugins}</p>
          <p><strong>User-Agent String:</strong> {browserInfo.userAgent}</p>
          <p><strong>Cookies Enabled:</strong> {browserInfo.cookiesEnabled}</p>
          <p><strong>Battery Status:</strong> {browserInfo.batteryStatus ? `${(browserInfo.batteryStatus.level * 100).toFixed(0)}%` : 'Battery API not supported'}</p>
          <p><strong>Device Memory:</strong> {browserInfo.deviceMemory} GB</p>
          <p><strong>Touch Support:</strong> {browserInfo.touchSupport ? 'Yes' : 'No'}</p>
          <p><strong>Audio Context:</strong> {browserInfo.audioContext}</p>
          <p><strong>Media Devices:</strong> {browserInfo.mediaDevices ? `${browserInfo.mediaDevices} device(s)` : 'N/A'}</p>
          <p><strong>Network Information:</strong> {browserInfo.networkInfo ? `${browserInfo.networkInfo.downlink} Mbps` : 'N/A'}</p>
          <p><strong>Hardware Concurrency:</strong> {browserInfo.hardwareConcurrency}</p>
          <p><strong>Do Not Track:</strong> {browserInfo.doNotTrack}</p>
          <p><strong>Browser Window Size:</strong> {browserInfo.windowSize}</p>
          <p><strong>Geolocation:</strong> {browserInfo.geolocation || 'Geolocation not available'}</p>
          <p><strong>VPN Enabled:</strong> {vpnStatus !== null ? vpnStatus : 'Not checked'}</p>
        </div>
        <button className="analyze-button" onClick={analyzeIp}>Analyze</button>
      </div>
    </div>
  );
};

export default DashboardPage;
