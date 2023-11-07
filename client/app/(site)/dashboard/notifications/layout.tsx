
export default async function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <div className="container mx-auto px-6 py-6">
        <div>{children}</div>
      </div>
    </main>
  );
}
