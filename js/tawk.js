(function () {
  var pid = typeof window.__TAWK_PROPERTY_ID__ === 'string' ? window.__TAWK_PROPERTY_ID__.trim() : '';
  var wid = typeof window.__TAWK_WIDGET_ID__ === 'string' ? window.__TAWK_WIDGET_ID__.trim() : '';
  if (!pid || !wid || pid.indexOf('YOUR_') === 0 || wid.indexOf('YOUR_') === 0) return;
  var s1 = document.createElement('script');
  var s0 = document.getElementsByTagName('script')[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/' + encodeURIComponent(pid) + '/' + encodeURIComponent(wid);
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
