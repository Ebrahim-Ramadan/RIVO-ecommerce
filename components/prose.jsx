import clsx from 'clsx';

const Prose = ({ html, className }) => {
  // Split the html content by newline characters and create bullet points
  const processedHtml = html
    .split('\n')
    .map((item) => `<li>${item.trim()}</li>`)
    .join('');

  // Wrap the processed content in a <ul> element
  const finalHtml = `<ul class="prose-ul [&>*]:mt-1 text-white/[60%] dark:text-white/[60%]">${processedHtml}</ul>`;

  return (
    <div
      className={clsx( 
        'py-6 capitalize prose ',
        className
      )}
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
};

export default Prose;
