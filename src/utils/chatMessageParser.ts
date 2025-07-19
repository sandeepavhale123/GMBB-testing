
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

// Convert markdown table to HTML table data
export const parseMarkdownTable = (content: string): { beforeTable: string; tableData: string[][]; afterTable: string } => {
  const lines = content.split('\n');
  const tableStartIndex = lines.findIndex(line => line.includes('|') && line.split('|').length >= 3);
  
  if (tableStartIndex === -1) {
    return { beforeTable: content, tableData: [], afterTable: '' };
  }
  
  // Find table end (first non-table line after table starts)
  let tableEndIndex = tableStartIndex;
  for (let i = tableStartIndex; i < lines.length; i++) {
    if (!lines[i].includes('|') || lines[i].split('|').length < 3) {
      tableEndIndex = i;
      break;
    }
    tableEndIndex = i + 1;
  }
  
  const beforeTable = lines.slice(0, tableStartIndex).join('\n');
  const afterTable = lines.slice(tableEndIndex).join('\n');
  const tableLines = lines.slice(tableStartIndex, tableEndIndex);
  
  // Parse table data, filtering out separator lines
  const tableData = tableLines
    .filter(line => !line.includes('---') && !line.includes('==='))
    .map(line => 
      line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '') // Remove empty cells from start/end
    )
    .filter(row => row.length > 0);
  
  return { beforeTable, tableData, afterTable };
};
