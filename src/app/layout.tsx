import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { getUserFromCookie } from "@/lib/auth";

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Learny Dashboard",
  description: "Dashboard destinados para os pais gerenciarem as atividades dos filhos dentro do app Learny",
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getUserFromCookie();
  
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        <AlertProvider>
          <UserProvider initialUser={user}>
              {children}
          </UserProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
