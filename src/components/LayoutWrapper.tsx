"use client";

import Container from "@/components/Container";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const noContainerPaths = ["/", "/cadastro"];

export default function LayoutWrapper({ children }: Props) {
  const pathname = usePathname();

  if (!pathname || noContainerPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return <Container>{children}</Container>;
}
