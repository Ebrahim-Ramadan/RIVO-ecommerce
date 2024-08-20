

export const metadata = {
  description: 'RIVO e-commerce website ',
 title: 'RIVO Search Products',
};
export default function SearchLayout({ children }) {
  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-2 pb-4 text-black md:flex-row dark:text-white">
       
        <div className="order-last min-h-screen w-full md:order-none">{children}</div>
        
      </div>
  
    </>
  );
}