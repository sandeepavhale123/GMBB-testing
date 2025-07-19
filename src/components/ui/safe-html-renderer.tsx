
import React from 'react';
import parse from 'html-react-parser';

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

export const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ 
  html, 
  className = "" 
}) => {
  // Parse HTML and apply proper styling to links
  const parsedHtml = parse(html, {
    replace: (domNode: any) => {
      if (domNode.type === 'tag' && domNode.name === 'a') {
        const { href, target, ...otherProps } = domNode.attribs || {};
        return (
          <a
            href={href}
            target={target || '_blank'}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
            {...otherProps}
          >
            {domNode.children?.[0]?.data || 'Link'}
          </a>
        );
      }
    }
  });

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {parsedHtml}
    </div>
  );
};
