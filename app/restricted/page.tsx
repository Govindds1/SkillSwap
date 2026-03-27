import { RestrictedAccess } from "@/components/restricted-access";
import { LogoutButton } from "@/components/LogoutButton"; // Import your new button

export const metadata = {
  title: "Access Restricted - SkillSwap",
  description: "SkillSwap is available for SRM Institute students only.",
};

export default function RestrictedPage() {
  return (
    <RestrictedAccess
      attemptedEmail="Student Access Only"
      signOutButton={<LogoutButton />} // Use the clean component here
    />
  );
}