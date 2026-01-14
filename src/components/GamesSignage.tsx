export default function GamesSignage() {
  return (
    <section className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Games and Challenges</h2>
        <p className="mt-1 text-sm text-gray-600">Play short IT-themed games to earn badges and learn while having fun.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a href="/games/four-pics" className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="p-6 text-center">
            <img src="/games/four-pics-improved-logo.svg" alt="4 Pics 1 Word" className="w-32 h-32 mx-auto mb-3 rounded-lg" />
            <h3 className="text-lg font-semibold text-gray-900">4 Pics 1 Word</h3>
            <p className="mt-2 text-sm text-gray-600">Find the one word that ties four IT-themed images together.</p>
            <button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md font-medium hover:bg-cyan-700">Play Now</button>
          </div>
        </a>

        <a href="/games/matching" className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-pink-50 to-rose-50">
          <div className="p-6 text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-lg bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Let's Match</h3>
            <p className="mt-2 text-sm text-gray-600">Find the perfect mentor or mentee using AI-powered expertise matching.</p>
            <button className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md font-medium hover:bg-rose-700">Play Now</button>
          </div>
        </a>
      </div>
    </section>
  )
}