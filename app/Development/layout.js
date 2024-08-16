import React from 'react';
import Link from 'next/link';
import Footer from '@/components/layout/footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white justify-center items-center">
       {children}
     <Footer/>
    </div>
  );
};

export default Layout;