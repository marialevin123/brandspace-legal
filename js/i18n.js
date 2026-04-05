(function () {
  const STORAGE_KEY = 'brandspace-lang';
  const DEFAULT_LANG = 'en';
  const cache = new Map();
  const scriptEl = document.currentScript;
  const BASE =
    scriptEl && scriptEl.getAttribute('data-base') != null
      ? scriptEl.getAttribute('data-base')
      : '';

  let dictionary = null;
  let currentLang = null;
  let lastAppliedLang = null;

  function getByPath(obj, path) {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let node = obj;
    for (let i = 0; i < parts.length; i++) {
      if (node == null || typeof node !== 'object') return undefined;
      node = node[parts[i]];
    }
    return node;
  }

  async function loadTranslations(lang) {
    if (cache.has(lang)) return cache.get(lang);
    const res = await fetch(BASE + 'locales/' + lang + '.json');
    if (!res.ok) {
      if (lang !== DEFAULT_LANG) return loadTranslations(DEFAULT_LANG);
      throw new Error('Failed to load translations: ' + lang);
    }
    const data = await res.json();
    cache.set(lang, data);
    return data;
  }

  function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const val = getByPath(dict, key);
      if (val !== undefined && typeof val !== 'object') el.textContent = String(val);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      const val = getByPath(dict, key);
      if (val !== undefined && typeof val !== 'object') el.setAttribute('placeholder', String(val));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      if (!key) return;
      const val = getByPath(dict, key);
      if (val !== undefined && typeof val !== 'object') el.innerHTML = String(val);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-alt');
      if (!key) return;
      const val = getByPath(dict, key);
      if (val !== undefined && typeof val !== 'object') el.setAttribute('alt', String(val));
    });
  }

  async function setLanguage(lang) {
    const next = lang || DEFAULT_LANG;
    const dict = await loadTranslations(next);
    const changed = lastAppliedLang !== next;
    dictionary = dict;
    currentLang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    document.documentElement.lang = next;
    applyTranslations(dict);
    lastAppliedLang = next;
    if (changed) {
      document.dispatchEvent(
        new CustomEvent('languageChanged', { detail: { lang: next } })
      );
    }
  }

  function getCurrentLanguage() {
    return currentLang;
  }

  function t(key) {
    const val = dictionary ? getByPath(dictionary, key) : undefined;
    if (val !== undefined && typeof val === 'object') return undefined;
    return val;
  }

  function bootstrap() {
    let saved;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      saved = null;
    }
    const initial = saved && saved.length ? saved : DEFAULT_LANG;
    return setLanguage(initial).catch(function (err) {
      console.error(err);
    });
  }

  window.i18n = {
    setLanguage: setLanguage,
    getCurrentLanguage: getCurrentLanguage,
    t: t,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
