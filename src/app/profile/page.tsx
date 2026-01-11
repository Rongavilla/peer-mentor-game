// ...existing code...
// Option A (uses tsconfig path alias; may fail if alias not configured)
import ProfilePicture from '@/components/ProfilePicture'

// Option B (safe relative import)
import ProfilePicture from '../../components/ProfilePicture'

// ...inside the page JSX where you want the avatar...
<ProfilePicture initial="/path/to/current/avatar.png" />
// ...existing code...