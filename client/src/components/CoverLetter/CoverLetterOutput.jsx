import { useState } from 'react';
import LoadingDots from '../Shared/LoadingDots';
import Toast from '../Shared/Toast';
import { useToast } from '../../hooks/useToast';
import { downloadCoverLetter } from '../../api/coverLetter.api';

export default function CoverLetterOutput({ text, streaming, done, letterId, onRegenerate }) {
  const [downloading, setDownloading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy.', 'error');
    }
  };

  const handleDownload = async () => {
    if (!letterId) {
      showToast('Letter ID not available yet.', 'error');
      return;
    }

    setDownloading(true);
    try {
      const res = await downloadCoverLetter(letterId);
      // Create a blob URL and trigger download
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover-letter.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('PDF downloaded!', 'success');
    } catch {
      showToast('Failed to download PDF.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  if (!text && !streaming) return null;

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Generated Cover Letter</h3>
          {streaming && <LoadingDots text="Writing" />}
        </div>

        {/* Letter text */}
        <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-800 leading-relaxed min-h-32 whitespace-pre-wrap font-serif">
          {text}
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
              Copy to clipboard
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 text-sm font-medium bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {downloading ? 'Downloading...' : 'Download PDF'}
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
    </>
  );
}