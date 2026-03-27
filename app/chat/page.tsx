import { ChatInterface } from '@/components/chat-interface';

export const metadata = {
  title: 'Messages - SkillSwap',
  description: 'Connect with other students through real-time messaging.',
};

export default function ChatPage() {
  return (
    <main className="h-screen overflow-hidden">
      <ChatInterface />
    </main>
  );
}
