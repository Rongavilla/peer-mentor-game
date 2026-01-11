export default function Header() {
  return (
    <header className="py-4 px-6 border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-semibold">StudyQuest</h1>
        <nav className="space-x-4">
          <a href="/" className="text-sm text-gray-600">Home</a>
          <a href="/about" className="text-sm text-gray-600">About</a>
          <a href="/games" className="text-sm text-gray-600 font-medium">Games</a>
        </nav>
      </div>
    </header>
  )
}