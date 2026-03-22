import { Header } from "@/components/ui/header";
import { getCurrentUser } from "@/actions/set_user_role";

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const showHeader = user && user.role;

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header user={user} />}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
