import ContentLayout from 'layout/ContentLayout';
import Footer from 'layout/DashboardLayout/Footer';
import AuthGuard from 'utils/route-guard/AuthGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ContentLayout>{children}</ContentLayout>
      <br /> <br />
      <Footer></Footer>
    </AuthGuard>
  );
}
