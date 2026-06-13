document.addEventListener('swup:contentReplaced', () => {
  if (typeof addHighlightTool === 'function') {
    addHighlightTool();
  }
});
