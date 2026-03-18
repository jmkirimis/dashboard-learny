import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";

interface Props {
    children: React.ReactNode;
}

export default function Container({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      {/* Logo */}
      <Image
        src="/images/logo-com-contorno.png"
        alt="Logo"
        width={60}
        height={60}
        className="absolute right-14 top-6"
      />

      <main className="flex-1 flex flex-col bg-white py-6 text-zinc-800 font-montserrat">
        {children}
      </main>
    </div>
  );
}
