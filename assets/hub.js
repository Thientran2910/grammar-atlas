(function (root) {
  function legacyTarget(hash) {
    return typeof hash === 'string' && hash.indexOf('#/') === 0 ? 'grammar/' + hash : null;
  }

  function progressText(moduleId, storage) {
    try {
      if (moduleId === 'grammar') {
        var g = JSON.parse(storage.getItem('grammar-atlas-v1'));
        var n = g && Array.isArray(g.read) ? g.read.length : 0;
        return n > 0 ? 'Đã ôn ' + n + ' chủ đề' : null;
      }
      if (moduleId === 'listening') {
        var l = JSON.parse(storage.getItem('listening-atlas-v1'));
        var r = l && l.results;
        var c = r && typeof r === 'object' && !Array.isArray(r) ? Object.keys(r).length : 0;
        return c > 0 ? 'Đã làm ' + c + ' bài nghe' : null;
      }
    } catch (e) {}
    return null;
  }

  var Hub = { legacyTarget: legacyTarget, progressText: progressText };
  if (typeof module !== 'undefined' && module.exports) module.exports = Hub;
  if (typeof window === 'undefined') return;
  root.Hub = Hub;

  var target = legacyTarget(location.hash);
  if (target) location.replace(target);

  document.addEventListener('DOMContentLoaded', function () {
    try {
      document.querySelectorAll('[data-progress]').forEach(function (el) {
        var t = progressText(el.getAttribute('data-progress'), localStorage);
        if (t !== null) { el.textContent = t; el.hidden = false; }
      });
    } catch (e) {}
  });
})(typeof window !== 'undefined' ? window : this);
