// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// export default async function Home() {
//   const token = (await cookies()).get("token")?.value;
//   if (token) {
//     redirect("/dashboard");
//   }
//   redirect("/login");
// }

import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return <LoginForm />;
}
