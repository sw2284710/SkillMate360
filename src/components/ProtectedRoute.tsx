import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // अगर token नहीं है तो sign-in पर redirect करो
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
