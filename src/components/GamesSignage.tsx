export default function GamesSignage() {
  return (
    <section className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Games and Challenges</h2>
          <p className="mt-1 text-sm text-gray-600">Play short IT-themed games to earn badges and learn while having fun.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/games/four-pics" className="block p-6 rounded-lg shadow-sm bg-white ring-1 ring-gray-100 hover:shadow-md">
          <h3 className="text-lg font-semibold">4 Pics 1 Word</h3>
          <p className="mt-1 text-sm text-gray-600">Find the one word that ties four IT-themed images together.</p>
        </a>

        <a href="/games/it-logo" className="block p-6 rounded-lg shadow-sm bg-white ring-1 ring-gray-100 hover:shadow-md">
          <h3 className="text-lg font-semibold">Guess the IT Logo</h3>
          <p className="mt-1 text-sm text-gray-600">Identify the company from its logo — quick recognition practice.</p>
        </a>
      </div>
    </section>
  )
}