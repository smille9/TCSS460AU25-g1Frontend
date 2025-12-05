'use client';

import Header from './Header';

export default function ContentLayout({ children }: {children: React.ReactNode}) {
  return (
    <>
      <nav>
        <Header></Header>
      </nav>
      <div style={{ marginLeft: '36px', marginRight: '36px' }}>{children}</div>
    </>
  );
}
