'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;
var url_loc = (typeof browser === 'object') ? 'firefox' : 'chrome';
var manifestData = ext_api.runtime.getManifest();
var ext_name = manifestData.name;
var ext_version = manifestData.version;

const cs_limit_except = ['elespanol.com', 'faz.net', 'nation.africa', 'nationalgeographic.com', 'thetimes.co.uk'];
const dompurify_sites = ['asiatimes.com', 'bloomberg.com', 'cicero.de', 'economictimes.com', 'hs.fi', 'iltalehti.fi', 'ipolitics.ca', 'italiaoggi.it', 'lesechos.fr', 'marianne.net', 'newleftreview.org', 'nzherald.co.nz', 'prospectmagazine.co.uk', 'stratfor.com', 'techinasia.com', 'timesofindia.com', 'valor.globo.com', 'vn.nl'].concat(fr_groupe_sud_ouest_domains, nl_mediahuis_region_domains, no_nhst_media_domains, usa_theathletic_domains);
var currentTabUrl = '';
var csDone = false;
var optin_setcookie = false;
var optin_update = true;
var blocked_referer = false;

// defaultSites are loaded from sites.js at installation extension

var restrictions = {
  'bloomberg.com': /^((?!\.bloomberg\.com\/news\/terminal\/).)*$/,
  'economictimes.com': /\.economictimes\.com($|\/($|(__assets|prime)(\/.+)?|.+\.cms))/,
  'elespanol.com': /^((?!\/cronicaglobal\.elespanol\.com\/).)*$/,
  'espn.com': /^((?!espn\.com\/watch).)*$/,
  'faz.net': /^((?!\.faz\.net\/aktuell\/(\?switchfaznet)?$).)*$/,
  'foreignaffairs.com': /\.foreignaffairs\.com\/((articles|fa-caching|interviews|reviews|sites)\/)/,
  'lastampa.it': /^((?!\/video\.lastampa\.it\/).)*$/,
  'science.org': /^((?!\.science\.org\/doi\/).)*$/,
  'timesofindia.com': /\.timesofindia\.com($|\/($|toi-plus(\/.+)?|.+\.cms))/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'repubblica.it': /^((?!\/video\.repubblica\.it\/).)*$/,
  'seekingalpha.com': /\/seekingalpha\.com($|\/($|(amp\/)?(article|news)\/|samw\/))/,
  'statista.com': /^((?!\.statista\.com\/(outlook|study)\/).)*$/,
  'techinasia.com': /\.techinasia\.com\/.+/,
  'timeshighereducation.com': /\.timeshighereducation\.com\/((features|news|people)\/|.+((\w)+(\-)+){3,}.+|sites\/default\/files\/)/
}

for (let domain of au_news_corp_domains)
  restrictions[domain] = new RegExp('^((?!todayspaper\\.' + domain.replace(/\./g, '\\.') + '\\/).)*$');
if (typeof browser !== 'object') {
  for (let domain of [])
    restrictions[domain] = new RegExp('((\\/|\\.)' + domain.replace(/\./g, '\\.') + '\\/$|' + restrictions[domain].toString().replace(/(^\/|\/$)/g, '') + ')');
}

// Don't remove cookies before/after page load
var allow_cookies = [];
var remove_cookies = [];
// select specific cookie(s) to hold/drop from remove_cookies domains
var remove_cookies_select_hold, remove_cookies_select_drop;

// Set User-Agent
var use_google_bot, use_bing_bot;
// Set Referer
var use_facebook_referer, use_google_referer, use_twitter_referer;
// Set random IP-address
var random_ip = {};
var use_random_ip = [];
// concat all sites with change of headers (useragent, referer or random ip)
var change_headers;

// block paywall-scripts individually
var blockedRegexes = {};

// unhide text on amp-page
var amp_unhide;
// redirect to amp-page
var amp_redirect;
// code for contentScript
var cs_code;
// load text from json
var ld_json;

// custom: block javascript
var block_js_custom = [];
var block_js_custom_ext = [];

function initSetRules() {
  allow_cookies = [];
  remove_cookies = [];
  remove_cookies_select_drop = {};
  remove_cookies_select_hold = {};
  use_google_bot = [];
  use_bing_bot = [];
  use_facebook_referer = [];
  use_google_referer = [];
  use_twitter_referer = [];
  random_ip = {};
  change_headers = [];
  amp_unhide = [];
  amp_redirect = {};
  cs_code = {};
  ld_json = {};
  block_js_custom = [];
  block_js_custom_ext = [];
  blockedRegexes = {};
}

const userAgentDesktopG = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobileG = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

const userAgentDesktopB = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
const userAgentMobileB = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

var enabledSites = [];
var disabledSites = [];
var optionSites = {};
var customSites = {};
var customSites_domains = [];
var updatedSites = {};
var updatedSites_new = [];
var updatedSites_domains_new = [];
var excludedSites = [];

