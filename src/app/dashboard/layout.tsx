import DashboardHeader from "@/components/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, this layout would be protected by authentication middleware.
  // For this demo, we assume the user is logged in if they reach this page.
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 container py-8">
        {children}
      </main>
    </div>
  );
}
