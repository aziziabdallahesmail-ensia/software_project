import { Header } from "@/components/ui/header";
import { getCurrentUser } from "@/actions/set_user_role";

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
