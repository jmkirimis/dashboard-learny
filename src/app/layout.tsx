import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { ChildProvider } from "@/contexts/ChildContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        <AlertProvider>
          <UserProvider>
            <ChildProvider>
              {children}
            </ChildProvider>
          </UserProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
