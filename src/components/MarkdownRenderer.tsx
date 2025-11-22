interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let key = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="list-disc pl-6 mb-4 space-y-1">
            {currentList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const formatInline = (text: string) => {
      // Bold
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Italic
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
      // Code
      text = text.replace(/`(.+?)`/g, '<code class="bg-accent px-1 py-0.5 rounded text-sm">$1</code>');
      return text;
    };

    lines.forEach((line, index) => {
      // H1
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${key++}`} className="text-3xl font-bold mb-4 mt-6">
            {line.slice(2)}
          </h1>
        );
      }
      // H2
      else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${key++}`} className="text-2xl font-semibold mb-3 mt-6">
            {line.slice(3)}
          </h2>
        );
      }
      // H3
      else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${key++}`} className="text-xl font-semibold mb-2 mt-4">
            {line.slice(4)}
          </h3>
        );
      }
      // List item
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(line.slice(2));
      }
      // Numbered list
      else if (/^\d+\.\s/.test(line)) {
        flushList();
        const match = line.match(/^(\d+)\.\s(.+)$/);
        if (match) {
          elements.push(
            <div key={`num-${key++}`} className="mb-2">
              <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
            </div>
          );
        }
      }
      // Empty line
      else if (line.trim() === '') {
        flushList();
      }
      // Regular paragraph
      else {
        flushList();
        if (line.trim()) {
          elements.push(
            <p
              key={`p-${key++}`}
              className="mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatInline(line) }}
            />
          );
        }
      }
    });

    flushList();
    return elements;
  };

  return <div className="prose prose-slate max-w-none">{renderContent()}</div>;
}
