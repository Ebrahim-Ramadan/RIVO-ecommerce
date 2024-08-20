import React from 'react';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-black text-white justify-center items-center">
       {children}
       {/* <LazyLoad>
     <Footer/>
     </LazyLoad> */}
    </div>
  );
};

export default Layout;