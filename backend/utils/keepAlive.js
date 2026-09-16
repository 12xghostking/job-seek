const config = require('../config/env');

let timer = null;

const startKeepAlive = () => {
  const targetUrl = config.healthCheckUrl;
  const intervalMinutes = config.healthCheckIntervalMinutes || 14;
  const intervalMs = intervalMinutes * 60 * 1000;

  if (!targetUrl) {
    console.log('[Keep-Alive] HEALTH_CHECK_URL not configured. Self-ping keep-alive is idle.');
    return;
  }

  console.log(`[Keep-Alive] Initialized self-ping service for ${targetUrl} every ${intervalMinutes} minutes.`);

  const ping = async () => {
    try {
      const response = await fetch(targetUrl, {
        headers: { 'User-Agent': 'JobSeek-KeepAlive-Service/1.0' },
      });
      const data = await response.json().catch(() => ({}));
      console.log(`[Keep-Alive Ping] Status: ${response.status} at ${new Date().toISOString()}`, data);
    } catch (err) {
      console.warn(`[Keep-Alive Ping Failed] Error pinging ${targetUrl}: ${err.message}`);
    }
  };

  // Run initial delayed ping (after 2 minutes) then recurring
  setTimeout(ping, 2 * 60 * 1000);
  timer = setInterval(ping, intervalMs);
};

const stopKeepAlive = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

module.exports = {
  startKeepAlive,
  stopKeepAlive,
};
