import CoverLetterForm from '../components/CoverLetter/CoverLetterForm';
import CoverLetterOutput from '../components/CoverLetter/CoverLetterOutput';
import { useCoverLetter } from '../hooks/useCoverLetter';

export default function CoverLetterPage() {
  const { text, streaming, done, error, generate, abort, reset } = useCoverLetter();

  const handleRegenerate = () => {
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cover Letter Generator</h1>
        <p className="text-gray-500 text-sm mt-1">
          Generate a tailored cover letter that streams in real time.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <CoverLetterForm
          onSubmit={generate}
          onAbort={abort}
          streaming={streaming}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Output */}
      <CoverLetterOutput
        text={text}
        streaming={streaming}
        done={done}
        onRegenerate={handleRegenerate}
      />

    </div>
  );
}