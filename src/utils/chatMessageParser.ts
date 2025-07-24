
// Utility to parse and format chat message content
export const parseChatMessage = (rawMessage: string): string => {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(rawMessage);
    let content = parsed.reply || rawMessage;
    
    // Decode Unicode escape sequences (emojis)
    content = content.replace(/\\u([0-9a-fA-F]{4})/g, (match: string, code: string) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    // Handle double-escaped newlines
    content = content.replace(/\\n/g, '\n');
    
    return content;
  } catch {
    // If not JSON, return as-is but still process escape sequences
    let content = rawMessage;
    
    // Decode Unicode escape sequences
    content = content.replace(/\\u([0-9a-fA-F]{4})/g, (match: string, code: string) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    // Handle escaped newlines
    content = content.replace(/\\n/g, '\n');
    
    return content;
  }
};

// Detect if content contains markdown-style tables
export const hasMarkdownTable = (content: string): boolean => {
  const lines = content.split('\n');
  return lines.some(line => line.includes('|') && line.split('|').length >= 3);
};

// Parse content into sections with multiple tables
export interface ContentSection {
  type: 'text' | 'table';
  content: string;
  tableData?: string[][];
}

export const parseMarkdownTable = (content: string): ContentSection[] => {
  const lines = content.split('\n');
  const sections: ContentSection[] = [];
  let currentTextLines: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Check if this line starts a table
    if (line.includes('|') && line.split('|').length >= 3) {
      // Save any accumulated text content
      if (currentTextLines.length > 0) {
        const textContent = currentTextLines.join('\n').trim();
        if (textContent) {
          sections.push({
            type: 'text',
            content: textContent
          });
        }
        currentTextLines = [];
      }
      
      // Find the end of this table
      let tableEndIndex = i;
      for (let j = i; j < lines.length; j++) {
        if (!lines[j].includes('|') || lines[j].split('|').length < 3) {
          tableEndIndex = j;
          break;
        }
        tableEndIndex = j + 1;
      }
      
      const tableLines = lines.slice(i, tableEndIndex);
      
      // Parse table data, filtering out separator lines
      const tableData = tableLines
        .filter(line => !line.includes('---') && !line.includes('==='))
        .map(line => 
          line.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell !== '') // Remove empty cells from start/end
        )
        .filter(row => row.length > 0);
      
      if (tableData.length > 0) {
        sections.push({
          type: 'table',
          content: tableLines.join('\n'),
          tableData
        });
      }
      
      i = tableEndIndex;
    } else {
      currentTextLines.push(line);
      i++;
    }
  }
  
  // Add any remaining text content
  if (currentTextLines.length > 0) {
    const textContent = currentTextLines.join('\n').trim();
    if (textContent) {
      sections.push({
        type: 'text',
        content: textContent
      });
    }
  }
  
  return sections;
};
