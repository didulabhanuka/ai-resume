import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '../Shared/LoadingDots';

export default function CoverLetterOutput({ text, streaming, done, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!text && !streaming) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Generated Cover Letter</h3>
        {streaming && <LoadingDots text="Writing" />}
      </div>

      {/* Letter text */}
      <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-800 leading-relaxed min-h-32 whitespace-pre-wrap font-serif">
        {text}
        {/* Blinking cursor while streaming */}
        {streaming && (
          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
        )}
      </div>

      {/* Actions — only show when done */}
      {done && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy to clipboard'}
          </button>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
}