function setDefaultOptions() {
  ext_api.storage.local.set({
    sites: filterObject(defaultSites, function (val, key) {
      return val.domain && !val.domain.match(/^(###$|#options_(disable|optin)_)/)
    },
      function (val, key) {
      return [key, val.domain]
    })
  }, function () {
    ext_api.runtime.openOptionsPage();
  });
}

function check_sites_updated() {
  let sites_updated_json = 'https://gitlab.com/magnolia1234/bypass-paywalls-' + url_loc + '-clean/-/raw/master/sites_updated.json';
  fetch(sites_updated_json)
  .then(response => {
    if (response.ok) {
      response.json().then(json => {
        expandSiteRules(json, true);
        ext_api.storage.local.set({
          sites_updated: json
        });
      })
    }
  }).catch(function (err) {
    false;
  });
}

function set_rules(sites, sites_updated, sites_custom) {
  initSetRules();
  for (let site in sites) {
    let site_domain = sites[site].toLowerCase();
    let custom = false;
    if (!site_domain.match(/^(###$|#options_)/)) {
      let rule = {};
      let site_default = defaultSites.hasOwnProperty(site) ? site : Object.keys(defaultSites).find(default_key => compareKey(default_key, site));
      if (site_default) {
        rule = defaultSites[site_default];
        if (sites_updated.hasOwnProperty(site_default) && !sites_updated[site_default].new_site)
          rule = sites_updated[site_default];
      } else if (sites_updated.hasOwnProperty(site)) { // updated (new) sites
        rule = sites_updated[site];
      } else if (sites_custom.hasOwnProperty(site)) { // custom (new) sites
        rule = sites_custom[site];
        custom = true;
      } else
        continue;
      let domains = [site_domain];
      let group = false;
      if (rule.hasOwnProperty('group')) {
        domains = rule.group;
        group = true;
      }
      let rule_default = {};
      if (rule.hasOwnProperty('exception')) {
        for (let key in rule)
          rule_default[key] = rule[key];
      }
      for (let domain of domains) {
        let custom_in_group = false;
        if (rule_default.hasOwnProperty('exception')) {
          let exception_rule = rule_default.exception.filter(x => domain === x.domain || (typeof x.domain !== 'string' && x.domain.includes(domain)));
          if (exception_rule.length > 0)
            rule = exception_rule[0];
          else
            rule = rule_default;
        }
        // custom domain for default site(group)
        if (!custom) {
          let isCustomSite = matchDomain(customSites_domains, domain);
          let customSite_title = isCustomSite ? Object.keys(customSites).find(key => customSites[key].domain === isCustomSite) : '';
          if (customSite_title) {
            // add default block_regex
            let block_regex_default = '';
            if (rule.hasOwnProperty('block_regex'))
              block_regex_default = rule.block_regex;
            rule = {};
            for (let key in sites_custom[customSite_title])
              rule[key] = sites_custom[customSite_title][key];
            if (block_regex_default) {
              if (rule.hasOwnProperty('block_regex')) {
                if (block_regex_default instanceof RegExp)
                  block_regex_default = block_regex_default.source;
                rule.block_regex = '(' + block_regex_default + '|' + rule.block_regex.replace(/(^\/|\/$)/g, '') + ')';
              } else
                rule.block_regex = block_regex_default;
            }
            if (group)
              custom_in_group = true;
            else
              custom = true;
          }
        }
        addCookieRules(rule, custom || custom_in_group);
        
        if (rule.allow_cookies > 0 && !allow_cookies.includes(domain))
          allow_cookies.push(domain);
        if (rule.remove_cookies > 0 && !remove_cookies.includes(domain))
          remove_cookies.push(domain);
        if (rule.hasOwnProperty('remove_cookies_select_drop'))
          remove_cookies_select_drop[domain] = rule.remove_cookies_select_drop;
        if (rule.hasOwnProperty('remove_cookies_select_hold'))
          remove_cookies_select_hold[domain] = rule.remove_cookies_select_hold;
        if (rule.hasOwnProperty('block_regex')) {
          if (rule.block_regex instanceof RegExp)
            blockedRegexes[domain] = rule.block_regex;
          else {
            try {
              blockedRegexes[domain] = new RegExp(rule.block_regex.replace('{domain}', domain.replace(/\./g, '\\.').replace(/(^\/|\/$)/g, '')));
            } catch (e) {
              false;
            }
          }
        }
        if (rule.useragent) {
          switch (rule.useragent) {
          case 'googlebot':
            if (!use_google_bot.includes(domain))
              use_google_bot.push(domain);
            break;
          case 'bingbot':
            if (!use_bing_bot.includes(domain))
              use_bing_bot.push(domain);
            break;
          }
        }
        if (rule.referer) {
          switch (rule.referer) {
          case 'facebook':
            if (!use_facebook_referer.includes(domain))
              use_facebook_referer.push(domain);
            break;
          case 'google':
            if (!use_google_referer.includes(domain))
              use_google_referer.push(domain);
            break;
          case 'twitter':
            if (!use_twitter_referer.includes(domain))
              use_twitter_referer.push(domain);
            break;
          }
        }
        if (rule.random_ip) {
          random_ip[domain] = rule.random_ip;
        }
        // updated
        if (rule.amp_redirect)
          amp_redirect[domain] = rule.amp_redirect.paywall ? rule.amp_redirect : {paywall: rule.amp_redirect};
        if (rule.cs_code)
          cs_code[domain] = rule.cs_code;
        // custom
        if (rule.googlebot > 0)
          use_google_bot.push(domain);
        if (rule.block_javascript > 0)
          block_js_custom.push(domain);
        if (rule.block_javascript_ext > 0)
          block_js_custom_ext.push(domain);
        if (rule.amp_unhide > 0)
          amp_unhide.push(domain);
        if (rule.ld_json) {
          ld_json[domain] = rule.ld_json;
          if (!dompurify_sites.includes(domain))
            dompurify_sites.push(domain);
        }
      }
    }
  }
  if (enabledSites.includes('#options_optin_tgam_premium'))
    blockedRegexes['theglobeandmail.com'] = /smartwall\.theglobeandmail\.com\//;
  use_random_ip = Object.keys(random_ip);
  change_headers = use_google_bot.concat(use_bing_bot, use_facebook_referer, use_google_referer, use_twitter_referer, use_random_ip);
  disableJavascriptOnListedSites();
}

// add grouped sites to en/disabledSites (and exclude sites)
function add_grouped_enabled_domains(groups) {
  for (let key in groups) {
    if (enabledSites.includes(key))
      enabledSites = enabledSites.concat(groups[key]);
    else
      disabledSites = disabledSites.concat(groups[key]);
    for (let site of excludedSites) {
      if (enabledSites.includes(site)) {
        enabledSites.splice(enabledSites.indexOf(site), 1);
        disabledSites.push(site);
      }
    }
  }
}

// Get the enabled sites (from local storage) & set_rules for sites
ext_api.storage.local.get({
  sites: {},
  sites_default: Object.keys(defaultSites).filter(x => defaultSites[x].domain && !defaultSites[x].domain.match(/^(#options_|###$)/)),
  sites_custom: {},
  sites_updated: {},		 
  sites_excluded: [],
  ext_version_old: '2.3.9.0',
  optIn: false,
  optInUpdate: true
}, function (items) {
  var sites = items.sites;
  optionSites = sites;
  var sites_default = items.sites_default;
  customSites = items.sites_custom;
  customSites_domains = Object.values(customSites).map(x => x.domain);
  updatedSites = items.sites_updated;
  updatedSites_domains_new = Object.values(updatedSites).filter(x => (x.domain && !defaultSites_domains.includes(x.domain) || x.group)).map(x => x.group ? x.group.filter(y => !defaultSites_domains.includes(y)) : x.domain).flat();
  var ext_version_old = items.ext_version_old;
  optin_setcookie = items.optIn;
  optin_update = items.optInUpdate;
  excludedSites = items.sites_excluded;

  enabledSites = Object.values(sites).filter(function (val) {
      return (val !== '' && val !== '###');
    }).map(function (val) {
      return val.toLowerCase();
    });

  // Enable new sites by default (opt-in)
  updatedSites_new = Object.keys(updatedSites).filter(x => updatedSites[x].domain && !defaultSites_domains.includes(updatedSites[x].domain));
  for (let site_updated_new of updatedSites_new)
    defaultSites[site_updated_new] = updatedSites[site_updated_new];
  if (ext_version > ext_version_old || updatedSites_new.length > 0) {
    if (enabledSites.includes('#options_enable_new_sites')) {
      let sites_new = Object.keys(defaultSites).filter(x => defaultSites[x].domain && !defaultSites[x].domain.match(/^(#options_|###$)/) && !sites_default.some(key => compareKey(key, x)));
      for (let site_new of sites_new)
        sites[site_new] = defaultSites[site_new].domain;
      ext_api.storage.local.set({
        sites: sites
      });
    }
    sites_default = Object.keys(defaultSites).filter(x => defaultSites[x].domain && !defaultSites[x].domain.match(/^(#options_|###$)/));
    ext_api.storage.local.set({
      sites_default: sites_default,
      ext_version_old: ext_version
    });
  }

  disabledSites = defaultSites_grouped_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x));
  add_grouped_enabled_domains(grouped_sites);
  set_rules(sites, updatedSites, customSites);
  if (enabledSites.includes('#options_optin_update_rules'))
    check_sites_updated();
  if (optin_update)
    check_update();
});

// Listen for changes to options
ext_api.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'sync')
    return;
  for (let key in changes) {
    var storageChange = changes[key];
    if (key === 'sites') {
      var sites = storageChange.newValue;
      optionSites = sites;
      enabledSites = Object.values(sites).filter(function (val) {
          return (val !== '' && val !== '###');
        }).map(function (val) {
          return val.toLowerCase();
        });
      disabledSites = defaultSites_grouped_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x));
      add_grouped_enabled_domains(grouped_sites);
      set_rules(sites, updatedSites, customSites);
    }
    if (key === 'sites_custom') {
      var sites_custom = storageChange.newValue ? storageChange.newValue : {};
      var sites_custom_old = storageChange.oldValue ? storageChange.oldValue : {};
      customSites = sites_custom;
      customSites_domains = Object.values(sites_custom).map(x => x.domain);
      
      // add/remove custom sites in options (not for default site(group))
      var sites_custom_added = Object.keys(sites_custom).filter(x => !Object.keys(sites_custom_old).includes(x) && !defaultSites.hasOwnProperty(x) && !defaultSites_domains.includes(sites_custom[x].domain));
      var sites_custom_removed = Object.keys(sites_custom_old).filter(x => !Object.keys(sites_custom).includes(x) && !defaultSites.hasOwnProperty(x) && !defaultSites_domains.includes(sites_custom_old[x].domain));
      
      ext_api.storage.local.get({
        sites: {}
      }, function (items) {
        var sites = items.sites;
        if (sites_custom_added.concat(sites_custom_removed).length > 0) {
          for (let key of sites_custom_added)
            sites[key] = sites_custom[key].domain;
          for (let key of sites_custom_removed)
            delete sites[key];
          
          ext_api.storage.local.set({
            sites: sites
          }, function () {
            true;
          });
        } else
          set_rules(sites, updatedSites, customSites);
      });
    }
    if (key === 'sites_updated') {
      var sites_updated = storageChange.newValue ? storageChange.newValue : {};
      updatedSites = sites_updated;
      updatedSites_domains_new = Object.values(updatedSites).filter(x => (x.domain && !defaultSites_domains.includes(x.domain) || x.group)).map(x => x.group ? x.group.filter(y => !defaultSites_domains.includes(y)) : x.domain).flat();
      updatedSites_new = Object.keys(updatedSites).filter(x => updatedSites[x].domain && !defaultSites_domains.includes(updatedSites[x].domain));
      if (updatedSites_new.length > 0) {
        if (enabledSites.includes('#options_enable_new_sites')) {
          for (let site_updated_new of updatedSites_new)
            optionSites[site_updated_new] = updatedSites[site_updated_new].domain;
          ext_api.storage.local.set({
            sites: optionSites
          });
        }
      } else
        set_rules(optionSites, updatedSites, customSites);
    }											
    if (key === 'sites_excluded') {
      var sites_excluded = storageChange.newValue ? storageChange.newValue : [];
      var sites_excluded_old = storageChange.oldValue ? storageChange.oldValue : [];
      excludedSites = sites_excluded;

      // add/remove excluded sites in en/disabledSites
      var sites_excluded_added = sites_excluded.filter(x => !sites_excluded_old.includes(x));
      var sites_excluded_removed = sites_excluded_old.filter(x => !sites_excluded.includes(x));

      for (let site of sites_excluded_added) {
        if (enabledSites.includes(site)) {
          enabledSites.splice(enabledSites.indexOf(site), 1);
          disabledSites.push(site);
        }
      }
      for (let site of sites_excluded_removed) {
        if (disabledSites.includes(site)) {
          disabledSites.splice(disabledSites.indexOf(site), 1);
          enabledSites.push(site);
        }
      }
    }
    if (key === 'ext_version_new') {
      ext_version_new = storageChange.newValue;
    }
    if (key === 'optIn') {
      optin_setcookie = storageChange.newValue;
    }
    if (key === 'optInUpdate') {
      optin_update = storageChange.newValue;
    }
    // reset disableJavascriptOnListedSites eventListener
    ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
    ext_api.webRequest.handlerBehaviorChanged();

    // Refresh the current tab
    refreshCurrentTab();
  }
});

// Set and show default options on install
ext_api.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    setDefaultOptions();
  } else if (details.reason == "update") {
    ext_api.management.getSelf(function (result) {
      if (enabledSites.includes('#options_on_update') && result.installType !== 'development')
        ext_api.runtime.openOptionsPage(); // User updated extension (non-developer mode)
    });
  }
});

// repubblica.it bypass
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('/pwa/', '/ws/detail/');
  return { redirectUrl: updatedUrl };
},
{urls:["*://*.repubblica.it/pwa/*"], types:["main_frame"]},
["blocking"]
);

// inkl bypass
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace(/etok=[\w]*&/, '');
  if (details.url.includes('/signin?') && details.url.includes('redirect_to='))
    updatedUrl = 'https://www.inkl.com' + decodeURIComponent(updatedUrl.split('redirect_to=')[1]);
  return { redirectUrl: updatedUrl };
},
{urls:["*://*.inkl.com/*"], types:["main_frame"]},
["blocking"]
);

