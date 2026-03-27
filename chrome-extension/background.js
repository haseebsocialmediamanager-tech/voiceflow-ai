// VoiceFlow AI — Background Service Worker
// Handles extension install and icon click events

chrome.runtime.onInstalled.addListener(() => {
  console.log('VoiceFlow AI extension installed');
});
