var params = new URLSearchParams(window.location.search);

(function enforceDemoLogin(){
    var currentPage = (location.pathname.split('/').pop() || '').toLowerCase();
    var publicPages = ['id.html', 'index.html', 'app.html'];
    var hiddenAt = Number(sessionStorage.getItem('mobDemoHiddenAt') || 0);

    if (hiddenAt && Date.now() - hiddenAt > 1000) {
        sessionStorage.removeItem('mobDemoAuthenticated');
    }
    sessionStorage.removeItem('mobDemoHiddenAt');

    if (!publicPages.includes(currentPage) && sessionStorage.getItem('mobDemoAuthenticated') !== '1') {
        location.replace('id.html' + (params.toString() ? '?' + params.toString() : ''));
        return;
    }

    document.addEventListener('visibilitychange', function(){
        if (document.visibilityState === 'hidden') {
            sessionStorage.setItem('mobDemoHiddenAt', String(Date.now()));
        }
    });
})();

var ROUTES = {
    home: 'home.html',
    services: 'services.html',
    qr: 'qr.html',
    more: 'more.html',
    moreid: 'moreid.html',
    id: 'id.html',
    shortcuts: 'shortcuts.html',
    pesel: 'pesel.html',
    scanqr: 'scanqr.html',
    showqr: 'showqr.html',
    gen: 'gen.html',
    card: 'card.html',
};

function sendTo(key){
    var qs = params.toString();
    var file = ROUTES[String(key)] || (String(key).endsWith('.html') ? String(key) : String(key) + '.html');
    var href = file + (qs ? `?${qs}` : '');
    location.href = href;
}

document.querySelectorAll(".bottom_element_grid").forEach((element) => {
    element.addEventListener('click', () => {
        sendTo(element.getAttribute("send"))
    })
})

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    if (/windows phone/i.test(userAgent)) {
        return 1;
    }
  
    if (/android/i.test(userAgent)) {
        return 2;
    }
  
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 3;
    }
  
    return 4;
  }
  
  if (getMobileOperatingSystem() == 2){
      document.querySelector(".bottom_bar").style.height = "70px"
}
