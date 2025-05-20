import DepartmentNavbar from './DepartmentNavbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function DepartmentLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <DepartmentNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
