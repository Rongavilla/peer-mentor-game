<<<<<<< HEAD
// ...existing code...
export default function Footer() {
  return (
    <footer className="mt-8 py-6 text-center border-t text-sm text-gray-600">
      © {new Date().getFullYear()} StudyQuest
    </footer>
  )
}
// ...existing code...
=======
'use client'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between text-sm text-gray-500">
        <div>© {new Date().getFullYear()} StudyQuest</div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
>>>>>>> c36df609db213125912bc0b5f13b9a464004dc0c
