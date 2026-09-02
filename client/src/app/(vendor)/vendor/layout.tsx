/**
 * Vendor area layout (/vendor/*).
 *
 * Rendering strategy: static SSR. Full vendor shell (sidebar/topbar) lands in a
 * later task; this is a minimal placeholder. The middleware guarantees only
 * VENDOR users reach this area.
 */
export default function VendorAreaLayout({
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
