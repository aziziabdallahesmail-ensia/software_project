import { redirect } from "next/navigation";

// Redirect root to the (index) route group's home page
export default function Home() {
  redirect("/home");
}
