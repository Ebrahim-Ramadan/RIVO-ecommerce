import React from 'react';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col  text-white justify-center items-center">
       {children}
   
    </div>
  );
};

export default Layout;