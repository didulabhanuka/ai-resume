import { useState } from 'react';
import ResumeInput from '../Shared/ResumeInput';
import SettingsPanel from './SettingsPanel';
import LoadingDots from '../Shared/LoadingDots';

const defaultSettings = {
  tone: 'professional',
  length: 'medium',
  focus: 'technical-skills',
  customNote: '',
};

export default function CoverLetterForm({ onSubmit, onAbort, streaming }) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ jobDescription, resumeText, resumeFile, settings });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Job Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={5}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Resume */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Resume
        </label>
        <ResumeInput
          onTextChange={setResumeText}
          onFileChange={setResumeFile}
        />
      </div>

      {/* Settings */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <SettingsPanel settings={settings} onChange={setSettings} />
      </div>

      {/* Submit / Abort */}
      {streaming ? (
        <button
          type="button"
          onClick={onAbort}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
        >
          Stop Generating
        </button>
      ) : (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
        >
          Generate Cover Letter
        </button>
      )}

    </form>
  );
}