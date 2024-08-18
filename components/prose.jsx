import clsx from 'clsx';

const Prose = ({ html, className }) => {
  const replaceSpecialChars = (text) => {
    return text.replace(/[^\w\s]/g, '').trim() + '.';
  };

  const processedHtml = html
    .split('\n')
    .filter(item => item.trim() !== '')  // Filter out empty lines
    .map((item) => `<li>${replaceSpecialChars(item.trim())}</li>`)
    .join('');

  const finalHtml = `<ul class="prose-ul [&>*]:mt-1 text-white/[80%] font-medium dark:text-white/[80%]">${processedHtml}</ul>`;

  return (
    <div
      className={clsx(
        'py-6 capitalize prose ',
        className
      )}>
      <span className='text-xl font-bold '>Product Description</span>
      <p className='text-neutral-400 text-xs py-2'>Below you will find a detailed description of the product. This information is important for customers who want to make an informed decision before purchasing the product.</p>
      <div
        className='mt-4'
        dangerouslySetInnerHTML={{ __html: finalHtml }}
      />
    </div>
  );
};

export default Prose;
