import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">CMS</h1>
        <nav>
          <ul>
            <li className="mb-2"><a href="/">Dashboard</a></li>
            <li className="mb-2"><a href="/students">Students</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};
