var ext_api = (typeof browser === 'object') ? browser : chrome;

function popup_show_toggle(domain, enabled) {
  if (domain) {
    var site_switch_span = document.getElementById('site_switch_span');
    let labelEl = document.createElement('label');
    labelEl.setAttribute('class', 'switch');
    let inputEl = document.createElement('input');
    inputEl.setAttribute('id', 'site_switch');
    inputEl.setAttribute('type', 'checkbox');
    if (enabled)
      inputEl.setAttribute('checked', true);
    labelEl.appendChild(inputEl);
    let spanEl = document.createElement('span');
    spanEl.setAttribute('class', 'slider round');
    spanEl.setAttribute('title', 'en/disable current site in BPC');
    labelEl.appendChild(spanEl);
    site_switch_span.appendChild(labelEl);
    document.getElementById("site_switch").addEventListener('click', function () {
      ext_api.runtime.sendMessage({
        request: 'site_switch'
      });
      //open(location).close();
    });
  }
};

ext_api.runtime.sendMessage({
  request: 'popup_show_toggle'
});
ext_api.runtime.onMessage.addListener(function (message, sender) {
  if (message.msg === 'popup_show_toggle' && message.data) {
    popup_show_toggle(message.data.domain, message.data.enabled)
  }
});

document.getElementById("clear_cookies").addEventListener('click', function () {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
      let hostname = new URL(tabs[0].url).hostname;
      let cookie_domain = hostname.replace(/^(www|amp(\d|html)?|m|wap)\./, '');
      ext_api.permissions.contains({
        origins: ["*://*." + cookie_domain + "/*"]
      }, function (result) {
        if (result) {
          ext_api.runtime.sendMessage({
            request: 'clear_cookies'
          });
        } else {
          ext_api.permissions.request({
            origins: ["*://*." + cookie_domain + "/*"]
          }, function (granted) {
            if (granted) {
              ext_api.runtime.sendMessage({
                request: 'clear_cookies'
              });
            }
          });
        }
      });
    }
  });
});

function closeButton() {
  window.close();
}

document.getElementById("button-close").addEventListener('click', closeButton);
