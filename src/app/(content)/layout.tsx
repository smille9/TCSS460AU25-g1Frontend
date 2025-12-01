import ContentLayout from 'layout/ContentLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ContentLayout>{children}</ContentLayout>
    </AuthGuard>
  );
}
