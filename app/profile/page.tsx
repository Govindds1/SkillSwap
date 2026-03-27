import { ProfileClient } from "./profile-client";

export const metadata = {
  title: 'My Profile - SkillSwap',
  description: 'View and manage your SkillSwap profile, skills, and uploads.',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
