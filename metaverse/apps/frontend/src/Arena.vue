<template>
    <div class="p-4" tabindex="0" @keydown="handleKeyDown">
      <h1 class="text-2xl font-bold mb-4">Arena</h1>
      <div class="mb-4">
        <p class="text-sm text-gray-600">Token: {{ params.token }}</p>
        <p class="text-sm text-gray-600">Space ID: {{ params.spaceId }}</p>
        <p class="text-sm text-gray-600">Connected Users: {{ connectedUsersCount }}</p>
      </div>
      <div class="border rounded-lg overflow-hidden">
        <canvas
          ref="canvasRef"
          width="2000"
          height="2000"
          class="bg-white"
        />
      </div>
      <p class="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Arena',
    data() {
      return {
        wsRef: null,
        currentUser: {},
        users: new Map(),
        params: {
          token: '',
          spaceId: ''
        }
      }
    },
    computed: {
      connectedUsersCount() {
        return this.users.size + (this.currentUser?.userId ? 1 : 0)
      }
    },
    mounted() {
      this.initializeArena()
      this.setupWebSocket()
    },
    unmounted() {
      if (this.wsRef) {
        this.wsRef.close()
      }
    },
    watch: {
      currentUser: {
        deep: true,
        handler() {
          this.drawArena()
        }
      },
      users: {
        deep: true,
        handler() {
          this.drawArena()
        }
      }
    },
    methods: {
      initializeArena() {
        const urlParams = new URLSearchParams(window.location.search)
        this.params.token = urlParams.get('token') || ''
        this.params.spaceId = urlParams.get('spaceId') || ''
      },
      
      setupWebSocket() {
        this.wsRef = new WebSocket('ws://localhost:3001')
        
        this.wsRef.onopen = () => {
          this.wsRef.send(JSON.stringify({
            type: 'join',
            payload: {
              spaceId: this.params.spaceId,
              token: this.params.token
            }
          }))
        }
  
        this.wsRef.onmessage = (event) => {
          const message = JSON.parse(event.data)
          this.handleWebSocketMessage(message)
        }
      },
  
      handleWebSocketMessage(message) {
        switch (message.type) {
          case 'space-joined':
            console.log("set")
            console.log({
              x: message.payload.spawn.x,
              y: message.payload.spawn.y,
              userId: message.payload.userId
            })
            this.currentUser = {
              x: message.payload.spawn.x,
              y: message.payload.spawn.y,
              userId: message.payload.userId
            }
            
            const userMap = new Map()
            message.payload.users.forEach(user => {
              userMap.set(user.userId, user)
            })
            this.users = userMap
            break
  
          case 'user-joined':
            this.users.set(message.payload.userId, {
              x: message.payload.x,
              y: message.payload.y,
              userId: message.payload.userId
            })
            this.users = new Map(this.users)
            break
  
          case 'movement':
            const user = this.users.get(message.payload.userId)
            if (user) {
              user.x = message.payload.x
              user.y = message.payload.y
              this.users.set(message.payload.userId, user)
              this.users = new Map(this.users)
            }
            break
  
          case 'movement-rejected':
            this.currentUser = {
              ...this.currentUser,
              x: message.payload.x,
              y: message.payload.y
            }
            break
  
          case 'user-left':
            this.users.delete(message.payload.userId)
            this.users = new Map(this.users)
            break
        }
      },
  
      handleMove(newX, newY) {
        if (!this.currentUser) return
        
        this.wsRef.send(JSON.stringify({
          type: 'move',
          payload: {
            x: newX,
            y: newY,
            userId: this.currentUser.userId
          }
        }))
      },
  
      drawArena() {
        console.log("render")
        const canvas = this.$refs.canvasRef
        if (!canvas) return
        console.log("below render")
        
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
  
        // Draw grid
        ctx.strokeStyle = '#eee'
        for (let i = 0; i < canvas.width; i += 50) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i, canvas.height)
          ctx.stroke()
        }
        for (let i = 0; i < canvas.height; i += 50) {
          ctx.beginPath()
          ctx.moveTo(0, i)
          ctx.lineTo(canvas.width, i)
          ctx.stroke()
        }
  
        console.log("before currentuser")
        console.log(this.currentUser)
        // Draw current user
        if (this.currentUser && this.currentUser.x !== undefined) {
          console.log("drawing myself")
          console.log(this.currentUser)
          ctx.beginPath()
          ctx.fillStyle = '#FF6B6B'
          ctx.arc(this.currentUser.x * 50, this.currentUser.y * 50, 20, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#000'
          ctx.font = '14px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('You', this.currentUser.x * 50, this.currentUser.y * 50 + 40)
        }
  
        // Draw other users
        this.users.forEach(user => {
          if (user.x === undefined) return
          console.log("drawing other user")
          console.log(user)
          ctx.beginPath()
          ctx.fillStyle = '#4ECDC4'
          ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#000'
          ctx.font = '14px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(`User ${user.id}`, user.x * 50, user.y * 50 + 40)
        })
      },
  
      handleKeyDown(e) {
        if (!this.currentUser) return
  
        const { x, y } = this.currentUser
        switch (e.key) {
          case 'ArrowUp':
            this.handleMove(x, y - 1)
            break
          case 'ArrowDown':
            this.handleMove(x, y + 1)
            break
          case 'ArrowLeft':
            this.handleMove(x - 1, y)
            break
          case 'ArrowRight':
            this.handleMove(x + 1, y)
            break
        }
      }
    }
  }
  </script>