// m.faz.net set user-agent to mobile
const faz_uaMobile = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Mobile Safari/537.36";
ext_api.webRequest.onBeforeSendHeaders.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  let headers = details.requestHeaders;
  headers = headers.map(function (header) {
      if (header.name.toLowerCase() === 'user-agent')
        header.value = faz_uaMobile;
      return header;
    });
  return {
    requestHeaders: headers
  };
}, {
  urls: ["*://m.faz.net/*"],
  types: ["xmlhttprequest"]
},
  ["blocking", "requestHeaders"]);

// wap.business-standard.com (mobile) redirect to www (desktop)
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('/wap.', '/www.');
  return { redirectUrl: updatedUrl };
},
{urls:["*://wap.business-standard.com/*"], types:["main_frame"]},
["blocking"]
);

// www.business-standard.com set user-agent to desktop
const business_standard_uaDesktop = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36";
ext_api.webRequest.onBeforeSendHeaders.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  let headers = details.requestHeaders;
  headers = headers.map(function (header) {
      if (header.name.toLowerCase() === 'user-agent')
        header.value = business_standard_uaDesktop;
      return header;
    });
  return {
    requestHeaders: headers
  };
}, {
  urls: ["*://www.business-standard.com/*"],
  types: ["main_frame"]
},
  ["blocking", "requestHeaders"]);

// economictimes redirect
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.split('?')[0].replace('economictimes.indiatimes.com', 'm.economictimes.com');
  return { redirectUrl: updatedUrl };
},
{urls:["*://economictimes.indiatimes.com/*?from=mdr"], types:["main_frame"]},
["blocking"]
);

// infzm.com redirect to wap (mobile)
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('.com/contents/', '.com/wap/#/content/');
  return { redirectUrl: updatedUrl };
},
{urls:["*://www.infzm.com/contents/*"], types:["main_frame"]},
["blocking"]
);

// telegraaf.nl redirect error-page
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  let updatedUrl = details.url.split('&')[0].replace('error?ref=/', '');;
  return { redirectUrl: updatedUrl };
},
{urls:["*://www.telegraaf.nl/error?ref=/*"], types:["main_frame"]},
["blocking"]
);

// Australia News Corp redirect subscribe to amp
var au_news_corp_subscr = au_news_corp_domains.map(domain => '*://www.' + domain + '/subscribe/*');
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details) || details.url.includes('/digitalprinteditions') || !(details.url.includes('dest=') && details.url.split('dest=')[1].split('&')[0])) {
    return;
  }
  var updatedUrl = decodeURIComponent(details.url.split('dest=')[1].split('&')[0]);
  if (!matchUrlDomain('theaustralian.com.au', details.url))
    updatedUrl += '?amp';
  else
    updatedUrl = updatedUrl.replace('www.', 'amp.');
  return {
    redirectUrl: updatedUrl
  };
}, {
  urls: au_news_corp_subscr,
  types: ["main_frame"]
},
  ["blocking"]);

// fix nytimes x-frame-options (hidden iframe content)
ext_api.webRequest.onHeadersReceived.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var headers = details.responseHeaders;
  headers = headers.map(function (header) {
      if (header.name === 'x-frame-options')
        header.value = 'SAMEORIGIN';
      return header;
    });
  return {
    responseHeaders: headers
  };
}, {
  urls: ["*://*.nytimes.com/*"]
},
  ['blocking', 'responseHeaders']);

