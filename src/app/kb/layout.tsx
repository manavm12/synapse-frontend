import { AppHeader } from "@/components/app-header";

export default function KBLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0e0e0e] text-white">
      <AppHeader
        breadcrumbs={[
          { label: "✦ Synapse", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Knowledge Base", href: "/kb" },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
