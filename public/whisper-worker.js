// VoiceFlow AI — Local Whisper Worker
// Loads Xenova/transformers from CDN, processes audio on-device
importScripts('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');

const { pipeline, env } = self.Transformers;
env.allowLocalModels = false;
env.useBrowserCache = true;

let transcriber = null;

async function getTranscriber(progressCb) {
  if (!transcriber) {
    transcriber = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny',
      {
        progress_callback: (data) => {
          if (data.status === 'progress') {
            progressCb(Math.round(data.progress || 0));
          }
        }
      }
    );
  }
  return transcriber;
}

self.addEventListener('message', async ({ data }) => {
  if (data.type === 'transcribe') {
    try {
      const t = await getTranscriber((pct) => {
        self.postMessage({ type: 'progress', pct });
      });
      const lang = (data.language || 'en-US').split('-')[0].toLowerCase();
      const result = await t(data.audio, {
        language: lang,
        task: 'transcribe',
        chunk_length_s: 30,
      });
      self.postMessage({ type: 'result', text: (result.text || '').trim() });
    } catch (err) {
      self.postMessage({ type: 'error', message: String(err.message || err) });
    }
  }
});
