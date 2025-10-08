import Phaser from 'phaser'

export class BattleScene extends Phaser.Scene {
  private mentorName?: string
  private currentQuestion: number = 0
  private score: number = 0
  private questions = [
    {
      question: 'What is a variable?',
      answers: ['A container for data', 'A function', 'A loop', 'A class'],
      correct: 0,
    },
    {
      question: 'What does API stand for?',
      answers: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Process Interface', 'Application Process Integration'],
      correct: 0,
    },
    {
      question: 'What is version control?',
      answers: ['System to track code changes', 'A programming language', 'A database', 'A web framework'],
      correct: 0,
    },
  ]

  constructor() {
    super({ key: 'BattleScene' })
  }

  init(data: { mentor: string }) {
    this.mentorName = data.mentor || 'Unknown Mentor'
    this.currentQuestion = 0
    this.score = 0
  }

  create() {
    const { width, height } = this.cameras.main

    // Background
    this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0)

    // Title
    const title = this.add.text(width / 2, 50, `Learning Session with ${this.mentorName}`, {
      fontSize: '28px',
      color: '#10B981',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // Score display
    const scoreText = this.add.text(width - 150, 30, `Score: ${this.score}/${this.questions.length}`, {
      fontSize: '24px',
      color: '#F59E0B',
    })

    this.displayQuestion()

    // Back button
    const backButton = this.add.rectangle(100, 50, 150, 50, 0x8b5cf6)
    const backText = this.add.text(100, 50, 'Back', {
      fontSize: '24px',
      color: '#ffffff',
    })
    backText.setOrigin(0.5)
    backButton.setInteractive({ useHandCursor: true })
    backButton.on('pointerdown', () => {
      this.scene.start('WorldScene')
    })
  }

  displayQuestion() {
    const { width, height } = this.cameras.main
    const question = this.questions[this.currentQuestion]

    // Question text
    const questionText = this.add.text(width / 2, 200, question.question, {
      fontSize: '32px',
      color: '#ffffff',
      wordWrap: { width: width - 100 },
      align: 'center',
    })
    questionText.setOrigin(0.5)

    // Answer buttons
    question.answers.forEach((answer, index) => {
      const buttonY = 320 + index * 80
      const button = this.add.rectangle(width / 2, buttonY, 700, 60, 0x4f46e5)
      const answerText = this.add.text(width / 2, buttonY, answer, {
        fontSize: '20px',
        color: '#ffffff',
      })
      answerText.setOrigin(0.5)

      button.setInteractive({ useHandCursor: true })
      
      button.on('pointerover', () => {
        button.setFillStyle(0x6366f1)
      })
      
      button.on('pointerout', () => {
        button.setFillStyle(0x4f46e5)
      })

      button.on('pointerdown', () => {
        this.checkAnswer(index, button, answerText)
      })
    })

    // Progress indicator
    const progress = this.add.text(
      width / 2,
      height - 50,
      `Question ${this.currentQuestion + 1} of ${this.questions.length}`,
      {
        fontSize: '18px',
        color: '#9CA3AF',
      }
    )
    progress.setOrigin(0.5)
  }

  checkAnswer(selectedIndex: number, button: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text) {
    const question = this.questions[this.currentQuestion]
    const isCorrect = selectedIndex === question.correct

    if (isCorrect) {
      this.score++
      button.setFillStyle(0x10b981) // Green for correct
      
      this.time.delayedCall(1000, () => {
        this.nextQuestion()
      })
    } else {
      button.setFillStyle(0xef4444) // Red for incorrect
      
      this.time.delayedCall(1500, () => {
        this.nextQuestion()
      })
    }
  }

  nextQuestion() {
    this.currentQuestion++

    if (this.currentQuestion < this.questions.length) {
      this.scene.restart()
    } else {
      this.showResults()
    }
  }

  showResults() {
    const { width, height } = this.cameras.main

    // Clear scene
    this.children.removeAll()

    // Background
    this.add.rectangle(0, 0, width, height, 0x0f172a).setOrigin(0)

    // Results title
    const title = this.add.text(width / 2, 150, 'Learning Session Complete!', {
      fontSize: '48px',
      color: '#10B981',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // Score
    const scoreText = this.add.text(
      width / 2,
      280,
      `Your Score: ${this.score}/${this.questions.length}`,
      {
        fontSize: '36px',
        color: '#F59E0B',
      }
    )
    scoreText.setOrigin(0.5)

    // Feedback
    const percentage = (this.score / this.questions.length) * 100
    let feedback = ''
    if (percentage === 100) {
      feedback = 'Perfect! You mastered this topic! 🎉'
    } else if (percentage >= 70) {
      feedback = 'Great job! Keep learning! 👍'
    } else {
      feedback = 'Keep practicing! You can do it! 💪'
    }

    const feedbackText = this.add.text(width / 2, 360, feedback, {
      fontSize: '24px',
      color: '#ffffff',
    })
    feedbackText.setOrigin(0.5)

    // Return button
    const returnButton = this.add.rectangle(width / 2, 480, 300, 80, 0x4f46e5)
    const returnText = this.add.text(width / 2, 480, 'Return to World', {
      fontSize: '28px',
      color: '#ffffff',
    })
    returnText.setOrigin(0.5)

    returnButton.setInteractive({ useHandCursor: true })
    returnButton.on('pointerover', () => {
      returnButton.setFillStyle(0x6366f1)
    })
    returnButton.on('pointerout', () => {
      returnButton.setFillStyle(0x4f46e5)
    })
    returnButton.on('pointerdown', () => {
      this.scene.start('WorldScene')
    })
  }
}