// block inline script
var block_js_inline = ["*://*.elpais.com/*", "*://*.theglobeandmail.com/*"];
if (block_js_inline.length) 
ext_api.webRequest.onHeadersReceived.addListener(function (details) {
  let url_path = details.url.split('?')[0];
  let excluded = (matchUrlDomain('elpais.com', details.url) && (url_path.includes('/elpais.com') || !url_path.includes('.html')))
  || (matchUrlDomain('theglobeandmail.com', details.url) && (!enabledSites.includes('#options_optin_tgam_premium') || !details.url.includes('?rel=premium')));
  if (!isSiteEnabled(details) || excluded)
    return;
  var headers = details.responseHeaders;
  headers.push({
    'name': 'Content-Security-Policy',
    'value': "script-src *;"
  });
  return {
    responseHeaders: headers
  };
}, {
  'types': ['main_frame', 'sub_frame'],
  'urls': block_js_inline
},
  ['blocking', 'responseHeaders']);

var block_js = [
  "*://*.blueconic.net/*",
  "*://*.cxense.com/*",
  "*://*.evolok.net/*",
  "*://*.googletagmanager.com/*",
  "*://*.newsmemory.com/?meter*",
  "*://*.onecount.net/*",
  "*://*.piano.io/*",
  "*://*.poool.fr/*",
  "*://*.qiota.com/*",
  "*://*.tribdss.com/*",
  "*://*.weborama.fr/*",
  "*://*.zephr.com/zephr-browser/*",
  "*://*/c/assets/pigeon.js*",
  "*://*/wp-content/evolok/ev-widgets/ev-widgets.min.js*",
  "*://*/wp-content/plugins/pico/includes/js/read-more.js*",
  "*://cdn.ampproject.org/v*/amp-access-*.*js",
  "*://cdn.ampproject.org/v*/amp-subscriptions-*.*js",
  "*://cdn.ampproject.org/v*/amp*-ad-*.*js",
  "*://cdn.ampproject.org/v*/amp-analytics-*.*js",
  "*://cdn.ampproject.org/v*/amp-fx-flying-carpet-*.*js",
  "*://cdn.tinypass.com/*",
  "*://js.matheranalytics.com/*",
  "*://js.pelcro.com/*",
  "*://loader-cdn.azureedge.net/prod/*/loader.min.js*",
  "*://nexus.ensighten.com/*/Bootstrap.js*",
];

// Disable javascript for these sites/general paywall-scripts
function disableJavascriptOnListedSites() {
  ext_api.webRequest.onBeforeRequest.addListener(function (details) {
    let header_referer = details.originUrl ? details.originUrl : details.initiator;
    if (!(isSiteEnabled(details)
         || (['script'].includes(details.type)
           && ((enabledSites.includes('###_wp_evolok') && details.url.includes('/wp-content/evolok/ev-widgets/ev-widgets.min.js'))
             || (enabledSites.includes('###_wp_pico') && details.url.includes('/wp-content/plugins/pico/includes/js/read-more.js'))
             || (enabledSites.includes('###_wp_pigeon') && details.url.includes('/c/assets/pigeon.js')))))
       || matchUrlDomain(excludedSites.concat(disabledSites, ['asia.nikkei.com', 'cambridge.org', 'japantimes.co.jp']), header_referer)) {
      return;
    }
    return {
      cancel: true
    };
  }, {
    urls: block_js,
    types: ["script", "xmlhttprequest"]
  },
    ["blocking"]);
}

if (typeof browser !== 'object') {
var focus_changed = false;
ext_api.windows.onFocusChanged.addListener((windowId) => {
  if (windowId > 0)
    focus_changed = true;
});
}

