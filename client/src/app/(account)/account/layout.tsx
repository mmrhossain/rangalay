/**
 * Customer area layout (/account/*).
 *
 * Rendering strategy: static SSR. Full customer shell (sidebar/topbar) lands in
 * a later task; this is a minimal placeholder. The middleware guarantees only
 * CUSTOMER users reach this area. This customer area uses the NEW backend -
 * the PHP storefront's (user)/customer/* pages are separate and untouched.
 */
export default function CustomerAreaLayout({
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
