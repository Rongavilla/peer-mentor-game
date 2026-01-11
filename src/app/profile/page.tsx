import ProfilePicture from '@/components/ProfilePicture'

export default function ProfilePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <ProfilePicture initial="/default-avatar.png" />
    </main>
  )
}