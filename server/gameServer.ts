import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import type { Server as HTTPServer } from 'http'

export interface Player {
  id: string
  name: string
  x: number
  y: number
  roomId: string
}

export interface Room {
  id: string
  name: string
  players: Map<string, Player>
  maxPlayers: number
  createdAt: number
}

export class GameServer {
  private io: SocketIOServer
  private httpServer: HTTPServer
  private rooms: Map<string, Room>
  private cleanupInterval: NodeJS.Timeout

  constructor(port: number = parseInt(process.env.WEBSOCKET_PORT || '3001')) {
    this.httpServer = createServer()
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    })
    this.rooms = new Map()

    this.setupEventHandlers()
    this.httpServer.listen(port, () => {
      console.log(`🎮 Game server running on port ${port}`)
    })

    // Clean up inactive rooms every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveRooms()
    }, 3600000) // 1 hour
  }

  private cleanupInactiveRooms() {
    const timeout = parseInt(process.env.DEFAULT_ROOM_TIMEOUT || '3600000')
    const now = Date.now()

    this.rooms.forEach((room, roomId) => {
      // Remove rooms that are empty or older than timeout
      if (room.players.size === 0 || (now - room.createdAt) > timeout) {
        this.rooms.delete(roomId)
        console.log(`Cleaned up inactive room: ${roomId}`)
      }
    })
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Player connected: ${socket.id}`)

      // Handle room creation
      socket.on('create-room', (data: { roomName: string; playerName: string }) => {
        const roomId = `room-${Date.now()}`
        const room: Room = {
          id: roomId,
          name: data.roomName,
          players: new Map(),
          maxPlayers: parseInt(process.env.MAX_PLAYERS_PER_ROOM || '10'),
          createdAt: Date.now(),
        }

        this.rooms.set(roomId, room)
        socket.join(roomId)

        const player: Player = {
          id: socket.id,
          name: data.playerName,
          x: 640,
          y: 360,
          roomId: roomId,
        }

        room.players.set(socket.id, player)

        socket.emit('room-created', {
          roomId,
          room: this.serializeRoom(room),
        })

        console.log(`Room created: ${roomId} by ${data.playerName}`)
      })

      // Handle room joining
      socket.on('join-room', (data: { roomId: string; playerName: string }) => {
        const room = this.rooms.get(data.roomId)

        if (!room) {
          socket.emit('error', { message: 'Room not found' })
          return
        }

        if (room.players.size >= room.maxPlayers) {
          socket.emit('error', { message: 'Room is full' })
          return
        }

        socket.join(data.roomId)

        const player: Player = {
          id: socket.id,
          name: data.playerName,
          x: 640,
          y: 360,
          roomId: data.roomId,
        }

        room.players.set(socket.id, player)

        // Notify the joining player
        socket.emit('room-joined', {
          roomId: data.roomId,
          room: this.serializeRoom(room),
        })

        // Notify other players in the room
        socket.to(data.roomId).emit('player-joined', {
          player: this.serializePlayer(player),
        })

        console.log(`Player ${data.playerName} joined room: ${data.roomId}`)
      })

      // Handle player movement
      socket.on('player-move', (data: { x: number; y: number; roomId: string }) => {
        const room = this.rooms.get(data.roomId)
        if (!room) return

        const player = room.players.get(socket.id)
        if (!player) return

        player.x = data.x
        player.y = data.y

        // Broadcast to other players in the room
        socket.to(data.roomId).emit('player-moved', {
          playerId: socket.id,
          x: data.x,
          y: data.y,
        })
      })

      // Handle AI chat messages
      socket.on('ai-chat', (data: { message: string; roomId: string }) => {
        // Broadcast to all players in the room
        this.io.to(data.roomId).emit('ai-message', {
          playerId: socket.id,
          message: data.message,
          timestamp: Date.now(),
        })
      })

      // Handle leave room
      socket.on('leave-room', (data: { roomId: string }) => {
        const room = this.rooms.get(data.roomId)
        if (!room) return

        const player = room.players.get(socket.id)
        if (player) {
          room.players.delete(socket.id)
          socket.leave(data.roomId)

          // Notify other players
          socket.to(data.roomId).emit('player-left', {
            playerId: socket.id,
            playerName: player.name,
          })

          // Delete room if empty
          if (room.players.size === 0) {
            this.rooms.delete(data.roomId)
            console.log(`Room deleted: ${data.roomId}`)
          }

          console.log(`Player ${player.name} left room: ${data.roomId}`)
        }
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`)

        // Find and remove player from their room
        this.rooms.forEach((room, roomId) => {
          if (room.players.has(socket.id)) {
            const player = room.players.get(socket.id)!
            room.players.delete(socket.id)

            // Notify other players
            socket.to(roomId).emit('player-left', {
              playerId: socket.id,
              playerName: player.name,
            })

            // Delete room if empty
            if (room.players.size === 0) {
              this.rooms.delete(roomId)
              console.log(`Room deleted: ${roomId}`)
            }
          }
        })
      })

      // Get available rooms
      socket.on('get-rooms', () => {
        const roomList = Array.from(this.rooms.values()).map((room) => ({
          id: room.id,
          name: room.name,
          playerCount: room.players.size,
          maxPlayers: room.maxPlayers,
        }))

        socket.emit('rooms-list', roomList)
      })
    })
  }

  private serializeRoom(room: Room) {
    return {
      id: room.id,
      name: room.name,
      players: Array.from(room.players.values()).map(this.serializePlayer),
      maxPlayers: room.maxPlayers,
      createdAt: room.createdAt,
    }
  }

  private serializePlayer(player: Player) {
    return {
      id: player.id,
      name: player.name,
      x: player.x,
      y: player.y,
      roomId: player.roomId,
    }
  }

  public close() {
    clearInterval(this.cleanupInterval)
    this.httpServer.close()
  }
}

// Start server if running directly
if (require.main === module) {
  const port = parseInt(process.env.WEBSOCKET_PORT || '3001')
  new GameServer(port)
}

export default GameServer
