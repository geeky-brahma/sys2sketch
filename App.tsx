import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { MermaidDiagram } from './components/MermaidDiagram';
import { TechStackDisplay } from './components/TechStackDisplay';
import { analyzeSketch } from './services/geminiService';
import { AnalysisResult, ProcessingStatus } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    
    // Reset state
    setResult(null);
    setErrorMsg(null);
    setStatus(ProcessingStatus.ANALYZING);

    try {
      const analysis = await analyzeSketch(selectedFile);
      setResult(analysis);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during analysis.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setStatus(ProcessingStatus.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-900/50">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Sketch<span className="text-cyan-400">2</span>Sys
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Upload & Input */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Analyze System Architecture</h2>
              <p className="text-slate-400">
                Upload a hand-drawn sketch or diagram image. Our AI will digitize the flow and suggest a robust tech stack.
              </p>
            </div>

            {/* Upload Area */}
            {!file ? (
              <FileUpload onFileSelect={handleFileSelect} />
            ) : (
              <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
                <img 
                  src={previewUrl!} 
                  alt="Uploaded sketch" 
                  className="w-full h-auto max-h-[500px] object-contain bg-black/40" 
                />
                <button 
                  onClick={handleReset}
                  className="absolute top-4 right-4 bg-slate-900/80 hover:bg-red-500/90 text-white p-2 rounded-lg backdrop-blur-sm transition-all shadow-lg border border-white/10"
                  title="Remove image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {status === ProcessingStatus.ANALYZING && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent shadow-lg shadow-cyan-500/50 mb-4"></div>
                    <p className="text-cyan-400 font-medium animate-pulse">Analyzing structures...</p>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {status === ProcessingStatus.ERROR && (
              <div className="p-4 bg-red-950/30 border border-red-500/50 rounded-lg flex items-start gap-3">
                 <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <div>
                   <h4 className="text-red-200 font-semibold text-sm">Analysis Failed</h4>
                   <p className="text-red-300/80 text-sm mt-1">{errorMsg}</p>
                   <button 
                     onClick={() => handleFileSelect(file!)} 
                     className="mt-3 text-xs bg-red-900/50 hover:bg-red-900 text-red-200 px-3 py-1.5 rounded transition-colors border border-red-800"
                   >
                     Try Again
                   </button>
                 </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {status === ProcessingStatus.IDLE && !file && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-2xl min-h-[400px] p-8 bg-slate-900/20">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-center">Results will appear here after analysis.</p>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-fade-in">
                {/* Summary Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Executive Summary</h3>
                  <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                </div>

                {/* Mermaid Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                      Digitized Diagram
                    </h3>
                  </div>
                  <MermaidDiagram chart={result.mermaidCode} />
                </div>

                {/* Tech Stack Section */}
                <TechStackDisplay stack={result.techStack} />

                {/* Raw Mermaid Code (Collapsible or Small) */}
                <details className="group">
                  <summary className="cursor-pointer text-xs text-slate-500 hover:text-cyan-400 transition-colors list-none flex items-center gap-2">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    Show Mermaid Source Code
                  </summary>
                  <div className="mt-2 bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
                    <code className="text-xs font-mono text-emerald-400 whitespace-pre">
                      {result.mermaidCode}
                    </code>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