var extraInfoSpec = ['blocking', 'requestHeaders'];
if (ext_api.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS'))
  extraInfoSpec.push('extraHeaders');

ext_api.webRequest.onBeforeSendHeaders.addListener(function(details) {
  if (details.type === 'main_frame') {
    let current_date_str = currentDateStr();
    if (last_date_str < current_date_str) {
      bpc_count_daily_users(current_date_str);
      last_date_str = current_date_str;
    }
  }

  var requestHeaders = details.requestHeaders;

  var header_referer = '';
  if (details.originUrl)
    header_referer = details.originUrl;
  else {
    for (let n in requestHeaders) {
      if (requestHeaders[n].name.toLowerCase() == 'referer') {
        header_referer = requestHeaders[n].value;
        break;
      }
    }
    var blocked_referer_domains = ['foreignaffairs.com', 'timeshighereducation.com'];
    if (!header_referer && details.initiator) {
      header_referer = details.initiator;
      if (!blocked_referer && matchUrlDomain(blocked_referer_domains, details.url) && ['script', 'xmlhttprequest'].includes(details.type)) {
        for (let domain of blocked_referer_domains)
          restrictions[domain] = new RegExp('((\\/|\\.)' + domain.replace(/\./g, '\\.') + '($|\\/$)|' + restrictions[domain].toString().replace(/(^\/|\/$)/g, '') + ')');
        blocked_referer = true;
      }
    }
  }

  function customAddRules(custom_domains, custom_allow_cookies = '', custom_block_regex = '', custom_useragent = '', custom_referer = '', custom_amp_unhide = false) {
    let custom_domain = urlHost(header_referer).replace(/^(www|m|account|amp|edition|eu)\./, '');
    if (custom_allow_cookies && !allow_cookies.includes(custom_domain))
      allow_cookies.push(custom_domain);
    if (custom_block_regex)
      blockedRegexes[custom_domain] = custom_block_regex;
    if (custom_useragent) {
      if (custom_useragent === 'googlebot') {
        if (!use_google_bot.includes(custom_domain))
          use_google_bot.push(custom_domain);
        change_headers.push(custom_domain);
      }
    }
    if (custom_referer) {
      if (custom_referer === 'twitter') {
        if (!use_twitter_referer.includes(custom_domain))
          use_twitter_referer.push(custom_domain);
        change_headers.push(custom_domain);
      }
    }
    if (custom_amp_unhide) {
      if (!amp_unhide.includes(custom_domain))
        amp_unhide.push(custom_domain);
    }
    custom_domains.push(custom_domain);
    if (!enabledSites.includes(custom_domain))
      enabledSites.push(custom_domain);
    return custom_domains;
  }

  if (!matchUrlDomain(excludedSites, header_referer)) {

  // remove cookies for sites medium platform (custom domains)
  var medium_custom_domain = (matchUrlDomain('cdn-client.medium.com', details.url) && ['script'].includes(details.type) && !matchUrlDomain(medium_custom_domains.concat(['medium.com']), header_referer) && enabledSites.includes('###_medium_custom'));
  if (medium_custom_domain)
    medium_custom_domains = customAddRules(medium_custom_domains);
  else {
    let header_referer_hostname = urlHost(header_referer);
    if (header_referer_hostname.match(/\.(com|net)\.au$/)) {
      // block Piano.io for regional Australian Community Media sites (opt-in to custom sites)
      var au_comm_media_domain = (details.url.startsWith('https://' + header_referer_hostname + '/promotions/website_content_esov/') && ['xmlhttprequest'].includes(details.type) && !matchUrlDomain(au_comm_media_domains, header_referer) && enabledSites.includes('###_au_comm_media'));
      if (au_comm_media_domain)
        au_comm_media_domains = customAddRules(au_comm_media_domains, true, blockedRegexes['canberratimes.com.au']);
      else if (header_referer_hostname.endsWith('.com.au')) {
        // enable regional The West Australian sites (opt-in to custom sites)
        var au_thewest_domains = ['thewest.com.au'];
        var au_thewest_domain = (details.url.startsWith('https://images.thewest.com.au/') && ['image'].includes(details.type) &&
          !matchUrlDomain(au_thewest_domains, header_referer) && enabledSites.includes('thewest.com.au'));
        if (au_thewest_domain)
          au_thewest_domains = customAddRules(au_thewest_domains, true);
      }
    } else if (header_referer_hostname.endsWith('.ch')) {
      // set googlebot-useragent for regional nzz.ch sites (opt-in to custom sites)
      var ch_media_domains = [];
      var ch_media_domain = (matchUrlDomain('static-chmedia.ch', details.url) && ['script'].includes(details.type) && !matchUrlDomain(ch_media_domains, header_referer) && enabledSites.includes('nzz.ch'));
      if (ch_media_domain)
        ch_media_domains = customAddRules(ch_media_domains, true, blockedRegexes['nzz.ch'], 'googlebot');
    } else if (header_referer_hostname.endsWith('.de')) {
      // set googlebot-useragent for additional Funke sites (opt-in to custom sites)
      var de_funke_medien_domains = grouped_sites['###_de_funke_medien'];
      var de_funke_domain = (matchUrlDomain('funkedigital.de', details.url) && ['script'].includes(details.type) && !matchUrlDomain(de_funke_medien_domains, header_referer) && enabledSites.includes('###_de_funke_medien'));
      if (de_funke_domain)
        de_funke_medien_domains = customAddRules(de_funke_medien_domains, true, blockedRegexes['waz.de'], 'googlebot');
      else {
        // block script for additional Madsack/RND sites (opt-in to custom sites)
        var de_madsack_domains = grouped_sites['###_de_madsack'];
        var de_madsack_custom_domains = ['aller-zeitung.de', 'dnn.de', 'gnz.de', 'goettinger-tageblatt.de', 'paz-online.de', 'sn-online.de', 'waz-online.de'];
        var de_madsack_domain = (matchUrlDomain(de_madsack_custom_domains, details.url) && !matchUrlDomain(de_madsack_domains, header_referer) && enabledSites.includes('###_de_madsack'));
        if (de_madsack_domain)
          de_madsack_domains = customAddRules(de_madsack_domains, true, blockedRegexes['haz.de']);
      }
    } else if (header_referer_hostname.match(/\.(es|cat)$/) || matchUrlDomain(['diariocordoba.com', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'emporda.info'], header_referer)) {
      // block Piano.io for unlisted Grupo Prensa Ibérica (opt-in to custom sites)
      var es_epiberica_domains = grouped_sites['###_es_epiberica'];
      var es_epiberica_custom_domains = ['diaridegirona.cat', 'diariocordoba.com', 'diariodeibiza.es', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'emporda.info', 'laopinioncoruna.es', 'laopiniondemalaga.es', 'laopiniondemurcia.es', 'laopiniondezamora.es', 'regio7.cat'];
      var es_epiberica_domain = (matchUrlDomain(es_epiberica_custom_domains, details.url) && !matchUrlDomain(es_epiberica_domains, header_referer) && enabledSites.includes('###_es_epiberica'));
      if (es_epiberica_domain)
        es_epiberica_domains = customAddRules(es_epiberica_domains, true, blockedRegexes['epe.es']);
    } else if (header_referer_hostname.endsWith('.fi')) {
      // set user-agent to GoogleBot for additional Snamoma Media Finland (opt-in to custom sites)
      var fi_sanoma_domains = grouped_sites['###_fi_sanoma'];
      var fi_sanoma_sndp_domain = (matchUrlDomain('sanoma-sndp.fi', details.url) && ['xmlhttprequest'].includes(details.type) && !matchUrlDomain(fi_sanoma_domains, header_referer) && enabledSites.includes('###_fi_sanoma'));
      if (fi_sanoma_sndp_domain)
        fi_sanoma_domains = customAddRules(fi_sanoma_domains, true, '', 'googlebot');
    } else if (header_referer_hostname.endsWith('.nl')) {
      // block Evolok for Mediahuis Noord sites (opt-in to custom sites)
      var nl_mediahuis_noord_domains = [];
      var nl_mediahuis_noord_domain = (matchUrlDomain('ndcmediagroep.nl', details.url) && ['script'].includes(details.type) && !matchUrlDomain(nl_mediahuis_noord_domains, header_referer) && enabledSites.includes('###_nl_mediahuis_noord'));
      if (nl_mediahuis_noord_domain)
        nl_mediahuis_noord_domains = customAddRules(nl_mediahuis_noord_domains, true, blockedRegexes['lc.nl']);
    } else if (header_referer_hostname.match(/\.(ca|com|org)$/)) {
      // block TinyPass for Postmedia Network sites
      var ca_postmedia_domains = grouped_sites['###_ca_postmedia'];
      var ca_postmedia_domain = (matchUrlDomain('postmedia.digital', details.url) && ['script'].includes(details.type) && !matchUrlDomain(ca_postmedia_domains.concat(['canada.com', 'canoe.com', 'driving.ca']), header_referer) && enabledSites.includes('###_ca_postmedia'));
      if (ca_postmedia_domain)
        ca_postmedia_domains = customAddRules(ca_postmedia_domains, true, blockedRegexes['nationalpost.com']);
      else {
        // set googlebot-useragent for Gannett sites
        var usa_gannett_domains = grouped_sites['###_usa_gannett'];
        var usa_gannett_domain = (matchUrlDomain('gannett-cdn.com', details.url) && ['xmlhttprequest'].includes(details.type) && !matchUrlDomain(usa_gannett_domains.concat(['usatoday.com']), header_referer) && enabledSites.includes('###_usa_gannett'));
        if (usa_gannett_domain)
          usa_gannett_domains = customAddRules(usa_gannett_domains, '', blockedRegexes['azcentral.com'], 'googlebot', '', true);
        else {
          var usa_hearst_comm_domains = grouped_sites['###_usa_hearst_comm'];
          var usa_hearst_comm_domain = (matchUrlDomain('treg.hearstnp.com', details.url) && ['script'].includes(details.type) && !matchUrlDomain(usa_hearst_comm_domains, header_referer) && enabledSites.includes('###_usa_hearst_comm'));
          if (usa_hearst_comm_domain)
            usa_hearst_comm_domains = customAddRules(usa_hearst_comm_domains, '', blockedRegexes['houstonchronicle.com']);
          else {
            // block script for additional Lee Enterprises sites (opt-in to custom sites)
            var usa_lee_ent_domains = grouped_sites['###_usa_lee_ent'];
            var usa_lee_ent_domain = (details.url.match(/\.townnews\.com\/(central\.)?leetemplates\.com\//) && ['script'].includes(details.type) &&
              !matchUrlDomain(usa_lee_ent_domains, header_referer) && enabledSites.includes('###_usa_lee_ent'));
            if (usa_lee_ent_domain)
              usa_lee_ent_domains = customAddRules(usa_lee_ent_domains, '', blockedRegexes['buffalonews.com']);
            else {
              // block script for TownNews sites (Blox CMS; opt-in to custom sites)
              var usa_townnews_domains = [];
              var usa_townnews_domain = (details.url.match(/\.townnews\.com\/.+\/tncms\//) && ['script'].includes(details.type) &&
                !matchUrlDomain(usa_townnews_domains.concat(usa_lee_ent_domains, ['townnews.com', 'galvnews.com']), header_referer) && enabledSites.includes('###_usa_townnews'));
              if (usa_townnews_domain)
                usa_townnews_domains = customAddRules(usa_townnews_domains, '', /\.com\/shared-content\/art\/tncms\/user\/user\.js/);
              else {
                // block script for additional McClatchy sites (opt-in to custom sites)
                var usa_mcc_domains = grouped_sites['###_usa_mcc'];
                var usa_mcc_domain = (((matchUrlDomain('mcclatchyinteractive.com', details.url) && ['script'].includes(details.type)) ||
                    (matchUrlDomain('mcclatchy-wires.com', details.url) && ['image'].includes(details.type))) &&
                  !matchUrlDomain(usa_mcc_domains, header_referer) && enabledSites.includes('###_usa_mcc'));
                if (usa_mcc_domain)
                  usa_mcc_domains = customAddRules(usa_mcc_domains, '', blockedRegexes['bnd.com']);
                else {
                  // block script for additional MediaNews Group sites (opt-in to custom sites)
                  var usa_mng_domains = grouped_sites['###_usa_mng'];
                  var usa_mng_domain = (details.url.match(/\.com\/wp-content\/plugins\/dfm(-|_).+\.js/) && ['script'].includes(details.type) &&
                    !matchUrlDomain(usa_mng_domains, header_referer) && enabledSites.includes('###_usa_mng'));
                  if (usa_mng_domain)
                    usa_mng_domains = customAddRules(usa_mng_domains, '', blockedRegexes['denverpost.com']);
                }
              }
            }
          }
        }
      }
    }
  }

  } // not in excludedSites

  // block external javascript for custom sites (optional)
  var domain_blockjs_ext = matchUrlDomain(block_js_custom_ext, header_referer);
  if (domain_blockjs_ext && !matchUrlDomain(domain_blockjs_ext, details.url) && details.type === 'script' && isSiteEnabled({url: header_referer})) {
    return { cancel: true };
  }

  // check for blocked regular expression: domain enabled, match regex, block on an internal or external regex
  var blockedDomains = Object.keys(blockedRegexes);
  var domain = matchUrlDomain(blockedDomains, header_referer);
  if (domain && details.url.match(blockedRegexes[domain]) && isSiteEnabled({url: header_referer}))
    return { cancel: true };

  // load toggleIcon.js (icon for dark or incognito mode in Chrome))
  if (typeof browser !== 'object' && ['main_frame', 'xmlhttprequest'].includes(details.type)) {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
        ext_api.tabs.executeScript({
          file: 'options/toggleIcon.js',
          runAt: 'document_start'
        }, function (res) {
          if (ext_api.runtime.lastError || res[0]) {
            return;
          }
        });
      }
    });
  }

  let allow_ext_source = medium_custom_domain;
  let bpc_amp_site = false;

  if (isSiteEnabled({url: header_referer}) && ['script', 'image'].includes(details.type)) {
    bpc_amp_site = matchUrlDomain('cdn.ampproject.org', details.url);
    allow_ext_source = allow_ext_source || bpc_amp_site ||
      (matchUrlDomain('elespanol.com', header_referer) && matchUrlDomain('eestatic.com', details.url)) ||
      (matchUrlDomain('elmercurio.com', header_referer) && matchUrlDomain('emol.cl', details.url)) ||
      (matchUrlDomain('epaper.thetimes.co.uk', header_referer) && matchUrlDomain(['prcdn.co'], details.url)) ||
      (matchUrlDomain('law360.com', header_referer) && matchUrlDomain('law360news.com', details.url)) ||
      (matchUrlDomain('marketwatch.com', header_referer) && matchUrlDomain('wsj.net', details.url)) ||
      (matchUrlDomain('nationalgeographic.com', header_referer) && matchUrlDomain('natgeofe.com', details.url)) ||
      (matchUrlDomain('usatoday.com', header_referer) && matchUrlDomain('gannett-cdn.com', details.url)) ||
      (matchUrlDomain(it_repubblica_domains, header_referer) && matchUrlDomain(['repstatic.it'], details.url));
  }

  if (!isSiteEnabled(details) && !allow_ext_source) {
    return;
  }

  // block javascript of (sub)domain for custom sites (optional)
  var domain_blockjs = matchUrlDomain(block_js_custom, details.url);
  if (domain_blockjs && matchUrlDomain(domain_blockjs, details.url) && details.type === 'script') {
    return { cancel: true };
  }

  var tabId = details.tabId;

  var useUserAgentMobile = false;
  var setReferer = false;

if (matchUrlDomain(change_headers, details.url) && !['font', 'image', 'stylesheet'].includes(details.type)) {
  var mobile = details.requestHeaders.filter(x => x.name.toLowerCase() === "user-agent" && x.value.toLowerCase().includes("mobile")).length;
  var googlebotEnabled = matchUrlDomain(use_google_bot, details.url) && 
    !(matchUrlDomain('abc.es', details.url) && mobile) &&
    !(matchUrlDomain('barrons.com', details.url) && enabledSites.includes('#options_disable_gb_barrons')) &&
    !(matchUrlDomain('theaustralian.com.au', details.url) && !details.url.startsWith('https://www.theaustralian.com.au/the-oz/')) &&
    !(matchUrlDomain('thetimes.co.uk', details.url) && !(details.url.match(/\/epaper\.thetimes\.co\.uk\/article\//) || mobile)) &&
    !(matchUrlDomain('wsj.com', details.url) && enabledSites.includes('#options_disable_gb_wsj'));
  var bingbotEnabled = matchUrlDomain(use_bing_bot, details.url) && 
    !(matchUrlDomain('stratfor.com', details.url) && details.url.match(/(\/(\d){4}-([a-z]||-)+-forecast(-([a-z]|-)+)?|-forecast-(\d){4}-([a-z]|[0-9]||-)+)$/));

  // if referer exists, set it
  requestHeaders = requestHeaders.map(function (requestHeader) {
    if (requestHeader.name === 'Referer') {
      if (googlebotEnabled || matchUrlDomain(use_google_referer, details.url)) {
        requestHeader.value = 'https://www.google.com/';
      } else if (matchUrlDomain(use_facebook_referer, details.url)) {
        requestHeader.value = 'https://www.facebook.com/';
      } else if (matchUrlDomain(use_twitter_referer, details.url)) {
        requestHeader.value = 'https://t.co/';
      }
      setReferer = true;
    }
    if (requestHeader.name === 'User-Agent') {
      useUserAgentMobile = requestHeader.value.toLowerCase().includes("mobile") && !matchUrlDomain(['telerama.fr'].concat(it_repubblica_domains), details.url);
    }
    return requestHeader;
  });

  // otherwise add it
  if (!setReferer) {
    if (googlebotEnabled || matchUrlDomain(use_google_referer, details.url)) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.google.com/'
      });
    } else if (matchUrlDomain(use_facebook_referer, details.url)) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.facebook.com/'
      });
    } else if (matchUrlDomain(use_twitter_referer, details.url)) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://t.co/'
      });
    }
  }

  // override User-Agent to use Googlebot
  if (googlebotEnabled) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobileG : userAgentDesktopG
    })
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": "66.249.66.1"
    })
  }

  // override User-Agent to use Bingbot
  if (bingbotEnabled) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobileB : userAgentDesktopB
    })
  }

  // random IP for sites in use_random_ip
  let domain_random;
  if (domain_random = matchUrlDomain(use_random_ip, details.url)) {
    let randomIP_val;
    if (random_ip[domain_random] === 'eu')
      randomIP_val = randomIP(185, 185);
    else
      randomIP_val = randomIP();
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": randomIP_val
    })
  }
}

  // remove cookies before page load
  if (!matchUrlDomain(allow_cookies, details.url)) {
    requestHeaders = requestHeaders.map(function(requestHeader) {
      if (requestHeader.name === 'Cookie') {
        requestHeader.value = '';
      }
      return requestHeader;
    });
  }

  if (tabId !== -1) {
    ext_api.tabs.get(tabId, function (currentTab) {
      if (!ext_api.runtime.lastError && currentTab && (isSiteEnabled(currentTab) || medium_custom_domain)) {
        if (currentTab.url !== currentTabUrl) {
          csDone = false;
          currentTabUrl = currentTab.url;
        }
        if ((!['font', 'stylesheet'].includes(details.type) || matchUrlDomain(cs_limit_except, currentTabUrl)) && !csDone) {
          let lib_file = 'lib/empty.js';
          if (matchUrlDomain(dompurify_sites, currentTabUrl))
            lib_file = 'lib/purify.min.js';
          var bg2csData = {
            optin_setcookie: optin_setcookie,
            amp_unhide: matchUrlDomain(amp_unhide, currentTabUrl)
          };
          let amp_redirect_domain = '';
          if (amp_redirect_domain = matchUrlDomain(Object.keys(amp_redirect), currentTabUrl))
            bg2csData.amp_redirect = amp_redirect[amp_redirect_domain];
          let cs_code_domain = '';
          if (cs_code_domain = matchUrlDomain(Object.keys(cs_code), currentTabUrl))
            bg2csData.cs_code = cs_code[cs_code_domain];
          let ld_json_domain = '';
          if (ld_json_domain = matchUrlDomain(Object.keys(ld_json), currentTabUrl))
            bg2csData.ld_json = ld_json[ld_json_domain];
          ext_api.tabs.executeScript(tabId, {
            code: 'var bg2csData = ' + JSON.stringify(bg2csData) + ';'
          }, function () {
            ext_api.tabs.executeScript(tabId, {
              file: lib_file,
              runAt: 'document_start'
            }, function () {
              ext_api.tabs.executeScript(tabId, {
                file: 'contentScript.js',
                runAt: 'document_start'
              }, function (res) {
                if (ext_api.runtime.lastError || res[0]) {
                  return;
                }
              })
            });
          });
        }
      }
    });
  } else { //mercuriovalpo.cl, estrellavalpo.cl, lequipe.fr
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
        let currentTab = tabs[0];
        if (isSiteEnabled(currentTab)) {
          let lib_file = 'lib/empty.js';
          if (matchUrlDomain(['lequipe.fr'], currentTab.url))
            lib_file = 'lib/purify.min.js';
          ext_api.tabs.executeScript({
            file: lib_file,
            runAt: 'document_start'
          }, function () {
            ext_api.tabs.executeScript({
              file: 'contentScript.js',
              runAt: 'document_start'
            }, function (res) {
              if (ext_api.runtime.lastError || res[0]) {
                return;
              }
            })
          });
        }
      }
    });
  }

  return { requestHeaders: requestHeaders };
}, {
  urls: ['<all_urls>']
}, extraInfoSpec);
// extraInfoSpec is ['blocking', 'requestHeaders'] + possible 'extraHeaders'

