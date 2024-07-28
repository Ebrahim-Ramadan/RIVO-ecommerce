import OpengraphImage from '@/components/opengraph-image';
export const runtime = 'edge';

export default async function Image({ params }) {
  const title ='ass'

  return await OpengraphImage({ title });
}
