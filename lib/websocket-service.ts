class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: { [key: string]: Function[] } = {}

  connect(userId: string) {
    try {
      // In production, this would be your WebSocket server URL
      const wsUrl = process.env.NODE_ENV === "production" ? "wss://your-websocket-server.com" : "ws://localhost:8080"

      this.ws = new WebSocket(`${wsUrl}?userId=${userId}`)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0
        this.emit("connected")
        // Join the matchmaking queue on connect
        this.send("join_queue", { userId })
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit(data.type, data.payload)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.emit("disconnected")
        this.attemptReconnect(userId)
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.emit("error", error)
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
      // No fallback simulation, just show error
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect(userId)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.warn("WebSocket not connected, cannot send message")
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  }

  private emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  joinQueue() {
    this.send("join_queue", {})
  }

  leaveQueue() {
    this.send("leave_queue", {})
  }

  selectTopic(gameId: string, topic: string) {
    this.send("select_topic", { gameId, topic })
  }

  submitAnswer(gameId: string, questionId: string, answer: number, timeUsed: number) {
    this.send("submit_answer", { gameId, questionId, answer, timeUsed })
  }

  useHint(gameId: string, questionId: string) {
    this.send("use_hint", { gameId, questionId })
  }
}

export const wsService = new WebSocketService()
