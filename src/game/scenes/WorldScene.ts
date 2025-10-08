import Phaser from 'phaser'

export class WorldScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private playerSpeed: number = 200

  constructor() {
    super({ key: 'WorldScene' })
  }

  preload() {
    // Load assets here in the future
  }

  create() {
    const { width, height } = this.cameras.main

    // Background
    this.add.rectangle(0, 0, width, height, 0x16213e).setOrigin(0)

    // Title
    const title = this.add.text(width / 2, 30, 'World Map - Explore & Learn', {
      fontSize: '32px',
      color: '#10B981',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // Create player (simple placeholder)
    this.player = this.physics.add.sprite(width / 2, height / 2, '')
    this.player.setDisplaySize(40, 40)
    this.add.rectangle(this.player.x, this.player.y, 40, 40, 0x4f46e5)
    this.player.setCollideWorldBounds(true)

    // Add player label
    const playerLabel = this.add.text(this.player.x, this.player.y - 30, 'You', {
      fontSize: '16px',
      color: '#ffffff',
    })
    playerLabel.setOrigin(0.5)

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
      'Use Arrow Keys to Move | Approach Mentors to Start Learning',
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

  update() {
    if (!this.player || !this.cursors) return

    // Player movement
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-this.playerSpeed)
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(this.playerSpeed)
    } else {
      this.player.setVelocityX(0)
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-this.playerSpeed)
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(this.playerSpeed)
    } else {
      this.player.setVelocityY(0)
    }
  }
}