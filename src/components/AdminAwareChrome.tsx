"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminAwareChrome({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  );
}

