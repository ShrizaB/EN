const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let waitingUser = null;
let clients = new Map();

function broadcastOnlineCount() {
  const count = clients.size;
  for (const ws of clients.values()) {
    ws.send(JSON.stringify({ type: 'online_users_update', payload: count }));
  }
}

wss.on('connection', (ws, req) => {
  // Parse userId from query string
  const url = new URL(req.url, 'http://localhost');
  const userId = url.searchParams.get('userId') || `user_${Math.random()}`;

  clients.set(userId, ws);
  broadcastOnlineCount();

  ws.on('message', (message) => {
    try {
      const { type, payload } = JSON.parse(message);

      if (type === 'join_queue') {
        ws.userId = userId;
        if (waitingUser && waitingUser.readyState === WebSocket.OPEN && waitingUser !== ws) {
          // Match found!
          const opponentId = waitingUser.userId;
          const matchDataA = {
            gameId: `game_${Date.now()}`,
            opponent: { id: opponentId, name: `Player_${opponentId.slice(-4)}` },
            isHost: true,
          };
          const matchDataB = {
            gameId: matchDataA.gameId,
            opponent: { id: userId, name: `Player_${userId.slice(-4)}` },
            isHost: false,
          };
          ws.send(JSON.stringify({ type: 'match_found', payload: matchDataA }));
          waitingUser.send(JSON.stringify({ type: 'match_found', payload: matchDataB }));
          waitingUser = null;
        } else {
          waitingUser = ws;
        }
      }
    } catch (e) {
      console.error('Error handling message:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
    if (waitingUser === ws) waitingUser = null;
    broadcastOnlineCount();
  });
});
