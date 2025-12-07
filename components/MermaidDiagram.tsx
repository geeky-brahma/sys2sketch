import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      themeVariables: {
        primaryColor: '#0e7490', // cyan-700
        primaryTextColor: '#e2e8f0', // slate-200
        primaryBorderColor: '#22d3ee', // cyan-400
        lineColor: '#94a3b8', // slate-400
        secondaryColor: '#334155', // slate-700
        tertiaryColor: '#1e293b', // slate-800
      }
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || !containerRef.current) return;
      setError(null);
      
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        setError("Failed to render diagram. The generated syntax might be invalid.");
        // Mermaid sometimes leaves error text in the DOM, this clears it roughly.
        const errorElement = document.querySelector(`#d${containerRef.current.id}`);
        if (errorElement) errorElement.remove();
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-500/50 bg-red-900/10 rounded-lg text-red-200 text-sm">
        {error}
        <pre className="mt-2 text-xs opacity-50 overflow-x-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      className="w-full overflow-x-auto bg-slate-900 rounded-lg p-6 flex justify-center min-h-[300px] border border-slate-700 shadow-inner"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
