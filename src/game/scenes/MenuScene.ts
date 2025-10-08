import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  preload() {
    // Load assets here in the future
  }

  create() {
    const { width, height } = this.cameras.main

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0)

    // Title
    const title = this.add.text(width / 2, height / 4, 'CodeQuest Academy', {
      fontSize: '64px',
      color: '#4F46E5',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 4 + 80, 'Peer Mentor Game', {
      fontSize: '32px',
      color: '#10B981',
    })
    subtitle.setOrigin(0.5)

    // Start Button
    const startButton = this.add.rectangle(width / 2, height / 2 + 50, 300, 80, 0x4f46e5)
    const startText = this.add.text(width / 2, height / 2 + 50, 'Start Game', {
      fontSize: '32px',
      color: '#ffffff',
    })
    startText.setOrigin(0.5)

    // Make button interactive
    startButton.setInteractive({ useHandCursor: true })
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0x6366f1)
    })
    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x4f46e5)
    })
    startButton.on('pointerdown', () => {
      this.scene.start('WorldScene')
    })

    // Instructions
    const instructions = this.add.text(
      width / 2,
      height - 100,
      'Click Start to begin your mentorship journey!',
      {
        fontSize: '20px',
        color: '#F59E0B',
      }
    )
    instructions.setOrigin(0.5)
  }

  update() {
    // Game loop logic
  }
}