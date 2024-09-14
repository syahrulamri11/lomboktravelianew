import React from 'react';
import Sidebar from '../../components/sidebar';

const AdminLayout = ({ children, showSidebar }) => {
  return (
    <div className="flex">
      {showSidebar && (
        <div className="w-48"> 
          <Sidebar />
        </div>
      )}
      <div className="flex-1">
        <main className="p-3">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
