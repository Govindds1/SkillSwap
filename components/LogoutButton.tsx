"use client"; // This tells Next.js this is a browser-side component

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const { signOut } = useClerk();

  return (
    <button 
      onClick={() => signOut({ redirectUrl: "/" })}
      className="flex items-center gap-2 bg-[#EFA949] hover:bg-[#d99841] text-white px-6 py-3 rounded-xl font-bold transition-all"
    >
      <LogOut size={20} />
      <span>Sign Out & Try Again</span>
    </button>
  );
};