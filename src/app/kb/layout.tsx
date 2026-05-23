export default function KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0e0e0e] text-white">
      {children}
    </div>
  );
}
