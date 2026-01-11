export default function GameCard({ title, description, href, color = 'bg-blue-600' }: { title: string; description: string; href: string; color?: string }) {
  return (
    <a href={href} className="group block p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white ring-1 ring-gray-100">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8v6a6 6 0 0012 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>

        <div className="ml-4 flex items-center">
          <button className="text-sm text-white px-3 py-1 rounded shadow-sm bg-gray-800 group-hover:bg-black">Play</button>
        </div>
      </div>
    </a>
  )
}