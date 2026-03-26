export default function SettingsPanel({ settings, onChange }) {
  const update = (key, value) => onChange({ ...settings, [key]: value });

  const options = {
    tone: [
      { value: 'professional', label: 'Professional' },
      { value: 'enthusiastic', label: 'Enthusiastic' },
      { value: 'concise', label: 'Concise' },
      { value: 'storytelling', label: 'Storytelling' },
    ],
    length: [
      { value: 'short', label: 'Short (~200 words)' },
      { value: 'medium', label: 'Medium (~350 words)' },
      { value: 'long', label: 'Long (~500 words)' },
    ],
    focus: [
      { value: 'technical-skills', label: 'Technical Skills' },
      { value: 'leadership', label: 'Leadership' },
      { value: 'culture-fit', label: 'Culture Fit' },
      { value: 'career-change', label: 'Career Change' },
    ],
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Settings</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tone */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tone</label>
          <select
            value={settings.tone}
            onChange={(e) => update('tone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.tone.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Length</label>
          <select
            value={settings.length}
            onChange={(e) => update('length', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.length.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Focus */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Focus</label>
          <select
            value={settings.focus}
            onChange={(e) => update('focus', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.focus.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom note */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Additional instruction <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={settings.customNote}
          onChange={(e) => update('customNote', e.target.value)}
          placeholder='e.g. "Mention I am relocating to London"'
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}