ext_api.tabs.onUpdated.addListener(function (tabId, info, tab) { updateBadge(tab); });
ext_api.tabs.onActivated.addListener(function (activeInfo) { if (activeInfo.tabId) ext_api.tabs.get(activeInfo.tabId, updateBadge); });

function updateBadge(activeTab) {
  if (ext_api.runtime.lastError || !activeTab)
    return;
  let badgeText = '';
  let color = 'red';
  let currentUrl = activeTab.url;
  if (currentUrl) {
    if (isSiteEnabled({url: currentUrl})) {
      badgeText = 'ON';
      color = 'red';
    } else if (matchUrlDomain(enabledSites, currentUrl)) {
      badgeText = 'ON-';
      color = 'orange';
    } else if (matchUrlDomain(disabledSites, currentUrl)) {
      badgeText = 'OFF';
      color = 'blue';
    } else if (matchUrlDomain(nofix_sites, currentUrl)) {
      badgeText = 'X';
      color = 'gray';
    }
    if (ext_version_new)
      badgeText = '^' + badgeText;
    let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
    let isCustomSite = matchUrlDomain(customSites_domains, currentUrl);
    let isUpdatedSite = matchUrlDomain(updatedSites_domains_new, currentUrl);
    if (!isDefaultSite && (isCustomSite || isUpdatedSite)) {
      ext_api.permissions.contains({
        origins: ['*://*.' + (isCustomSite || isUpdatedSite) + '/*']
      }, function (result) {
        if (!result)
          badgeText = enabledSites.includes(isCustomSite || isUpdatedSite) ? 'C' : '';
        if (color && badgeText)
          ext_api.browserAction.setBadgeBackgroundColor({color: color});
        ext_api.browserAction.setBadgeText({text: badgeText});
      });
    } else {
      if (color && badgeText)
        ext_api.browserAction.setBadgeBackgroundColor({color: color});
      ext_api.browserAction.setBadgeText({text: badgeText});
    }
  } else
      ext_api.browserAction.setBadgeText({text: badgeText});
}

