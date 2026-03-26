import { useState, useRef } from 'react';

export const useCoverLetter = () => {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [letterId, setLetterId] = useState(null);
  const abortRef = useRef(null);

  const generate = async ({ jobTitle, companyName, jobDescription, resumeText, resumeFile, settings }) => {
    setText('');
    setStreaming(true);
    setDone(false);
    setError('');
    setLetterId(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('jobTitle', jobTitle || '');
      formData.append('companyName', companyName || '');
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
          if (parsed.done) {
            setDone(true);
            setStreaming(false);
            if (parsed.letterId) setLetterId(parsed.letterId);
          }
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
    setLetterId(null);
  };

  return { text, streaming, done, error, letterId, generate, abort, reset };
};