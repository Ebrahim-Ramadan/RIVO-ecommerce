import { ImageResponse } from 'next/og';



export default async function OpengraphImage(props) {
 
  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
         
          <img
            src='https://e-commerce-myass.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.000f2bf6.png&w=1080&q=75'
            alt="logo"
            width={1000}
            height={500}
            />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fetch(new URL('../fonts/Inter-Bold.ttf', import.meta.url)).then((res) =>
            res.arrayBuffer()
          ),
          style: 'normal',
          weight: 700
        }
      ]
    }
  );
}