var ext_version_new;
function check_update() {
  let manifest_new = 'https://gitlab.com/magnolia1234/bypass-paywalls-' + url_loc + '-clean/raw/master/manifest.json';
  fetch(manifest_new)
  .then(response => {
    if (response.ok) {
      response.json().then(json => {
        ext_api.management.getSelf(function (result) {
          var installType = result.installType;
          var ext_version_len = (installType === 'development') ? 7 : 5;
          ext_version_new = json['version'];
          if (ext_version_new.substring(0, ext_version_len) <= ext_version.substring(0, ext_version_len))
            ext_version_new = '';
          ext_api.storage.local.set({
            ext_version_new: ext_version_new
          });
        });
      })
    }
  }).catch(function (err) {
    false;
  });
}

function site_switch() {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
      let currentUrl = tabs[0].url;
      let isDefaultSite = matchUrlDomain(defaultSites_grouped_domains, currentUrl);
      if (!isDefaultSite) {
        let isDefaultSiteGroup = matchUrlDomain(defaultSites_domains, currentUrl);
        if (isDefaultSiteGroup)
          isDefaultSite = Object.keys(grouped_sites).find(key => grouped_sites[key].includes(isDefaultSiteGroup));
      }
      if (!isDefaultSite) {
        let sites_updated_domains_new = Object.values(updatedSites).filter(x => x.domain && !defaultSites_domains.includes(x.domain));
        let isUpdatedSite = matchUrlDomain(sites_updated_domains_new, currentUrl);
        if (isUpdatedSite)
          isDefaultSite = isUpdatedSite;
      }
      let defaultSite_title = isDefaultSite ? Object.keys(defaultSites).find(key => defaultSites[key].domain === isDefaultSite) : '';
      let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
      let customSite_title = isCustomSite ? Object.keys(customSites).find(key => customSites[key].domain === isCustomSite) : '';
      let site_title = defaultSite_title || customSite_title;
      let domain = isDefaultSite || isCustomSite;
      if (domain && site_title) {
        let added_site = [];
        let removed_site = [];
        if (enabledSites.includes(domain))
          removed_site.push(site_title);
        else
          added_site.push(site_title);
        ext_api.storage.local.get({
          sites: {}
        }, function (items) {
          var sites = items.sites;
          for (let key of added_site)
            sites[key] = domain;
          for (let key of removed_site) {
            key = Object.keys(sites).find(sites_key => compareKey(sites_key, key));
            delete sites[key];
          }
          ext_api.storage.local.set({
            sites: sites
          }, function () {
            true;
          });
        });
      }
    }
  });
}

