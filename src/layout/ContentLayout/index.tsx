'use client';

import Header from "./Header";

export default function ContentLayout({ children }: {children: React.ReactNode}) {
  return (
    <>
      <nav>
        <Header></Header>
      </nav>
      <div>{children}</div>
    </>
  );
}
