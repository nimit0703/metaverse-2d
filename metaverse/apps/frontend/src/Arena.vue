<template>
  <div class="container mt-4 p-4 border rounded shadow-lg bg-light" tabindex="0" @keydown="handleKeyDown">
    <h1 class="text-center text-primary mb-4">Welcome to the Arena</h1>
    <div class="arena-container d-flex justify-content-center border rounded bg-white p-2 position-relative">
      <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" class="border bg-light shadow"></canvas>
      <div class="arena-info text-center mt-3">
        <p class="text-muted">Use arrow keys to move your avatar.</p>
        <p class="text-primary">Connected Players: {{ connectedUsersCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Arena",
  data() {
    return {
      canvasContext: null,
      currentUser: { x: 0, y: 0, size: 100 }, // Avatar position and size
      users: new Map(),
      obstacles: [
        { x: 200, y: 150, width: 100, height: 100 },
        { x: 500, y: 300, width: 100, height: 100 },
        { x: 700, y: 100, width: 100, height: 100 },
      ], // Obstacles with positions and sizes
      backgroundImage: null, // Image object for the background
      canvasHeight: 700,
      canvasWidth: 1000,
      avatarImage: null, // Image object for the avatar
    };
  },
  computed: {
    connectedUsersCount() {
      return this.users.size + 1; // Including current user
    },
  },
  mounted() {
    this.initializeCanvas();
    this.loadBackgroundImage();
  },
  methods: {
    initializeCanvas() {
      const canvas = this.$refs.canvasRef;
      this.canvasContext = canvas.getContext("2d");
    },
    loadBackgroundImage() {
      this.backgroundImage = new Image();
      this.backgroundImage.src = "./src/assets/office.jpg"; // Path to your image

      this.avatarImage = new Image();
      this.avatarImage.src = "./src/assets/avtar3.png"; // Path to your avatar image

      this.backgroundImage.onload = () => this.drawArena();
      this.avatarImage.onload = () => this.drawArena();
    },
    drawArena() {
      const canvas = this.$refs.canvasRef;
      const ctx = this.canvasContext;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the background image
      if (this.backgroundImage) {
        ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
      }

      // Draw obstacles
      this.obstacles.forEach((obstacle) => {
        ctx.fillStyle = "gray";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      // Draw the current user's avatar
      if (this.avatarImage) {
        this.drawAvatar(ctx, this.currentUser.x, this.currentUser.y);
      }

      // Draw other users' avatars
      this.users.forEach((user) => {
        this.drawAvatar(ctx, user.x, user.y, "red");
      });
    },
    drawAvatar(ctx, x, y, color) {
      const size = this.currentUser.size;
      if (this.avatarImage) {
        ctx.drawImage(
          this.avatarImage,
          x - size / 2,
          y - size / 2,
          size,
          size
        );
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, this.currentUser.size / 2, 0, Math.PI * 2); // Circle avatar
        ctx.fill();
      }
    },
    handleKeyDown(e) {
      const moveStep = 10; // Pixels to move per key press
      let newX = this.currentUser.x;
      let newY = this.currentUser.y;

      switch (e.key) {
        case "ArrowUp":
          newY = Math.max(newY - moveStep, this.currentUser.size / 2);
          break;
        case "ArrowDown":
          newY = Math.min(
            newY + moveStep,
            this.canvasHeight - this.currentUser.size / 2
          );
          break;
        case "ArrowLeft":
          newX = Math.max(newX - moveStep, this.currentUser.size / 2);
          break;
        case "ArrowRight":
          newX = Math.min(
            newX + moveStep,
            this.canvasWidth - this.currentUser.size / 2
          );
          break;
      }

      // Check if the new position collides with any obstacle
      if (!this.checkCollision(newX, newY)) {
        this.currentUser.x = newX;
        this.currentUser.y = newY;
        this.drawArena();
      }
    },
    checkCollision(newX, newY) {
      const halfSize = this.currentUser.size / 2;

      return this.obstacles.some((obstacle) => {
        return (
          newX + halfSize > obstacle.x &&
          newX - halfSize < obstacle.x + obstacle.width &&
          newY + halfSize > obstacle.y &&
          newY - halfSize < obstacle.y + obstacle.height
        );
      });
    },
  },
};
</script>

<style scoped>
.arena-container {
  position: relative;
  margin: 0 auto;
  max-width: 1000px;
}

canvas {
  display: block;
  margin: 0 auto;
}
</style>
