/**
 * Admin area layout (/admin/*).
 *
 * Rendering strategy: static SSR. The collapsible sidebar + topbar shell is
 * implemented in a later task; this is a minimal placeholder so the admin area
 * compiles. The middleware guarantees only ADMIN users reach this layout.
 */
export default function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
}
