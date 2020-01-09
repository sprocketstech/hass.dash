
mkdir /run/nginx
nginx

(cd /opt/hass.dash/server;npm install --production)
cd /opt/hass.dash
node server/index.js
