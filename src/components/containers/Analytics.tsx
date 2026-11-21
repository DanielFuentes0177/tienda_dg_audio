import Script from "next/script";
import { TRACKING } from "@/content/site";

/**
 * GTM + Consent Mode v2 (denegado por defecto; solo se concede tras aceptar).
 * Misma lógica que el sitio HTML: el consentimiento guardado se aplica antes de
 * cargar GTM, y GTM se carga diferido (interacción o 3,5 s) por rendimiento.
 * Meta Pixel y GA4 los activa GTM según el consentimiento.
 */
export const Analytics = () => {
  const bootstrap = `
(function () {
if (location.pathname.indexOf('/admin') === 0) return; // sin analítica en el panel
window.dataLayer = window.dataLayer || [];
window.dgConsentCommand = function () { window.dataLayer.push(arguments); };
window.dgBuildConsentState = function (status) {
  var g = status === 'granted';
  return {
    analytics_storage: g ? 'granted' : 'denied',
    ad_storage: g ? 'granted' : 'denied',
    ad_user_data: g ? 'granted' : 'denied',
    ad_personalization: g ? 'granted' : 'denied',
    personalization_storage: g ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  };
};
var stored = null;
try { stored = localStorage.getItem('${TRACKING.consentStorageKey}'); } catch (e) {}
window.dgConsentCommand('consent', 'default',
  Object.assign({}, window.dgBuildConsentState(stored === 'accepted' ? 'granted' : 'denied'), { wait_for_update: 500 }));
var events = ['scroll', 'click', 'mousemove', 'touchstart', 'keydown'];
function loadGTM() {
  if (window.gtmLoaded) return;
  window.gtmLoaded = true;
  events.forEach(function (e) { window.removeEventListener(e, loadGTM); });
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=${TRACKING.googleTagManagerId}';
  document.head.appendChild(s);
}
events.forEach(function (e) { window.addEventListener(e, loadGTM, { passive: true }); });
setTimeout(loadGTM, 3500);
})();
`;

  return (
    <>
      <Script id="dg-consent-gtm" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${TRACKING.googleTagManagerId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
};
