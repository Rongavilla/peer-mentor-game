import Phaser from 'phaser'

interface OtherPlayer {
  sprite: Phaser.GameObjects.Rectangle
  label: Phaser.GameObjects.Text
}

export class MultiplayerWorldScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite
  private playerRect?: Phaser.GameObjects.Rectangle
  private playerLabel?: Phaser.GameObjects.Text
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private playerSpeed: number = 200
  private otherPlayers: Map<string, OtherPlayer> = new Map()
  private lastMoveTime: number = 0
  private moveThrottle: number = 50 // Send position updates every 50ms

  constructor() {
    super({ key: 'MultiplayerWorldScene' })
  }

  preload() {
    // Load assets here in the future
  }

  create() {
    const { width, height } = this.cameras.main

    // Background
    this.add.rectangle(0, 0, width, height, 0x16213e).setOrigin(0)

    // Title
    const title = this.add.text(width / 2, 30, 'Multiplayer World - Explore Together', {
      fontSize: '32px',
      color: '#10B981',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // Create player (simple placeholder)
    this.player = this.physics.add.sprite(width / 2, height / 2, '')
    this.player.setDisplaySize(40, 40)
    this.playerRect = this.add.rectangle(this.player.x, this.player.y, 40, 40, 0x4f46e5)
    this.player.setCollideWorldBounds(true)

    // Add player label
    this.playerLabel = this.add.text(this.player.x, this.player.y - 30, 'You', {
      fontSize: '16px',
      color: '#ffffff',
    })
    this.playerLabel.setOrigin(0.5)

    // Create some mentor NPCs (placeholders)
    this.createMentorNPC(300, 300, 'Mentor 1\n(Python)')
    this.createMentorNPC(900, 300, 'Mentor 2\n(JavaScript)')
    this.createMentorNPC(600, 500, 'Mentor 3\n(Databases)')

    // Setup input controls
    this.cursors = this.input.keyboard?.createCursorKeys()

    // Instructions
    const instructions = this.add.text(
      width / 2,
      height - 50,
      'Use Arrow Keys to Move | See other players in real-time',
      {
        fontSize: '18px',
        color: '#F59E0B',
      }
    )
    instructions.setOrigin(0.5)

    // Back button
    const backButton = this.add.rectangle(100, 50, 150, 50, 0x8b5cf6)
    const backText = this.add.text(100, 50, 'Menu', {
      fontSize: '24px',
      color: '#ffffff',
    })
    backText.setOrigin(0.5)
    backButton.setInteractive({ useHandCursor: true })
    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene')
    })

    // Listen for socket events from the registry
    this.registry.events.on('player-joined', this.handlePlayerJoined, this)
    this.registry.events.on('player-left', this.handlePlayerLeft, this)
    this.registry.events.on('player-moved', this.handlePlayerMoved, this)
  }

  createMentorNPC(x: number, y: number, label: string) {
    // Create NPC rectangle
    const npc = this.add.rectangle(x, y, 50, 50, 0x10b981)
    npc.setInteractive({ useHandCursor: true })

    // Add label
    const npcLabel = this.add.text(x, y + 40, label, {
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
    })
    npcLabel.setOrigin(0.5)

    // Make interactive
    npc.on('pointerdown', () => {
      this.scene.start('BattleScene', { mentor: label })
    })

    // Hover effect
    npc.on('pointerover', () => {
      npc.setFillStyle(0x34d399)
    })
    npc.on('pointerout', () => {
      npc.setFillStyle(0x10b981)
    })
  }

  handlePlayerJoined(data: { player: { id: string; name: string; x: number; y: number } }) {
    if (this.otherPlayers.has(data.player.id)) return

    // Create visual representation for the other player
    const sprite = this.add.rectangle(data.player.x, data.player.y, 40, 40, 0x10b981)
    const label = this.add.text(data.player.x, data.player.y - 30, data.player.name, {
      fontSize: '16px',
      color: '#ffffff',
    })
    label.setOrigin(0.5)

    this.otherPlayers.set(data.player.id, { sprite, label })
    console.log('Player joined:', data.player.name)
  }

  handlePlayerLeft(data: { playerId: string }) {
    const otherPlayer = this.otherPlayers.get(data.playerId)
    if (otherPlayer) {
      otherPlayer.sprite.destroy()
      otherPlayer.label.destroy()
      this.otherPlayers.delete(data.playerId)
      console.log('Player left:', data.playerId)
    }
  }

  handlePlayerMoved(data: { playerId: string; x: number; y: number }) {
    const otherPlayer = this.otherPlayers.get(data.playerId)
    if (otherPlayer) {
      // Smooth movement using tween
      this.tweens.add({
        targets: otherPlayer.sprite,
        x: data.x,
        y: data.y,
        duration: 50,
        ease: 'Linear',
      })

      // Update label position to follow sprite
      this.tweens.add({
        targets: otherPlayer.label,
        x: data.x,
        y: data.y - 30,
        duration: 50,
        ease: 'Linear',
      })
    }
  }

  update() {
    if (!this.player || !this.cursors || !this.playerRect || !this.playerLabel) return

    let isMoving = false

    // Player movement
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-this.playerSpeed)
      isMoving = true
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(this.playerSpeed)
      isMoving = true
    } else {
      this.player.setVelocityX(0)
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-this.playerSpeed)
      isMoving = true
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(this.playerSpeed)
      isMoving = true
    } else {
      this.player.setVelocityY(0)
    }

    // Update player rectangle and label position
    this.playerRect.setPosition(this.player.x, this.player.y)
    this.playerLabel.setPosition(this.player.x, this.player.y - 30)

    // Emit position to server (throttled)
    if (isMoving) {
      const now = Date.now()
      if (now - this.lastMoveTime > this.moveThrottle) {
        this.registry.events.emit('move-player', {
          x: this.player.x,
          y: this.player.y,
        })
        this.lastMoveTime = now
      }
    }
  }
}
