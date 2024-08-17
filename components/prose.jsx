import clsx from 'clsx';

const Prose = ({ html, className }) => {
  // Function to replace special characters with a dot
  const replaceSpecialChars = (text) => {
    return text.replace(/[^\w\s]/g, ''); // Replace any character that is not a word character or whitespace with a dot
  };

  // Split the html content by newline characters, replace special characters, and create bullet points
  const processedHtml = html
    .split('\n')
    .map((item) => `<li>${replaceSpecialChars(item.trim())}</li>`)
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
