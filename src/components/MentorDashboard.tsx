'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { Camera, ChevronLeft, Bell } from 'lucide-react';

interface MentorDashboardProps {
  profile: UserProfile;
  onProfilePictureClick: () => void;
}

export default function MentorDashboard({ profile, onProfilePictureClick }: MentorDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [showDailyTest, setShowDailyTest] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [testAnswered, setTestAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dailyQuestions, setDailyQuestions] = useState<any[]>([]);

  useEffect(() => { 
    setMounted(true);
    loadUserProgress();
    generateDailyQuestions();
    subscribeToNotifications();
  }, []);

  const loadUserProgress = () => {
    const saved = localStorage.getItem(`mentor_progress_${profile.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setUserLevel(data.level || 1);
    }
  };

  const saveUserProgress = (level: number) => {
    localStorage.setItem(`mentor_progress_${profile.id}`, JSON.stringify({ level }));
  };

  const subscribeToNotifications = () => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.1) { // 10% chance every 5 seconds
        const newNotif = {
          id: Date.now(),
          type: 'match',
          message: 'New mentee matched with you!',
          timestamp: new Date().toLocaleTimeString(),
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 10));
      }
    }, 5000);
    return () => clearInterval(interval);
  };

  const generateDailyQuestions = () => {
    const today = new Date().toDateString();
    const savedQuestions = localStorage.getItem(`daily_questions_${today}`);
    
    if (savedQuestions) {
      setDailyQuestions(JSON.parse(savedQuestions));
      return;
    }

    const allQuestions = [
      // JavaScript
      { difficulty: 'Easy', topic: 'JavaScript', question: 'What is the difference between var, let, and const?', options: ['No difference', 'var is function-scoped, let/const are block-scoped', 'var is faster', 'let is deprecated'], correct: 1 },
      { difficulty: 'Medium', topic: 'JavaScript', question: 'What is a closure in JavaScript?', options: ['A loop', 'Function with access to outer scope variables', 'A class', 'An error'], correct: 1 },
      { difficulty: 'Hard', topic: 'JavaScript', question: 'What is event loop in JavaScript?', options: ['HTML loop', 'Mechanism that handles async operations', 'Function type', 'Debug tool'], correct: 1 },
      
      // Database
      { difficulty: 'Easy', topic: 'Database', question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Question Language', 'System Quality Logic', 'Standard Query List'], correct: 0 },
      { difficulty: 'Medium', topic: 'Database', question: 'What is a primary key?', options: ['Any column', 'Unique identifier for records', 'Foreign reference', 'Index type'], correct: 1 },
      { difficulty: 'Hard', topic: 'Database', question: 'What is database normalization?', options: ['Backup process', 'Organizing data to reduce redundancy', 'Encryption method', 'Query optimization'], correct: 1 },
      
      // Python
      { difficulty: 'Easy', topic: 'Python', question: 'How do you create a list in Python?', options: ['{}', '[]', '()', '<>'], correct: 1 },
      { difficulty: 'Medium', topic: 'Python', question: 'What is a decorator in Python?', options: ['UI component', 'Function that modifies another function', 'Variable type', 'Loop'], correct: 1 },
      { difficulty: 'Hard', topic: 'Python', question: 'What is GIL in Python?', options: ['Graphics Library', 'Global Interpreter Lock', 'General Input Loop', 'Generator Interface'], correct: 1 },
      
      // React
      { difficulty: 'Easy', topic: 'React', question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax', 'JSON eXtension', 'jQuery Extra'], correct: 0 },
      { difficulty: 'Medium', topic: 'React', question: 'What are React Hooks?', options: ['CSS styles', 'Functions to use state in functional components', 'Event handlers', 'Routers'], correct: 1 },
      { difficulty: 'Hard', topic: 'React', question: 'What is useEffect hook used for?', options: ['Styling', 'Side effects in functional components', 'State management', 'Routing'], correct: 1 },
      
      // Node.js
      { difficulty: 'Easy', topic: 'Node.js', question: 'What is Node.js?', options: ['Database', 'JavaScript runtime', 'CSS framework', 'Testing tool'], correct: 1 },
      { difficulty: 'Medium', topic: 'Node.js', question: 'What is Express.js?', options: ['Database', 'Web framework for Node.js', 'Frontend library', 'CSS tool'], correct: 1 },
      { difficulty: 'Hard', topic: 'Node.js', question: 'What is middleware in Express?', options: ['Database layer', 'Functions that execute during request-response cycle', 'Frontend component', 'Testing framework'], correct: 1 },
      
      // Web Development
      { difficulty: 'Easy', topic: 'Web Dev', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks Text Markup'], correct: 0 },
      { difficulty: 'Medium', topic: 'Web Dev', question: 'What is REST API?', options: ['Database type', 'Architectural style for web services', 'Programming language', 'CSS framework'], correct: 1 },
      { difficulty: 'Hard', topic: 'Web Dev', question: 'What is CORS?', options: ['Database', 'Cross-Origin Resource Sharing', 'CSS property', 'HTML tag'], correct: 1 },
      
      // Algorithms
      { difficulty: 'Easy', topic: 'Algorithms', question: 'What is Big O notation?', options: ['Error type', 'Complexity analysis', 'Variable name', 'Loop type'], correct: 1 },
      { difficulty: 'Medium', topic: 'Algorithms', question: 'What is binary search time complexity?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
      { difficulty: 'Hard', topic: 'Algorithms', question: 'What is dynamic programming?', options: ['UI design', 'Optimization by storing subproblem results', 'Web framework', 'Database method'], correct: 1 },
      
      // More questions...
      { difficulty: 'Easy', topic: 'JavaScript', question: 'What is an array?', options: ['Single value', 'Ordered collection of elements', 'String type', 'Function'], correct: 1 },
      { difficulty: 'Medium', topic: 'Database', question: 'What is JOIN in SQL?', options: ['Delete records', 'Combine rows from tables', 'Create table', 'Update data'], correct: 1 },
      { difficulty: 'Easy', topic: 'Python', question: 'What is a tuple?', options: ['Mutable list', 'Immutable sequence', 'Dictionary', 'Function'], correct: 1 },
      { difficulty: 'Medium', topic: 'React', question: 'What is state in React?', options: ['CSS property', 'Data that changes over time', 'HTML tag', 'Router'], correct: 1 },
      { difficulty: 'Hard', topic: 'Node.js', question: 'What is async/await?', options: ['Loop type', 'Handle asynchronous operations', 'Variable declaration', 'Error handler'], correct: 1 },
      { difficulty: 'Easy', topic: 'Web Dev', question: 'What is CSS?', options: ['Cascading Style Sheets', 'Computer System Style', 'Code Style System', 'Central Style Sheets'], correct: 0 },
      { difficulty: 'Medium', topic: 'Algorithms', question: 'What is recursion?', options: ['Loop', 'Function calling itself', 'Array method', 'Variable type'], correct: 1 },
      { difficulty: 'Hard', topic: 'JavaScript', question: 'What is prototype chain?', options: ['HTML links', 'Object inheritance mechanism', 'Array type', 'Debug method'], correct: 1 },
      { difficulty: 'Easy', topic: 'Database', question: 'What is a foreign key?', options: ['Primary identifier', 'Reference to primary key in another table', 'Index type', 'Query method'], correct: 1 },
      { difficulty: 'Medium', topic: 'Python', question: 'What is list comprehension?', options: ['Loop type', 'Concise way to create lists', 'Function', 'Class method'], correct: 1 },
    ];

    // Shuffle and pick 20 questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 20);
    setDailyQuestions(shuffled);
    localStorage.setItem(`daily_questions_${today}`, JSON.stringify(shuffled));
  };

  const classifications = [
    { level: '1-10', name: 'Beginner Mentor', emoji: '🌱', color: '#95d7ee', desc: 'Starting your journey' },
    { level: '11-20', name: 'Growing Mentor', emoji: '🌿', color: '#6bcf7f', desc: 'Building expertise' },
    { level: '21-30', name: 'Skilled Mentor', emoji: '🌳', color: '#ffd66b', desc: 'Mastering concepts' },
    { level: '31-40', name: 'Expert Mentor', emoji: '⚡', color: '#ff9a76', desc: 'Leading others' },
    { level: '41-50', name: 'Master Mentor', emoji: '👑', color: '#a78bfa', desc: 'Ultimate mastery' },
  ];

  const badges = [
    { name: 'Best Mentor', emoji: '🏆', locked: userLevel < 10 },
    { name: 'JavaScript Expert', emoji: '💛', locked: userLevel < 15 },
    { name: 'Database Master', emoji: '🗄️', locked: userLevel < 20 },
    { name: 'Python Pro', emoji: '🐍', locked: userLevel < 25 },
    { name: 'React Specialist', emoji: '⚛️', locked: userLevel < 30 },
    { name: 'Algorithm Guru', emoji: '🧮', locked: userLevel < 35 },
    { name: 'Web Dev Legend', emoji: '🌐', locked: userLevel < 40 },
    { name: 'Ultimate Mentor', emoji: '👑', locked: userLevel < 50 },
  ];

  const getClassification = (level: number) => {
    if (level <= 10) return { name: 'Beginner Mentor', emoji: '🌱', color: '#95d7ee', desc: 'Starting your journey' };
    if (level <= 20) return { name: 'Growing Mentor', emoji: '🌿', color: '#6bcf7f', desc: 'Building expertise' };
    if (level <= 30) return { name: 'Skilled Mentor', emoji: '🌳', color: '#ffd66b', desc: 'Mastering concepts' };
    if (level <= 40) return { name: 'Expert Mentor', emoji: '⚡', color: '#ff9a76', desc: 'Leading others' };
    return { name: 'Master Mentor', emoji: '👑', color: '#a78bfa', desc: 'Ultimate mastery' };
  };

  const current = getClassification(userLevel);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setTestAnswered(true);
    if (index === dailyQuestions[currentQuestion].correct) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < dailyQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTestAnswered(false);
    } else {
      setShowTestResults(true);
    }
  };

  const resetTest = () => {
    setShowDailyTest(false);
    setTestStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setTestAnswered(false);
    setSelectedAnswer(null);
    setShowTestResults(false);
  };

  if (!mounted) return null;

  // LEVEL DETAILS PAGE
  if (showLevelDetails) {
    return (
      <div className="space-y-6">
        <button onClick={() => setShowLevelDetails(false)} className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
          <ChevronLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">📊 Mentor Level Classifications</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classifications.map((cls, idx) => {
              const minLevel = parseInt(cls.level.split('-')[0]);
              const isUnlocked = userLevel >= minLevel;
              return (
                <div key={idx} className={`bg-white rounded-xl p-6 text-center border-2 ${isUnlocked ? 'shadow-lg' : 'opacity-50'}`} style={{ borderColor: cls.color }}>
                  <div className="text-5xl mb-3">{cls.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">Level {cls.level}</p>
                  <p className="text-gray-600 text-sm mb-3">{cls.desc}</p>
                  {isUnlocked && <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">✓ Unlocked</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, idx) => (
              <div key={idx} className={`border-2 rounded-xl p-4 text-center transition-all ${badge.locked ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-green-300 bg-green-50 shadow-md'}`}>
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <h4 className="font-bold text-sm text-gray-800">{badge.name}</h4>
                {badge.locked ? (
                  <p className="text-gray-400 text-xs mt-1">🔒 Locked</p>
                ) : (
                  <p className="text-green-500 text-xs mt-1 font-semibold">✓ Unlocked</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // TEST RESULTS
  if (showDailyTest && showTestResults) {
    const percentage = Math.round((score / dailyQuestions.length) * 100);
    const passed = percentage >= 50;
    const levelsEarned = passed ? Math.floor(score / 5) : 0;
    
    return (
      <div className="space-y-6">
        <button onClick={resetTest} className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow-lg">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl border border-white/20">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <div className="text-white text-center">
              <p className="text-4xl font-bold">{score}/{dailyQuestions.length}</p>
              <p className="text-lg">{percentage}%</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Complete!</h2>
          {passed ? (
            <>
              <p className="text-green-500 font-semibold mb-4 text-lg">🎉 Excellent Work!</p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-6 text-white shadow-lg">
                <div className="text-5xl mb-2">🎖️</div>
                <h3 className="text-xl font-bold">Way to be Mentor!</h3>
                <p className="text-lg">+{levelsEarned} Level{levelsEarned > 1 ? 's' : ''} Earned</p>
                <p className="text-sm mt-2">New Level: {userLevel + levelsEarned}</p>
              </div>
            </>
          ) : (
            <p className="text-red-500 font-semibold mb-6">Need 50% to pass. Try again tomorrow!</p>
          )}
          <button onClick={() => { if (passed) { const newLevel = Math.min(userLevel + levelsEarned, 50); setUserLevel(newLevel); saveUserProgress(newLevel); } resetTest(); }} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            Finish
          </button>
        </div>
      </div>
    );
  }

  // TAKING TEST
  if (showDailyTest && testStarted && !showTestResults && dailyQuestions.length > 0) {
    const question = dailyQuestions[currentQuestion];
    const diffColor = question.difficulty === 'Easy' ? 'bg-green-500' : question.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div className="space-y-6">
        <button onClick={resetTest} className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow-lg">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-lg border border-white/20">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all" style={{ width: `${((currentQuestion + 1) / dailyQuestions.length) * 100}%` }}></div>
            </div>
            <p className="text-right text-gray-600 font-semibold">{currentQuestion + 1}/{dailyQuestions.length}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-block px-3 py-1 ${diffColor} text-white text-sm font-semibold rounded-full`}>{question.difficulty}</span>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">{question.topic}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h2>
            <div className="space-y-3 mb-6">
              {question.options.map((option: string, index: number) => {
                let btnClass = 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50';
                if (testAnswered) {
                  if (index === question.correct) btnClass = 'border-green-500 bg-green-50';
                  else if (selectedAnswer === index) btnClass = 'border-red-500 bg-red-50';
                }
                return (
                  <button key={index} onClick={() => !testAnswered && handleAnswer(index)} disabled={testAnswered} className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${btnClass}`}>
                    <span className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">{String.fromCharCode(65 + index)}</span>
                    <span className="text-gray-700 flex-1 text-left font-medium">{option}</span>
                    {testAnswered && index === question.correct && <span className="text-green-500 font-bold text-xl">✓</span>}
                    {testAnswered && selectedAnswer === index && index !== question.correct && <span className="text-red-500 font-bold text-xl">✗</span>}
                  </button>
                );
              })}
            </div>
            {testAnswered && (
              <button onClick={handleNextQuestion} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                {currentQuestion + 1 === dailyQuestions.length ? 'See Results' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // START TEST
  if (showDailyTest && !testStarted) {
    return (
      <div className="space-y-6">
        <button onClick={resetTest} className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow-lg">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">🎯 Daily IT Knowledge Test</h1>
          <p className="text-gray-500 mb-8">20 Questions • Different Topics • Earn Levels</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-md"><p className="text-gray-500 text-sm mb-1">📝 Questions</p><p className="text-2xl font-bold text-indigo-600">20</p></div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-md"><p className="text-gray-500 text-sm mb-1">⏱️ Time</p><p className="text-2xl font-bold text-purple-600">∞</p></div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 shadow-md"><p className="text-gray-500 text-sm mb-1">🏅 Levels</p><p className="text-2xl font-bold text-yellow-600">+1-4</p></div>
          </div>
          <button onClick={() => setTestStarted(true)} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
            Start Test
          </button>
        </div>
      </div>
    );
  }

  // MAIN MENTOR DASHBOARD
  return (
    <div className="space-y-6">
      {/* Notifications Bar */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Bell className="w-5 h-5" />
          Notifications
          {notifications.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>
        
        {showNotifications && notifications.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 max-h-80 overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className="flex items-start gap-3 p-3 hover:bg-blue-50 rounded-lg transition-all mb-2">
                <div className="text-2xl">🔔</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-500">{notif.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {profile.name}! 👋</h1>
        <p className="text-gray-600">You're currently in <span className="text-purple-600 font-semibold">Mentor</span> mode</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"><span className="text-3xl">👥</span><div><p className="text-2xl font-bold text-indigo-600">3</p><p className="text-gray-500 text-sm">Mentees</p></div></div>
        <div className="bg-white backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"><span className="text-3xl">📅</span><div><p className="text-2xl font-bold text-indigo-600">2</p><p className="text-gray-500 text-sm">Sessions</p></div></div>
        <div className="bg-white backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"><span className="text-3xl">🏅</span><div><p className="text-2xl font-bold text-indigo-600">{badges.filter(b => !b.locked).length}</p><p className="text-gray-500 text-sm">Badges</p></div></div>
        <div className="bg-white backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"><span className="text-3xl">📊</span><div><p className="text-2xl font-bold text-indigo-600">{Math.round((userLevel/50)*100)}%</p><p className="text-gray-500 text-sm">Progress</p></div></div>
      </div>

      <div className="bg-white backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Your Mentor Level</h2>
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-6xl">{current.emoji}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{current.name}</h3>
              <p className="text-indigo-600 font-semibold text-lg">Level {userLevel} / 50</p>
              <p className="text-gray-500 text-sm">{current.desc}</p>
            </div>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(userLevel / 50) * 100}%`, backgroundColor: current.color }}></div>
          </div>
          <button onClick={() => setShowLevelDetails(true)} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            📋 View All Levels & Badges
          </button>
        </div>
      </div>

      <div className="bg-white backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Daily IT Knowledge Test</h2>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-5xl">📝</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">20 IT Questions Challenge</h3>
              <p className="text-gray-600 mb-1">Test your knowledge across multiple topics</p>
              <p className="text-pink-500 font-semibold text-sm">✨ New questions every day!</p>
            </div>
          </div>
          <button onClick={() => setShowDailyTest(true)} className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
            Start Today's Test
          </button>
        </div>
      </div>
    </div>
  );
}