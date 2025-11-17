import AuthGuard from 'utils/route-guard/AuthGuard';
import ResetPassword from 'views/auth/reset-password';

// ==============================|| PAGE ||============================== //

export default function ResetPassPage() {
  return (
    <AuthGuard>
      <ResetPassword />
    </AuthGuard>
  );
}
