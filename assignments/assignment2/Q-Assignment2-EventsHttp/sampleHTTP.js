const http = require('http');
const url = require('url');

const htmlString = `
<!DOCTYPE html>
<html>
<body>
<h1>Clock</h1>
<button id="getTimeBtn">Get the Time</button>
<p id="time"></p>
<script>
document.getElementById('getTimeBtn').addEventListener('click', async () => {
    const res = await fetch('/time');
    const timeObj = await res.json();
    console.log(timeObj);
    const timeP = document.getElementById('time');
    timeP.textContent = timeObj.time;
});
</script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/time') {
    // Return JSON with current time
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const timeObj = { time: new Date().toLocaleString() };
    res.end(JSON.stringify(timeObj));
  } else if (pathname === '/timePage') {
    // Return HTML page
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlString);
  } else {
    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/timePage to see the clock`);
  console.log(`Visit http://localhost:${PORT}/time to get JSON time`);
});