function remove_cookies_fn(domainVar, exclusions = false) {
  ext_api.cookies.getAllCookieStores(function (cookieStores) {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (!ext_api.runtime.lastError && tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
        let tabId = tabs[0].id;
        let storeId = '0';
        for (let store of cookieStores) {
          if (store.tabIds.includes(tabId))
            storeId = store.id;
        }
        storeId = storeId.toString();
        if (domainVar === 'asia.nikkei.com')
          domainVar = 'nikkei.com';
        var cookie_get_options = {
          domain: domainVar
        };
        if (storeId !== 'null')
          cookie_get_options.storeId = storeId;
        var cookie_remove_options = {};
        ext_api.cookies.getAll(cookie_get_options, function (cookies) {
          for (let cookie of cookies) {
            if (exclusions) {
              var rc_domain = cookie.domain.replace(/^(\.?www\.|\.)/, '');
              // hold specific cookie(s) from remove_cookies domains
              if ((rc_domain in remove_cookies_select_hold) && remove_cookies_select_hold[rc_domain].includes(cookie.name)) {
                continue; // don't remove specific cookie
              }
              // drop only specific cookie(s) from remove_cookies domains
              if ((rc_domain in remove_cookies_select_drop) && !(remove_cookies_select_drop[rc_domain].includes(cookie.name))) {
                continue; // only remove specific cookie
              }
              // hold on to consent-cookie
              if (cookie.name.match(/(consent|^optanon)/i)) {
                continue;
              }
            }
            cookie.domain = cookie.domain.replace(/^\./, '');
            cookie_remove_options = {
              url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path,
              name: cookie.name
            };
            if (storeId !== 'null')
              cookie_remove_options.storeId = storeId;
            ext_api.cookies.remove(cookie_remove_options);
          }
        });
      }
    });
  })
}

// remove cookies after page load
ext_api.webRequest.onCompleted.addListener(function (details) {
  let domain = matchUrlDomain(remove_cookies, details.url);
  let types = ['main_frame', 'sub_frame', 'xmlhttprequest', 'other'];
  if (['medium.com'].concat(medium_custom_domains).includes(domain))
    types = ['main_frame', 'image'];
  if (domain && types.includes(details.type) && enabledSites.includes(domain)) {
    remove_cookies_fn(domain, true);
  }
}, {
  urls: ["<all_urls>"]
});

function clear_cookies() {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
      ext_api.tabs.executeScript({
        file: 'options/clearCookies.js',
        runAt: 'document_start'
      }, function (res) {
        if (ext_api.runtime.lastError || res[0]) {
          return;
        }
      });
      ext_api.tabs.update(tabs[0].id, {
        url: tabs[0].url
      });
    }
  });
}

var chrome_scheme = 'light';
ext_api.runtime.onMessage.addListener(function (message, sender) {
  if (message.request === 'clear_cookies') {
    clear_cookies();
  }
  // clear cookies for domain
  if (message.domain) {
    remove_cookies_fn(message.domain);
  }
  if (message.request === 'site_switch') {
    site_switch();
  }
  if (message.request === 'check_sites_updated') {
    check_sites_updated();
  }
  if (message.request === 'popup_show_toggle') {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
        let currentUrl = tabs[0].url;
        let domain;
        let isExcludedSite = matchUrlDomain(excludedSites, currentUrl);
        if (!isExcludedSite) {
          let isDefaultSiteGrouped = matchUrlDomain(defaultSites_domains, currentUrl);
          let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
          let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
          domain = isDefaultSiteGrouped || (!isDefaultSite && isCustomSite);
        }
        ext_api.runtime.sendMessage({
          msg: "popup_show_toggle",
          data: {
            domain: domain,
            enabled: enabledSites.includes(domain)
          }
        });
      }
    });
  }
  if (message.request === 'refreshCurrentTab') {
    refreshCurrentTab();
  }
  if (message.request === 'getExtSrc' && message.data) {
    fetch(message.data.url)
    .then(response => {
      if (response.ok) {
        response.text().then(html => {
          if (message.data.base64) {
            html = decode_utf8(atob(html));
            message.data.selector_source = 'body';
          }
          let parser = new DOMParser();
          let doc = parser.parseFromString(html, 'text/html');
          let article_new = doc.querySelector(message.data.selector_source);
          message.data.html = article_new.outerHTML;
          ext_api.tabs.query({
            active: true,
            currentWindow: true
          }, function (tabs) {
            if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
              ext_api.tabs.sendMessage(sender.tab.id, {msg: "showExtSrc", data: message.data});
            }
          });
        });
      }
    }).catch(function (err) {
      message.data.html = '';
      ext_api.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
          ext_api.tabs.sendMessage(sender.tab.id, {msg: "showExtSrc", data: message.data});
        }
      });
    });
  }
  if (message.scheme && (![chrome_scheme, 'undefined'].includes(message.scheme) || focus_changed)) {
      let icon_path = {path: {'128': 'bypass.png'}};
      if (message.scheme === 'dark')
          icon_path = {path: {'128': 'bypass-dark.png'}};
      ext_api.browserAction.setIcon(icon_path);
      chrome_scheme = message.scheme;
      focus_changed = false;
  }
  if (message.csDone) {
    csDone = true;
    //console.log('msg.csDone: ' + csDone);
  }
});

// show the opt-in tab on installation
ext_api.storage.local.get(["optInShown", "customShown"], function (result) {
  if (!result.optInShown || !result.customShown) {
    ext_api.tabs.create({
      url: "options/optin/opt-in.html"
    });
    ext_api.storage.local.set({
      "optInShown": true,
      "customShown": true
    });
  }
});

// restore custom sites opt-in on reload (chrome-only, load upacked)
if (typeof browser !== 'object') {
  ext_api.storage.local.get({
    sites: {},
    customOptIn: false
  }, function (result) {
    let options_restore_custom = Object.values(result.sites).includes('#options_restore_custom');
    if (result.customOptIn && options_restore_custom) {
      ext_api.permissions.contains({
        origins: ["<all_urls>"]
      }, function (result_perm) {
        if (!result_perm) {
          ext_api.tabs.create({
            url: "options/optin/opt-in.html"
          });
        }
      });
    }
  });
}

function filterObject(obj, filterFn, mapFn = function (val, key) {
  return [key, val];
}) {
  return Object.fromEntries(Object.entries(obj).
    filter(([key, val]) => filterFn(val, key)).map(([key, val]) => mapFn(val, key)));
}

function compareKey(firstStr, secondStr) {
  return firstStr.toLowerCase().replace(/\s\(.*\)/, '') === secondStr.toLowerCase().replace(/\s\(.*\)/, '');
}

function isSiteEnabled(details) {
  var enabledSite = matchUrlDomain(enabledSites, details.url);
  if (!ext_name.startsWith('Bypass Paywalls Clean'))
    enabledSite = '';
  if (enabledSite in restrictions) {
    return restrictions[enabledSite].test(details.url);
  }
  return !!enabledSite;
}

function matchDomain(domains, hostname = '') {
  var matched_domain = false;
  if (typeof domains === 'string')
    domains = [domains];
  domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matched_domain = domain));
  return matched_domain;
}

function urlHost(url) {
  if (url && url.startsWith('http')) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      console.log(`url not valid: ${url} error: ${e}`);
    }
  }
  return url;
}

function matchUrlDomain(domains, url) {
  return matchDomain(domains, urlHost(url));
}

function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function stripQueryStringAndHashFromPath(url) {
  return url.split("?")[0].split("#")[0];
}

function decode_utf8(str) {
  return decodeURIComponent(escape(str));
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIP(range_low = 0, range_high = 223) {
  let rndmIP = [];
  for (let n = 0; n < 4; n++) {
    if (n === 0)
      rndmIP.push(range_low + randomInt(range_high - range_low + 1));
    else
      rndmIP.push(randomInt(255) + 1);
  }
  return rndmIP.join('.');
}

// Refresh the current tab
function refreshCurrentTab() {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
      if (ext_api.runtime.lastError)
        return;
      ext_api.tabs.update(tabs[0].id, {
        url: tabs[0].url
      });
    }
  });
}
