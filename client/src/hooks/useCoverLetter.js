import { useState, useRef } from 'react';

export const useCoverLetter = () => {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const generate = async ({ jobDescription, resumeText, resumeFile, settings }) => {
    setText('');
    setStreaming(true);
    setDone(false);
    setError('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token = localStorage.getItem('token');

      // Build form data — supports both text and file
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);
      formData.append('settings', JSON.stringify(settings));

      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else {
        formData.append('resumeText', resumeText);
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cover-letter/generate`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to generate cover letter.');
      }

      // Read SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const parsed = JSON.parse(line.slice(6));
          if (parsed.chunk) setText((prev) => prev + parsed.chunk);
          if (parsed.done) { setDone(true); setStreaming(false); }
          if (parsed.error) throw new Error(parsed.error);
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Something went wrong.');
      setStreaming(false);
    }
  };

  const abort = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const reset = () => {
    setText('');
    setDone(false);
    setError('');
  };

  return { text, streaming, done, error, generate, abort, reset };
};