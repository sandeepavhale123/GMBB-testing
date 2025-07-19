
import React from 'react';
import { parseChatMessage, hasMarkdownTable, parseMarkdownTable } from '../../utils/chatMessageParser';

interface ChatMessageRendererProps {
  content: string;
  className?: string;
}

export const ChatMessageRenderer: React.FC<ChatMessageRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  const parsedContent = parseChatMessage(content);
  
  // Check if content has markdown tables
  if (hasMarkdownTable(parsedContent)) {
    const { beforeTable, tableData, afterTable } = parseMarkdownTable(parsedContent);
    
    return (
      <div className={`whitespace-pre-wrap ${className}`}>
        {/* Content before table */}
        {beforeTable && (
          <div className="mb-4">
            {beforeTable}
          </div>
        )}
        
        {/* Rendered table */}
        {tableData.length > 0 && (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {tableData[0]?.map((header, index) => (
                    <th
                      key={index}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 text-sm text-gray-900 border-b border-gray-100"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Content after table */}
        {afterTable && (
          <div className="mt-4">
            {afterTable}
          </div>
        )}
      </div>
    );
  }
  
  // For non-table content, render normally with preserved formatting
  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {parsedContent}
    </div>
  );
};
