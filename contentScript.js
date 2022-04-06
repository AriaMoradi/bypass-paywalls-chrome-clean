//"use strict";
var ext_api = (typeof browser === 'object') ? browser : chrome;
var domain;
var csDone = false;
var csDoneOnce = false;
var dompurify_loaded = (typeof DOMPurify === 'function');

var ca_torstar_domains = ['niagarafallsreview.ca', 'stcatharinesstandard.ca', 'thepeterboroughexaminer.com', 'therecord.com', 'thespec.com', 'thestar.com', 'wellandtribune.ca'];
var de_funke_media_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'tlz.de', 'waz.de', 'wp.de', 'wr.de'];
var de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de', 'rnd.de'];
var de_madsack_custom_domains = ['aller-zeitung.de', 'dnn.de', 'gnz.de', 'goettinger-tageblatt.de', 'paz-online.de', 'sn-online.de', 'waz-online.de'];
var es_epiberica_domains = ['diariocordoba.com', 'diariodeibiza.es', 'diariodemallorca.es', 'eldia.es', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'epe.es', 'farodevigo.es', 'informacion.es', 'laopinioncoruna.es', 'laopiniondemalaga.es', 'laopiniondemurcia.es', 'laopiniondezamora.es', 'laprovincia.es', 'levante-emv.com', 'lne.es'];
var es_grupo_vocento_domains = ['diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'lasprovincias.es', 'laverdad.es', 'lavozdigital.es'];
var es_unidad_domains = ['elmundo.es', 'expansion.com', 'marca.com'];
var fi_alma_talent_domains = ['arvopaperi.fi', 'iltalehti.fi', 'kauppalehti.fi', 'marmai.fi', 'mediuutiset.fi', 'mikrobitti.fi', 'talouselama.fi', 'tekniikkatalous.fi', 'tivi.fi', 'uusisuomi.fi'];
var fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr', 'vosgesmatin.fr'];
var fr_groupe_la_depeche_domains = ['centrepresseaveyron.fr', 'ladepeche.fr', 'lindependant.fr', 'midi-olympique.fr', 'midilibre.fr', 'nrpyrenees.fr', 'petitbleu.fr'];
var fr_groupe_nice_matin_domains = ['monacomatin.mc', 'nicematin.com', 'varmatin.com'];
var it_ilmessaggero_domains = ['corriereadriatico.it', 'ilgazzettino.it', 'ilmattino.it', 'ilmessaggero.it', 'quotidianodipuglia.it'];
var it_repubblica_domains = ['gelocal.it', 'ilsecoloxix.it', 'italian.tech', 'lanuovasardegna.it', 'lastampa.it', 'repubblica.it'];
var it_quotidiano_domains = ['ilgiorno.it', 'ilrestodelcarlino.it', 'iltelegrafolivorno.it', 'lanazione.it', 'quotidiano.net'];
var nl_mediahuis_region_domains = ['gooieneemlander.nl', 'haarlemsdagblad.nl', 'ijmuidercourant.nl', 'leidschdagblad.nl', 'noordhollandsdagblad.nl'];
var no_nhst_media_domains = ['intrafish.com', 'rechargenews.com', 'tradewindsnews.com', 'upstreamonline.com'];
var pe_grupo_elcomercio_domains = ['diariocorreo.pe', 'elcomercio.pe', 'gestion.pe'];
var timesofindia_domains = ['timesofindia.com', 'timesofindia.indiatimes.com'];
var usa_adv_local_domains = ['al.com', 'cleveland.com', 'lehighvalleylive.com', 'masslive.com', 'mlive.com', 'nj.com', 'oregonlive.com', 'pennlive.com', 'silive.com', 'syracuse.com'];
var usa_conde_nast_domains = ['bonappetit.com', 'gq.com' , 'newyorker.com', 'vanityfair.com', 'vogue.com', 'wired.com'];
var usa_craincomm_domains = ['adage.com', 'autonews.com', 'chicagobusiness.com', 'crainscleveland.com', 'crainsdetroit.com', 'crainsnewyork.com', 'modernhealthcare.com'];
var usa_hearst_comm_domains = ['expressnews.com', 'houstonchronicle.com', 'sfchronicle.com'];
var usa_lee_ent_domains = ['buffalonews.com', 'richmond.com', 'tucson.com', 'tulsaworld.com'];
var usa_mcc_domains = ['bnd.com', 'charlotteobserver.com', 'fresnobee.com', 'kansas.com', 'kansascity.com', 'kentucky.com', 'miamiherald.com', 'newsobserver.com', 'sacbee.com', 'star-telegram.com', 'thestate.com', 'tri-cityherald.com'];
var usa_mng_domains =   ['denverpost.com', 'eastbaytimes.com', 'mercurynews.com', 'ocregister.com', 'pe.com', 'twincities.com'];
var usa_outside_mag_domains = ["backpacker.com", "betamtb.com", "cleaneatingmag.com", "climbing.com", "cyclingtips.com", "outsideonline.com", "oxygenmag.com", "skimag.com", "trailrunnermag.com", "triathlete.com", "vegetariantimes.com", "velonews.com", "womensrunning.com", "yogajournal.com"];
var usa_tribune_domains = ['baltimoresun.com', 'chicagotribune.com', 'courant.com', 'dailypress.com', 'mcall.com', 'nydailynews.com', 'orlandosentinel.com', 'pilotonline.com', 'sun-sentinel.com'];

// clean local storage of sites (with an exemption for hold-list)
var arr_localstorage_hold = ['abc.es', 'allgaeuer-zeitung.de', 'augsburger-allgemeine.de', 'barrons.com', 'businessoffashion.com', 'challenges.fr', 'charliehebdo.fr', 'cmjornal.pt', 'corriere.it', 'eldiario.es', 'elespanol.com', 'elle.fr', 'elpais.com', 'elperiodico.com', 'estadao.com.br', 'forbes.com', 'fortune.com', 'freiepresse.de', 'ilfoglio.it', 'inc42.com', 'kurier.at', 'lanouvellerepublique.fr', 'lesechos.fr', 'mid-day.com', 'muensterschezeitung.de', 'nknews.org', 'nytimes.com', 'nzherald.co.nz', 'scmp.com', 'seekingalpha.com', 'telegraph.co.uk', 'thehindu.com', 'thetimes.co.uk', 'westfalen-blatt.de', 'wn.de', 'wsj.com'].concat(de_funke_media_domains, es_epiberica_domains, es_grupo_vocento_domains, es_unidad_domains, fr_groupe_ebra_domains, fr_groupe_la_depeche_domains, fr_groupe_nice_matin_domains, it_quotidiano_domains, no_nhst_media_domains, usa_hearst_comm_domains);
if (!matchDomain(arr_localstorage_hold)) {
  window.localStorage.clear();
}

function getArticleJsonScript() {
  let scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let json_script;
  for (let script of scripts) {
    if (script.innerText.includes('articleBody')) {
      json_script = script;
      break;
    }
  }
  return json_script;
}

var bg2csData;

// custom/updated sites: load text from json
if ((bg2csData !== undefined) && bg2csData.ld_json && dompurify_loaded) {
  if (bg2csData.ld_json.includes('|')) {
    let ld_json_split = bg2csData.ld_json.split('|');
    let paywall_sel = ld_json_split[0];
    let article_sel = ld_json_split[1];
    let paywall = document.querySelector(paywall_sel);
    if (paywall) {
      removeDOMElement(paywall);
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json_text = JSON.parse(json_script.text).articleBody;
        let content = document.querySelector(article_sel);
        if (json_text && content) {
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(json_text) + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          content.parentNode.replaceChild(content_new, content);
        }
      }
    }
  }
}

var div_bpc_done = document.querySelector('div#bpc_done');
if (!div_bpc_done) {

// check for opt-in confirmation (from background.js)
if ((bg2csData !== undefined) && bg2csData.optin_setcookie) {
  if (domain = matchDomain(['belfasttelegraph.co.uk', 'independent.ie'])) {
    if (!cookieExists('subscriber'))
      setCookie('subscriber', '{"subscriptionStatus": true}', domain, '/', 14);
  }
}

function amp_iframes_replace(weblink = false, source = '') {
  let amp_iframes = document.querySelectorAll('amp-iframe' + (source ? '[src*="'+ source + '"]' : ''));
  let elem;
  for (let amp_iframe of amp_iframes) {
    if (!weblink) {
      elem = document.createElement('iframe');
      Object.assign(elem, {
        src: amp_iframe.getAttribute('src'),
        sandbox: amp_iframe.getAttribute('sandbox'),
        height: amp_iframe.getAttribute('height'),
        width: 'auto',
        style: 'border: 0px;'
      });
      amp_iframe.parentElement.insertBefore(elem, amp_iframe);
      removeDOMElement(amp_iframe);
    } else {
      let video_link = document.querySelector('a#bpc_video_link');
      if (!video_link) {
        amp_iframe.removeAttribute('class');
        elem = document.createElement('a');
        elem.id = 'bpc_video_link';
        elem.innerText = 'Video-link';
        elem.setAttribute('href', amp_iframe.getAttribute('src'));
        elem.setAttribute('target', '_blank');
        amp_iframe.parentElement.insertBefore(elem, amp_iframe);
      }
    }
  }
}

function amp_unhide_subscr_section(amp_ads_sel = 'amp-ad, .ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let preview = document.querySelector('[subscriptions-section="content-not-granted"]');
  removeDOMElement(preview);
  let subscr_section = document.querySelectorAll('[subscriptions-section="content"]');
  for (let elem of subscr_section)
    elem.removeAttribute('subscriptions-section');
  let amp_ads = document.querySelectorAll(amp_ads_sel);
  removeDOMElement(...amp_ads);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function amp_unhide_access_hide(amp_access = '', amp_access_not = '', amp_ads_sel = 'amp-ad, .ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let access_hide = document.querySelectorAll('[amp-access' + amp_access + '][amp-access-hide]:not([amp-access="error"], [amp-access^="message"])');
  for (let elem of access_hide)
    elem.removeAttribute('amp-access-hide');
  if (amp_access_not) {
    let amp_access_not_dom = document.querySelectorAll('[amp-access' + amp_access_not + ']');
    removeDOMElement(...amp_access_not_dom);
  }
  let amp_ads = document.querySelectorAll(amp_ads_sel);
  removeDOMElement(...amp_ads);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

// custom/updated sites: try to unhide text on amp-page
if ((bg2csData !== undefined) && bg2csData.amp_unhide) {
  window.setTimeout(function () {
    let amp_page_hide = document.querySelector('script[src*="/amp-access-"], script[src*="/amp-subscriptions-"]');
    if (amp_page_hide) {
      amp_unhide_subscr_section();
      amp_unhide_access_hide();
      amp_iframes_replace();
    }
  }, 100);
}

// custom/updated sites: amp-redirect
if ((bg2csData !== undefined) && bg2csData.amp_redirect) {
  window.setTimeout(function () {
    let amp_script = document.querySelector('script[src^="https://cdn.ampproject.org/"]');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    let amp_page = amp_script && !amphtml;
    if (!amp_page) {
      let paywall = true;
      if (bg2csData.amp_redirect.paywall)
        paywall = document.querySelector(bg2csData.amp_redirect.paywall);
      if (paywall && amphtml) {
        removeDOMElement(paywall);
        window.location.href = amphtml.href;
      }
    }
  }, 500);
}

function cs_code_elems(elems) {
  for (let elem of elems) {
    let elem_dom = document.querySelectorAll(elem.cond);
    for (let item of elem_dom) {
      if (elem.rm_elem)
        removeDOMElement(item);
      if (elem.rm_class) {
        let rm_class = elem.rm_class.split(',').map(x => x.trim());
        item.classList.remove(...rm_class);
      }
      if (elem.rm_attrib)
        item.removeAttribute(elem.rm_attrib);
      if (elem.elems)
        cs_code_elems(elem.elems);
    }
  }
}

// updated sites: cs_code
if ((bg2csData !== undefined) && bg2csData.cs_code) {
  window.setTimeout(function () {
    cs_code_elems(bg2csData.cs_code);
  }, 1000);
}

// Content workarounds/domain

if (matchDomain(['medium.com', 'towardsdatascience.com']) || document.querySelector('script[src^="https://cdn-client.medium.com/"]')) {
  let paywall = document.querySelector('div#paywall-background-color');
  removeDOMElement(paywall);
  if (paywall) {
    ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
    csDoneOnce = true;
  }
  window.setTimeout(function () {
    let meter = document.querySelector('[id*="highlight-meter-"]');
    if (meter)
      meter.hidden = true;
  }, 500);
}

else if (window.location.hostname.match(/\.(com|net)\.au$/)) {//australia

if (matchDomain('thesaturdaypaper.com.au')) {
  let paywall = document.querySelector('div.paywall-hard-always-show');
  removeDOMElement(paywall);
}

else if (domain = matchDomain(["brisbanetimes.com.au", "smh.com.au", "theage.com.au", "watoday.com.au"])) {
  let url = window.location.href;
  let for_subscribers = document.querySelector('meta[content^="FOR SUBSCRIBERS"], #paywall_prompt');
  if (for_subscribers) {
    window.setTimeout(function () {
      window.location.href = url.replace('www.', 'amp.');
    }, 500);
  } else if (url.includes('amp.' + domain)) {
    amp_unhide_subscr_section();
  }
}

else {
  // Australian Community Media newspapers
  let au_comm_media_domains = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
  let au_comm_media_link = document.querySelector('a[href^="https://australiancommunitymedia.zendesk.com"]');
  if (matchDomain(au_comm_media_domains) || au_comm_media_link) {
    let mask = document.querySelector('div[style^="-webkit-mask-image"]');
    if (mask) {
      mask.removeAttribute('style');
      let json_script = document.querySelector('script#__NEXT_DATA__');
      if (json_script && dompurify_loaded) {
        let json = JSON.parse(json_script.innerText);
        if (json && json.props.pageProps.context.story.elements) {
          let pars = json.props.pageProps.context.story.elements;
          let intro = document.querySelector('p[class^="Paragraph_wrapper__"]');
          if (intro && intro.parentNode) {
            let article = document.querySelector('div#story-body > div.mx-auto');
            if (!article)
              article = intro.parentNode;
            removeDOMElement(intro);
            let article_new = '';
            for (let par of pars) {
              if (['paragraph', 'topic', 'heading', 'subhead'].includes(par.type) && par.text) {
                article_new += '<p>' + par.text.replace(/<br>$/, '') + '<br><br></p>';
              } else if (par.type === 'generic' && par.embed) {
                article_new += '<p>' + par.embed + '<br><br></p>';
              } else if (['list', 'listbox'].includes(par.type) && par.items) {
                if (par.type === 'listbox' && par.headline)
                  article_new += par.headline + '<br>';
                article_new += '<ul>';
                for (let item of par.items)
                  article_new += '<li>' + item + '</li>';
                article_new += '</ul>';
                if (par.type === 'listbox' && par.description)
                  article_new += par.description + '<br><br>';
              } else if (!['image', 'gallery', 'quote'].includes(par.type)) {
                console.log(par);
              }
            }
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(article_new, {ADD_TAGS: ['iframe']}) + '</div>', 'text/html');
            let content_new = doc.querySelector('div');
            article.appendChild(content_new);
          }
        }
      }
    } else {
      let subscribe_truncate = document.querySelector('.subscribe-truncate');
      if (subscribe_truncate)
        subscribe_truncate.classList.remove('subscribe-truncate');
      let subscriber_hiders = document.querySelectorAll('.subscriber-hider');
      for (let subscriber_hider of subscriber_hiders)
        subscriber_hider.classList.remove('subscriber-hider');
    }
    let blocker = document.querySelector('div.blocker');
    let noscroll = document.querySelector('body[style]');
    if (noscroll)
      noscroll.removeAttribute('style');
    let story_generic_iframe = document.querySelector('.story-generic__iframe');
    let ads = document.querySelectorAll('.ad-placeholder, .sticky, #billboard-container');
    removeDOMElement(story_generic_iframe, blocker, ...ads);
  } else if (window.location.hostname.endsWith('.com.au')) {
    // Australia News Corp
    let au_news_corp_domains = ['adelaidenow.com.au', 'cairnspost.com.au', 'codesports.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'thechronicle.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
    if (domain = matchDomain(au_news_corp_domains)) {
      let header_ads = document.querySelector('.header_ads-container');
      removeDOMElement(header_ads);
      let amp_ads_sel = 'amp-ad, amp-embed, [id^="ad-mrec-"], .story-ad-container';
      let comments;
      if (window.location.hostname.startsWith('amp.')) {
        amp_unhide_subscr_section(amp_ads_sel, true, true, 'resourcesssl.newscdn.com.au');
        comments = document.querySelector('#story-comments, .comments-wrapper');
      } else if (window.location.href.includes('?amp')) {
        amp_unhide_subscr_section(amp_ads_sel, true, true, 'resourcesssl.newscdn.com.au');
        comments = document.querySelector('#comments-load');
        let amp_iframe_sizers = document.querySelectorAll('amp-iframe > i-amphtml-sizer');
        removeDOMElement(...amp_iframe_sizers)
      }
      removeDOMElement(comments);
    } else {
      // Australian Seven West Media
      let swm_image = document.querySelector('img[src^="https://images.thewest.com.au"]');
      if (matchDomain('thewest.com.au') || swm_image) {
        window.setTimeout(function () {
          let breach_screen = document.querySelector('div[data-testid*="BreachScreen"]');
          if (breach_screen) {
            let scripts = document.querySelectorAll('script:not([src], [type])');
            let json_script;
            for (let script of scripts) {
              if (script.innerText.includes('window.PAGE_DATA =')) {
                json_script = script;
                break;
              }
            }
            if (json_script) {
              let json_text = json_script.innerHTML.split('window.PAGE_DATA =')[1].split('</script')[0];
              json_text = json_text.replace(/undefined/g, '"undefined"');
              let json_article = JSON.parse(json_text);
              let json_pub;
              for (let key in json_article)
                if (json_article[key].data.result.resolution && json_article[key].data.result.resolution.publication) {
                  json_pub = json_article[key].data.result.resolution.publication;
                  break;
                }
              let json_content = [];
              let url_loaded;
              if (json_pub) {
                json_content = json_pub.content.blocks;
                url_loaded = json_pub._self;
              } else
                window.location.reload(true);
              //let json_video = json_pub.mainVideo;
              let url = window.location.href;
              if (!url_loaded || !url.includes(url_loaded.slice(-10)))
                window.location.reload(true);
              let par_elem, par_sub1, par_sub2;
              let par_dom = document.createElement('div');
              let tweet_id = 1;
              for (let par of json_content) {
                par_elem = '';
                if (par.kind === 'text') {
                  par_elem = document.createElement('p');
                  par_elem.innerText = par.text;
                } else if (par.kind === 'subhead') {
                  par_elem = document.createElement('h2');
                  par_elem.innerText = par.text;
                } else if (par.kind === 'pull-quote') {
                  par_elem = document.createElement('i');
                  par_elem.innerText = (par.attribution ? par.attribution + ': ' : '') + par.text;
                } else if (par.kind === 'embed') {
                  if (par.reference.includes('https://omny.fm/') || par.reference.includes('https://docdro.id/')) {
                    par_elem = document.createElement('embed');
                    par_elem.src = par.reference;
                    par_elem.style = 'height:500px; width:100%';
                    par_elem.frameborder = '0';
                  } else {
                    par_elem = document.createElement('a');
                    par_elem.href = par.reference;
                    par_elem.innerText = par.reference.split('?')[0];
                    console.log('embed: ' + par.reference);
                  }
                } else if (par.kind === 'unordered-list') {
                  if (par.items) {
                    par_elem = document.createElement('ul');
                    for (let item of par.items)
                      if (item.text) {
                        par_sub1 = document.createElement('li');
                        if (item.intentions[0] && item.intentions[0].href) {
                          par_sub2 = document.createElement('a');
                          par_sub2.href = item.intentions[0].href;
                        } else {
                          par_sub2 = document.createElement('span');
                        }
                        par_sub2.innerText = item.text;
                        par_sub1.appendChild(par_sub2);
                        par_elem.appendChild(par_sub1);
                      }
                  }
                } else if (par.kind === 'inline') {
                  if (par.asset.kind === 'image') {
                    par_elem = document.createElement('figure');
                    par_sub1 = document.createElement('img');
                    par_sub1.src = par.asset.original.reference;
                    par_sub1.style = 'width:100%';
                    par_elem.appendChild(par_sub1);
                    if (par.asset.captionText) {
                      par_sub2 = document.createElement('figcaption');
                      par_sub2.innerText = par.asset.captionText + ' ' + par.asset.copyrightByline +
                        ((par.asset.copyrightCredit && par.asset.captionText !== par.asset.copyrightByline) ? '/' + par.asset.copyrightCredit : '');
                      par_elem.appendChild(par_sub2);
                    }
                  }
                } else {
                  par_elem = document.createElement('p');
                  par_elem.innerText = par.text;
                  console.log(par.kind);
                }
                if (par_elem)
                  par_dom.appendChild(par_elem);
              }
              let content = document.querySelector('div[class*="StyledArticleContent"]');
              if (content) {
                content.appendChild(par_dom);
              } else {
                par_dom.setAttribute('style', 'margin: 20px;');
                breach_screen.parentElement.insertBefore(par_dom, breach_screen);
              }
            }
            removeDOMElement(breach_screen);
          }
        }, 1500);
        let header_advert = document.querySelector('.headerAdvertisement');
        if (header_advert)
          header_advert.setAttribute('style', 'display: none;');
      }
    }
  }
  else
    csDone = true;
}

} else if (window.location.hostname.match(/\.(de|at|ch)$/) || matchDomain(['faz.net', 'handelsblatt.com'])) {//germany/austria/switzerland - ch

if (matchDomain('allgaeuer-zeitung.de')) {
  let url = window.location.href;
  if (!url.includes('?type=amp')) {
    let paywall = document.querySelector('p.nfy-text-blur');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.split('?')[0] + '?type=amp';
    }
  } else {
    let preview = document.querySelectorAll('p.nfy-text-blur, div[subscriptions-display^="NOT data."]');
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(...preview, ...amp_ads);
  }
}

else if (matchDomain('augsburger-allgemeine.de')) {
  let url = window.location.href;
  if (!url.includes('-amp.html')) {
    let paywall = document.querySelector('div.aa-visible-logged-out');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.replace('.html', '-amp.html');
    }
  } else {
    amp_unhide_subscr_section();
  }
}

else if (matchDomain('berliner-zeitung.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('.paywall-dialog-box');
  if (url.split('?')[0].includes('.amp')) {
    if (paywall) {
      removeDOMElement(paywall);
      amp_unhide_subscr_section();
    }
  } else {
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.split('?')[0] + '.amp';
    }
  }
}

else if (matchDomain('cicero.de')) {
  let url = window.location.href;
  if (!url.includes('?amp')) {
    let paywall = document.querySelector('.plenigo-paywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url_amp = url.split('?')[0] + '?amp';
      replaceDomElementExt(url_amp, false, false, '.field-name-field-cc-body');
    }
  } else {
    let teasered_content = document.querySelector('.teasered-content');
    if (teasered_content)
      teasered_content.classList.remove('teasered-content');
    let teasered_content_fader = document.querySelector('.teasered-content-fader');
    let btn_read_more = document.querySelector('.btn--read-more');
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(teasered_content_fader, btn_read_more, ...amp_ads);
  }
  let urban_ad_sign = document.querySelectorAll('.urban-ad-sign');
  removeDOMElement(...urban_ad_sign);
}

else if (matchDomain(de_funke_media_domains) || document.querySelector('a[href="https://www.funkemedien.de/"]')) {
  if (window.location.search.startsWith('?service=amp'))
    amp_unhide_access_hide('="NOT p.showRegWall AND NOT p.showPayWall"', '', 'amp-ad, amp-embed, amp-fx-flying-carpet');
  else
    sessionStorage.setItem('deobfuscate', 'true');
}

else if (matchDomain('deutsche-wirtschafts-nachrichten.de')) {
  window.setTimeout(function () {
    let hardpay = document.querySelector('.hardpay');
    if (hardpay) {
      window.location.reload(true);
    }
  }, 500);
}

else if (matchDomain('faz.net')) {
  if (matchDomain('zeitung.faz.net')) {
    let paywall_z = document.querySelector('.c-red-carpet');
    if (paywall_z) {
      let og_url = document.querySelector('meta[property="og:url"]');
      if (og_url)
        window.setTimeout(function () {
          window.location.href = og_url.content;
        }, 500);
    }
    let sticky_advt = document.querySelector('.sticky-advt');
    removeDOMElement(sticky_advt);
  } else {
    let paywall = document.querySelector('#paywall-form-container-outer, .atc-ContainerPaywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url = new URL(window.location.href);
      let mUrl = new URL(url.pathname, 'https://m.faz.net/');
      try {
        fetch(mUrl)
        .then(response => {
          if (response.ok) {
            response.text().then(html => {
              let parser = new DOMParser();
              let doc = parser.parseFromString(html, 'text/html');
              let json = doc.querySelector('script[id="schemaOrgJson"]');
              if (json) {
                let json_text = json.text.replace(/(\r|\n)/g, '');
                let split1 = json_text.split('"ArticleBody": "');
                let split2 = split1[1].split('","author":');
                if (split2[0].includes('"'))
                  json_text = split1[0] + '"ArticleBody": "' + split2[0].replace(/"/g, '“') + '","author":' + split2[1];
                try {
                  json_text = JSON.parse(json_text).ArticleBody;
                } catch (err) {
                  console.log(err);
                  return;
                }
                if (!json_text)
                  return;
                let article_text = document.querySelector('.art_txt.paywall,.atc-Text.js-atc-Text');
                article_text.innerText = '';
                json_text = breakText(json_text);
                json_text.split("\n\n").forEach(
                  (p_text) => {
                  let elem;
                  if (p_text.length < 80) {
                    elem = document.createElement("h2");
                    elem.setAttribute('class', 'atc-SubHeadline');
                  } else {
                    elem = document.createElement("p");
                    elem.setAttribute('class', 'atc-TextParagraph');
                  };
                  elem.innerText = p_text;
                  article_text.appendChild(elem);
                });
              }
            })
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
    let lay_paysocial = document.querySelector('div.lay-PaySocial');
    removeDOMElement(lay_paysocial);
  }
}

else if (matchDomain('freiepresse.de')) {
  let url = window.location.href;
  let article_teaser = document.querySelector('div.article-teaser');
  if (article_teaser && url.match(/(\-artikel)(\d){6,}/)) {
    window.setTimeout(function () {
      window.location.href = url.replace('-artikel', '-amp');
    }, 500);
  } else if (url.match(/(\-amp)(\d){6,}/)) {
    let amp_ads = document.querySelectorAll('amp-fx-flying-carpet, amp-ad, amp-embed');
    let pw_layer = document.querySelector('.pw-layer');
    removeDOMElement(...amp_ads, pw_layer);
  }
}

else if (matchDomain('handelsblatt.com')) {
  let url = window.location.href;
  if (url.match(/\/amp(\d)?\./)) {
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(...amp_ads);
  } else {
    let paywall = document.querySelector('div.temp-paywall1');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      let premium = document.querySelector('meta[content*="PREMIUM"]');
      if (!premium)
        window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('krautreporter.de')) {
  let paywall = document.querySelector('.article-paywall');
  if (paywall) {
    removeDOMElement(paywall);
    window.setTimeout(function () {
      let paywall_divider = document.querySelector('.js-paywall-divider');
      let steady_checkout = document.querySelector('#steady-checkout');
      removeDOMElement(paywall_divider, steady_checkout);
      let blurred = document.querySelectorAll('.blurred');
      for (let elem of blurred)
        elem.classList.remove('blurred', 'json-ld-paywall-marker', 'hidden@print');
    }, 500);
  }
}

else if (matchDomain(['ksta.de', 'rundschau-online.de'])) {
  let paywall = document.querySelector('.pay.wall');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json_text = JSON.parse(json_script.text).articleBody;
      json_text = parseHtmlEntities(json_text);
      json_text = breakText(json_text);
      let region = 'ortsmarke';
      if (window.location.hostname === 'mobil.ksta.de')
        region = 'district';
      let article_sel = 'div.article-text > p.selectionShareable:not(.' + region + '), div.dm_article_text > p.selectionShareable:not(.' + region + ')';
      let article = document.querySelector(article_sel);
      if (article && json_text) {
        article.innerText = json_text;
      }
    }
  }
}

else if (matchDomain('kurier.at')) {
  let view_offer = document.querySelector('.view-offer');
  removeDOMElement(view_offer);
  let plus_content = document.querySelector('.plusContent');
  if (plus_content)
    plus_content.classList.remove('plusContent');
}

else if (matchDomain(['mz.de', 'volksstimme.de'])) {
  let url = window.location.href.split('?')[0];
  let paywall = document.querySelector('.fp-paywall');
  if (url.includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = window.location.href.replace('.de/', '.de/amp/');
    }
  }
}

else if (matchDomain(['noz.de', 'nwzonline.de', 'shz.de', 'svz.de'])) {
  if (window.location.pathname.match(/(-amp\.html|\/amp)$/)) {
    amp_unhide_access_hide('="NOT data.reduced"', '="data.reduced"', 'amp-ad, amp-embed, #flying-carpet-wrapper');
  } else {
    let paywall = document.querySelector('.paywall, .story--premium__container');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('nzz.ch')) {
  let regwall = document.querySelector('.dynamic-regwall');
  removeDOMElement(regwall);
}

else if (matchDomain('rheinpfalz.de')) {
  let url = window.location.href;
  if (url.includes('reduced=true')) {
    window.setTimeout(function () {
      window.location.href = url.split('?')[0];
    }, 500);
  }
}

else if (matchDomain(['westfalen-blatt.de', 'wn.de', 'muensterschezeitung.de'])) {
  let url = window.location.href;
  if (url.includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed, section[class^="fp-ad"]');
  } else {
    let paywall = document.querySelector('.fp-article-paywall-dialog, .fp-article-paywall');
    if (paywall) {
      removeDOMElement(paywall);
      let gallery_no_amp = false;
      if (matchDomain('westfalen-blatt.de')) {
        let article_body = document.querySelector('.fp-article__body');
        gallery_no_amp = url.includes('/fotos/') || (!article_body && document.querySelector('.fp-gallery-carousel'));
      }
      if (!gallery_no_amp)
        window.location.href = url.replace('.de/', '.de/amp/');
    }
  }
}

else if (matchDomain(de_madsack_domains) || matchDomain(de_madsack_custom_domains)) {
  if (!(window.location.pathname.startsWith('/amp/') || window.location.search.startsWith('?outputType=valid_amp'))) {
    let paidcontent_intro = document.querySelector('div.pdb-article-body-paidcontentintro');
    if (paidcontent_intro) {
      paidcontent_intro.classList.remove('pdb-article-body-paidcontentintro');
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json_text = JSON.parse(json_script.text).articleBody;
        if (json_text) {
          let pdb_richtext_field = document.querySelectorAll('div.pdb-richtext-field');
          if (pdb_richtext_field[1])
            pdb_richtext_field[1].innerText = json_text;
        }
      }
      let paidcontent_reg = document.querySelector('div.pdb-article-paidcontent-registration');
      removeDOMElement(paidcontent_reg);
    } else {
      let paywall = document.querySelector('div.paywall');
      if (paywall) {
        let gradient = document.querySelector('div[class^="ArticleContentLoaderstyled__Gradient"]');
        let loading = document.querySelector('#article > svg');
        removeDOMElement(paywall, gradient, loading);
        let article = document.querySelector('div[class*="ArticleTeaserContainer"] > div:not([class])');
        let json_script = getArticleJsonScript();
        if (json_script) {
          let json = JSON.parse(json_script.text);
          if (article && json) {
            let json_text = json.articleBody;
            let article_new = document.createElement('span');
            let par = article.querySelector('p');
            let par_class = par ? par.getAttribute('class') : '';
            article_new.setAttribute('class', par_class);
            article_new.innerText = json_text;
            article.innerText = '';
            if (json.articleSection) {
              let json_section = json.articleSection;
              let article_section = document.querySelector('span');
              article_section.setAttribute('class', par_class);
              article_section.setAttribute('style', 'font-weight: bold;');
              article_section.innerText = json_section + '. ';
              article.appendChild(article_section);
            }
            article.appendChild(article_new);
          }
        }
      }
    }
  } else if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_subscr_section('.pdb-ad-container, amp-embed');
  }
}

else
  csDone = true;

} else if (window.location.hostname.match(/\.(dk|fi|no|se)$/)) {//denmark/finland/norway/sweden

if (matchDomain(fi_alma_talent_domains)) {
  let ads = document.querySelectorAll('div[class^="p2m385-"], div#anop-container, .ad');
  for (let ad of ads)
    ad.setAttribute('style', 'display:none;');
  if (matchDomain('iltalehti.fi')) {
    let paywall = document.querySelector('div.faded-text');
    if (paywall && dompurify_loaded) {
      let scripts = document.querySelectorAll('script');
      let json_script;
      for (let script of scripts) {
        if (script.innerText.includes('window.App=')) {
          json_script = script;
          break;
        }
      }
      if (json_script) {
        let json = json_script.innerHTML.split('window.App=')[1].split('</script')[0];
        json = json.replace(/undefined/g, '"undefined"');
        let json_article = JSON.parse(json).state.articles;
        if (!Object.keys(json_article).length)
          ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
        if (Object.keys(json_article).length) {
          paywall.remove();
          let url_loaded = Object.keys(json_article)[0];
          if (url_loaded && !window.location.pathname.includes(url_loaded))
            ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
          let pars = Object.values(json_article)[0].items.body;
          let content = document.querySelector('div.article-body');
          if (content && pars) {
            function ilta_par_text(items) {
              let par_text = '';
              for (let item of items) {
                if (item.text)
                  par_text += item.text;
                else if (item.name)
                  par_text += '<a href="/henkilot/' + item.name + '">' + item.name + '</a>';
                else if (item.type === 'link')
                  par_text += '<a href="' + item.url + '" target="_blank">' + item.items[0].text + '</a>';
                else if (item.type) {
                  let item_type = '<' + item.type[0] + '>';
                  par_text += item.items.map(i => item_type + i.text + item_type.replace('<', '</')).join('');
                } else if (item[0]) { //aside-list
                  par_text += item[0].text;
                }
              }
              return par_text;
            }
            function ilta_wrap_list(elem, par_text) {
              if (par_text) {
                elem += '<div class="article-bullets"><ul>';
                elem += par_text;
                elem += '</ul></div>';
              }
              return elem;
            }
            content.innerHTML = '';
            let article_new = '';
            for (let par of pars) {
              let elem = '';
              let par_text = '';
              let par_ignore = false;
              if (par.type === 'paragraph') {
                par_text = ilta_par_text(par.items);
                if (par_text)
                  elem = '<p class="paragraph">' + par_text + '</p>';
              } else if (par.type === 'subheadline') {
                if (par.text)
                  elem = '<h3 class="subheadline" style="margin:20px;">' + par.text + '</h3>';
              } else if (par.type === 'aside') {
                elem = '<div class="aside-container"><div class="aside">';
                for (let item of par.items) {
                  if (item.text || (item.type === 'paragraph' && item.items)) {
                    if (par_text) {
                      elem = ilta_wrap_list(elem, par_text);
                      par_text = '';
                    }
                    if (item.text)
                      elem += '<h3 class="subheadline" style="margin:20px;">' + item.text + '</h3>';
                    else {
                      let par_text_sub = ilta_par_text(item.items);
                      if (par_text_sub)
                        elem += '<p class="paragraph">' + par_text_sub + '</p>';
                    }
                  } else if (item.type === 'list') {
                    let par_text_sub = ilta_par_text(item.items);
                    if (par_text_sub) {
                      par_text += '<li>';
                      par_text += par_text_sub;
                      par_text += '</li>';
                    }
                  }
                }
                if (par_text)
                  elem = ilta_wrap_list(elem, par_text);
                elem += '</div></div>';
              } else if (par.type === 'blockquote') {
                elem = '<p style="font-size: 1.2em; margin:20px;"><i>&quot;' + par.items.map(i => i.text).join('') + '&quot;</i></p>';
              } else if (par.type === 'divider') {
                elem = '<div class="article-divider"><div class="article-divider-content"></div></div>';
              } else if (par.type.toLowerCase() === 'list') {
                elem = '<div class="article-bullets"><ul>';
                for (let item of par.items)
                  elem += '<li>' + item.map(i => i.text).join('') + '</li>';
                elem += '</ul></div>';
              } else if (par.type === 'related-article') {
                elem = '<div class="related-articles related-articles-within-text"><h3>Lue myös</h3><a href="/' + par.article.category.category_name + '/a/' + par.article.article_id + '">' + par.article.title + '</a></div>';
              } else if (par.type === 'image') {
                if (par.urls.default) {
                  let caption = par.properties.caption ? par.properties.caption : '';
                  let source = par.properties.source ? par.properties.source : '';
                  elem = '<p><div><div style="text-align: center;"><img src="' + par.urls.default + '" alt="' + caption + '"></div><div class="media-caption"><span class="caption-text">' + caption + '</span><span class="media-source">' + source + '</span></div></div></p>';
                }
              } else if (par.type === 'embed') {
                elem = par.embed_html;
              } else if (par.type === 'advertisement') {
                par_ignore = true;
              }
              if (elem)
                article_new += elem;
              else if (!par_ignore)
                console.log(par);
            }
            let parser = new DOMParser();
            let par_html = parser.parseFromString('<div>' + DOMPurify.sanitize(article_new, {ADD_TAGS: ['iframe']}) + '</div>', 'text/html');
            content.appendChild(par_html.querySelector('div'));
          }
        }
      }
    }
  }
}

else if (matchDomain('hs.fi')) {
  let url = window.location.href;
  if (!url.includes('https://dynamic.hs.fi')) {
    let iframe = document.querySelector('iframe[src^="https://dynamic.hs.fi/a/"]');
    if (iframe && url.includes('.html')) {
      window.setTimeout(function () {
        window.location.href = iframe.src;
      }, 500);
    }
  } else {
    let paywall = document.querySelector('.paywall-container, .paywall-wrapper');
    if (paywall && dompurify_loaded) {
      let scripts = document.querySelectorAll('script');
      let json_script;
      for (let script of scripts) {
        if (script.innerText.includes('window.__NUXT__=')) {
          json_script = script;
          break;
        }
      }
      let json_text;
      if (json_script.innerHTML.includes('paywallComponents:['))
        json_text = json_script.innerHTML.replace(/\r\n/g, '').split('amlData:[')[1].split('metaData')[0].split('paywallComponents:[')[1].slice(0, -4);
      let main = document.querySelector('main');
      if (main && json_text) {
        let pars = json_text.split('{type:');
        let type, value, slides, src, elem, img, caption, caption_text, par_html, par_text;
        let parser = new DOMParser();
        for (let par of pars) {
          elem = '';
          type = par.split(',')[0];
          if (['a', 'i'].includes(type)) { // text
            value = par.split('value:')[1].split('}')[0].replace(/(^"|"$)/g, '');
            if (!value.includes('<p>'))
              value = '<p>' + value + '</p>';
            par_html = parser.parseFromString(DOMPurify.sanitize(value), 'text/html');
            elem = par_html.querySelector('p');
          } else if (['D', 'f', 'j', 'k'].includes(type)) { // quote
            if (par.includes('text:') && par.includes(',position:')) {
              value = par.split('text:')[1].split(',position:')[0].replace(/(^"|"$)/g, '');
              elem = document.createElement('p');
              elem.innerText = value;
              elem.setAttribute('style', 'font-style: italic;');
            }
          } else if (['m', 'u'].includes(type)) { // authors
            value = par.split('text:')[1].split(',role')[0].replace(/(^"|"$)/g, '');
            if (value.length > 1) {
              elem = document.createElement('p');
              elem.innerText = value;
            }
          } else if (['e', 'h', 'y'].includes(type)) { // image
            if (!par.includes('src:'))
              continue;
            src = par.split('src:"')[1].split('",')[0];
            if (!src.startsWith('http'))
              src = 'https://arkku.mediadelivery.fi/img/468/' + src;
            elem = document.createElement('p');
            img = document.createElement('img');
            img.setAttribute('src', src);
            img.setAttribute('style', 'width:468px !important');
            elem.appendChild(img);
            if (par.includes('caption:')) {
              caption = document.createElement('figcaption');
              caption_text = par.split('caption:')[1].split('",')[0];
              if (caption_text.length)
                caption_text = caption_text.slice(1, caption_text.length - 1);
              caption.innerText = caption_text;
              elem.appendChild(caption);
            }
          } else if (['p', 'r'].includes(type)) { // slides
            slides = par.split('src:');
            elem = document.createElement('p');
            for (let slide of slides) {
              if (slide.includes('.jpg')) {
                src = slide.split(',')[0].replace(/"/g, '');
                if (!src.startsWith('http'))
                  src = 'https://arkku.mediadelivery.fi/img/468/' + src;
                img = document.createElement('img');
                img.setAttribute('src', src);
                img.setAttribute('style', 'width:468px !important');
                elem.appendChild(img);
                caption = document.createElement('figcaption');
                caption_text = slide.includes('text:') ? slide.split('text:')[1].split(',"text-style"')[0] : slide.split('caption:')[1].split('",')[0];
                if (caption_text.length)
                  caption_text = caption_text.slice(1, caption_text.length - 1);
                par_html = parser.parseFromString('<div>' + DOMPurify.sanitize(caption_text) + '</div>', 'text/html');
                elem.appendChild(par_html.querySelector('div'));
              }
            }
          } else
            false;//console.log('type: ' + type + ' par: ' + par);
          if (elem) {
            elem.setAttribute('class', 'article-body px-16 mb-24');
            main.appendChild(elem);
          }
        }
        main.appendChild(document.createElement('br'));
      }
      removeDOMElement(paywall);
    }
  }
}

else if (matchDomain('nyteknik.se')) {
  // plus code in contentScript_once.js
  let locked_article = document.querySelector('div.locked-article');
  if (locked_article)
    locked_article.classList.remove('locked-article');
}

else
  csDone = true;

} else if (window.location.hostname.match(/\.(es|pt)$/) || matchDomain(['diariocordoba.com', 'diariovasco.com', 'elconfidencial.com', 'elcorreo.com', 'elespanol.com', 'elpais.com', 'elperiodico.com', 'elperiodicodearagon.com', 'elperiodicoextremadura.com', 'elperiodicomediterraneo.com', 'expansion.com', 'larioja.com', 'levante-emv.com', 'marca.com', 'politicaexterior.com'])) {//spain/portugal

if (matchDomain('abc.es')) {
  if (window.location.pathname.endsWith('_amp.html')) {
    amp_unhide_access_hide('="result=\'ALLOW_ACCESS\'"', '', 'amp-ad, amp-embed');
    premium_banner = document.querySelector('.cierre-suscripcion');
    removeDOMElement(premium_banner);
  }
}

else if (matchDomain('cmjornal.pt')) {
  let paywall = document.querySelector('.bloqueio_exclusivos');
  let amphtml = document.querySelector('link[rel="amphtml"]');
  let url = window.location.href;
  if (!url.includes('/amp/')) {
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  } else {
    amp_unhide_access_hide('="subscriber"', '="NOT subscriber"', 'amp-ad, amp-embed, #flying-carpet-wrapper');
    let amp_links = document.querySelectorAll('a[href^="https://www-cmjornal-pt.cdn.ampproject.org/c/s/"]');
    for (let amp_link of amp_links)
      amp_link.href = amp_link.href.replace('www-cmjornal-pt.cdn.ampproject.org/c/s/', '');
  }
}

else if (matchDomain('elconfidencial.com')) {
  let premium = document.querySelector('div.newsType__content--closed');
  if (premium)
    premium.classList.remove('newsType__content--closed');
}

else if (matchDomain('eldiario.es')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_access_hide('^="access"');
  } else {
    let ads = document.querySelectorAll('.edi-advertising, .header-ad');
    removeDOMElement(...ads);
  }
}

else if (matchDomain('elespanol.com')) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    let adverts = document.querySelectorAll('[id*="superior"], [class*="adv"]');
    removeDOMElement(...adverts);
  }
}

else if (matchDomain(es_unidad_domains)) {
  let premium = document.querySelector('.ue-c-article__premium');
  let url = window.location.href;
  if (!window.location.hostname.startsWith('amp.')) {
    if (premium) {
      removeDOMElement(premium);
      window.location.href = url.replace('/www.', '/amp.');
    }
  } else {
    amp_unhide_access_hide('="authorized=true"', '="authorized!=true"');
    amp_unhide_subscr_section('.advertising, amp-embed, amp-ad');
  }
}

else if (matchDomain('elpais.com')) {
  let url = window.location.href;
  let login_register = document.querySelector('.login_register');
  if (url.includes('.amp.html') || url.includes('?outputType=amp')) {
    amp_unhide_access_hide('="vip"', '="NOT vip"');
    removeDOMElement(login_register);
  } else {
    let counter = document.querySelector('#counterLayerDiv');
    removeDOMElement(counter);
    let video = document.querySelector('div.videoTop');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if ((login_register || video) && amphtml) {
      removeDOMElement(login_register, video);
      window.location.href = amphtml.href;
    }
  }
  let paywall_offer = document.querySelector('.paywallOffer');
  let ctn_closed_article = document.querySelector('#ctn_closed_article, #ctn_freemium_article');
  removeDOMElement(paywall_offer, ctn_closed_article);
}

else if (matchDomain('elperiodico.com')) {
  let url = window.location.href;
  if (!url.includes('amp.elperiodico.com')) {
    let div_hidden = document.querySelector('div.closed');
    if (div_hidden)
      div_hidden.classList.remove('closed');
    else {
      let paywall = document.querySelector('.ep-masPeriodico-info-login');
      removeDOMElement(paywall);
      if (paywall)
        window.location.href = url.replace('www.', 'amp.');
    }
  } else {
    let not_logged = document.querySelector('.ep-masPeriodico-info-login');
    if (not_logged) {
      removeDOMElement(not_logged);
      amp_unhide_access_hide('^="logged"', '^="NOT logged"');
    }
    window.setTimeout(function () {
      let amp_img = document.querySelectorAll('amp-img > img');
      for (let elem of amp_img) {
        if (elem.src)
          elem.src = elem.src.replace('amp.elperiodico.com/clip/', 'estaticos-cdn.elperiodico.com/clip/');
      }
    }, 3000);
  }
}

else if (matchDomain(es_grupo_vocento_domains)) {
  let url = window.location.href;
  let content_exclusive_bg = document.querySelector('.content-exclusive-bg, #cierre_suscripcion, ev-engagement[group-name^="paywall-"]');
  let amphtml = document.querySelector('link[rel="amphtml"]');
  if (content_exclusive_bg && amphtml) {
    removeDOMElement(content_exclusive_bg);
    window.location.href = url.split('?')[0].replace('.html', '_amp.html');
  } else if (url.includes('_amp.html')) {
    let voc_advers = document.querySelectorAll('.voc-adver, amp-embed');
    removeDOMElement(...voc_advers);
    let container_wall_exclusive = document.querySelector('.container-wall-exclusive');
    if (container_wall_exclusive) {
      removeDOMElement(container_wall_exclusive);
      amp_unhide_access_hide('="result=\'ALLOW_ACCESS\'"', '="result!=\'ALLOW_ACCESS\'"');
    }
    //lavozdigital.es
    amp_unhide_subscr_section();
  }
}

else if (matchDomain(es_epiberica_domains)) {
  if (window.location.href.includes('.amp.html')) {
    let truncated = document.querySelector('div.article-body--truncated');
    if (truncated)
      truncated.classList.remove('article-body--truncated');
    amp_unhide_access_hide('="NOT access"', '="access"');
    amp_unhide_access_hide('="FALSE"');
  } else if (window.location.hostname === 'amp.epe.es') {
    amp_unhide_access_hide('="loggedIn"', '="NOT loggedIn"', 'amp-ad, amp-embed, amp-next-page');
  } else {
    let ads = document.querySelectorAll('div.commercial-up-full__wrapper, div.sidebar--sticky__space, div[data-bbnx-id*="cxense"]');
    removeDOMElement(...ads);
  }
}

else if (matchDomain('observador.pt')) {
  let paywall = document.querySelector('.premium-article');
  if (paywall)
    paywall.classList.remove('premium-article');
  let amp_ads = document.querySelectorAll('amp-ad');
  removeDOMElement(... amp_ads)
}

else if (matchDomain('politicaexterior.com')) {
  let paywall = document.querySelector('div[class^="paywall-"]');
  if (paywall) {
    let article = document.querySelector('div.entry-content-text');
    let json = document.querySelector('script[type="application/ld+json"]:not([class]');
    if (json) {
      let json_text = JSON.parse(json.text).description.replace(/&amp;nbsp;/g, '');
      let article_new = document.createElement('div');
      article_new.setAttribute('class', 'entry-content-text');
      article_new.innerText = '\r\n' + json_text;
      article.parentNode.replaceChild(article_new, article);
    }
    removeDOMElement(paywall);
  }
}

else
  csDone = true;

} else if (window.location.hostname.endsWith('.fr') || matchDomain(['bienpublic.com', 'connaissancedesarts.com', 'journaldunet.com', 'la-croix.com', 'ledauphine.com', 'ledevoir.com', 'lesinrocks.com', 'lejsl.com', 'loeildelaphotographie.com', 'marianne.net', 'nouvelobs.com', 'parismatch.com', 'science-et-vie.com'].concat(fr_groupe_nice_matin_domains))) {//france

if (matchDomain('alternatives-economiques.fr')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('#temp-paywall');
    removeDOMElement(paywall);
    let data_ae_poool = document.querySelector('div[data-ae-poool]');
    if (data_ae_poool)
      data_ae_poool.removeAttribute('style');
  }, 500);
}

else if (matchDomain('atlantico.fr')) {
  let paywall = document.querySelector('div.markup[class*="Paywall"]');
  if (paywall)
    paywall.setAttribute('class', 'markup');
}

else if (matchDomain('challenges.fr')) {
  if (window.location.pathname.endsWith('.amp')) {
    amp_unhide_access_hide('="paywall.access OR cha.access"', '="NOT (paywall.access OR cha.access)"');
  } else {
    let amorce = document.querySelector('.user-paying-amorce');
    if (amorce)
      amorce.setAttribute('style', 'display:none !important');
    let content = document.querySelectorAll('.user-paying-content');
    for (let elem of content) {
      elem.classList.remove('user-paying-content');
      elem.removeAttribute('hidden');
    }
    let paywall = document.querySelector('.temp-paywall');
    removeDOMElement(paywall);
  }
}

else if (matchDomain('charliehebdo.fr')) {
  window.setTimeout(function () {
    let paywalled_content = document.querySelector('div.ch-paywalled-content');
    if (paywalled_content)
      paywalled_content.removeAttribute('style');
    let poool_widget = document.querySelector('div#poool-widget');
    removeDOMElement(poool_widget);
  }, 500);
}

else if (matchDomain('connaissancedesarts.com')) {
  let ads = document.querySelectorAll('div.ad-container');
  removeDOMElement(...ads);
}

else if (matchDomain('elle.fr')) {
  if (window.location.hostname.startsWith('amp.')) {
    amp_unhide_access_hide('="poool.access OR cmi_premium.access"');
  } else {
    let hidden_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
    for (let hidden_image of hidden_images)
      hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
    let subscription_bar = document.querySelector('.tc-subscription-bar');
    removeDOMElement(subscription_bar);
  }
}

else if (matchDomain('esprit.presse.fr')) {
  let paywall = document.querySelector('.panel-popup-paywall');
  removeDOMElement(paywall);
}

else if ((domain = matchDomain(fr_groupe_ebra_domains)) && window.location.href.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
  let url = window.location.href;
  let url_new = url.replace(domain + '/', domain + '/amp/');
  if (!url.includes(domain + '/amp/')) {
    let free = document.querySelector('[class^="paywall"]');
    if (!free) {
      window.setTimeout(function () {
        window.location.href = url_new;
      }, 500);
    }
  } else {
    amp_unhide_access_hide('="access"', '="NOT access"', 'amp-ad, amp-embed');
  }
}

else if (domain = matchDomain(fr_groupe_la_depeche_domains)) {
  let url = window.location.href;
  let url_new = url.replace(domain + '/', domain + '/amp/');
  if (url.includes(domain + '/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    let paywall = document.querySelector('div.paywall');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url_new;
    }
  }
}

else if (domain = matchDomain(fr_groupe_nice_matin_domains)) {
  let url = window.location.href;
  let url_new = url.replace(domain + '/', domain + '/amp/');
  if (url.includes(domain + '/amp/')) {
    amp_unhide_access_hide('="access"', '="NOT access"', 'amp-ad, amp-embed');
  } else {
    let paywall = document.querySelector('div#article-teaser');
    if (paywall)
      paywall.removeAttribute('id');
  }
  let ads = document.querySelectorAll('div[class^="ad-slot-"]');
  removeDOMElement(...ads);
}

else if (matchDomain('franc-tireur.fr')) {
  let paywall = document.querySelector('.paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('journaldunet.com')) {
  let reg_wall = document.querySelector('.reg_wall');
  removeDOMElement(reg_wall);
  let entry_reg_wall = document.querySelector('.entry_reg_wall');
  if (entry_reg_wall) {
    entry_reg_wall.removeAttribute('style');
  }
}

else if (matchDomain('la-croix.com')) {
  let url = window.location.href;
  if (!url.includes('la-croix.com/amp/')) {
    let hidden_images = document.querySelectorAll('source[srcset]');
    for (let elem of hidden_images)
      elem.removeAttribute('srcset');
  } else {
    let paywall_block = document.querySelector('#paywall_block');
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(paywall_block, ...amp_ads);
  }
}

else if (matchDomain('lanouvellerepublique.fr')) {
  let alert_didacticiel = document.querySelector('div.alert-didacticiel');
  let loading = document.querySelectorAll('span.loading');
  removeDOMElement(alert_didacticiel, ...loading);
}

else if (matchDomain('ledevoir.com')) {
  let counter = document.querySelector('.popup-msg');
  removeDOMElement(counter);
}

else if (matchDomain(['lejdd.fr', 'parismatch.com'])) {
  let poool_banner = document.querySelector('#poool-container');
  let forbidden = document.querySelector('.forbidden');
  removeDOMElement(poool_banner, forbidden);
  let bottom_hide = document.querySelector('.cnt[data-poool-mode="hide"]');
  if (bottom_hide) {
    bottom_hide.removeAttribute('data-poool-mode');
    bottom_hide.removeAttribute('style');
  }
}

else if (matchDomain('lequipe.fr')) {
  let paywall = document.querySelectorAll('.Paywall, .Article__paywall');
  if (paywall.length) {
    let scripts = document.querySelectorAll('script:not([src], [type])');
    let json_script;
    for (let script of scripts) {
      if (script.innerText.includes('window.__NUXT__=')) {
        json_script = script;
        break;
      }
    }
    let article = document.querySelector('div.article__body');
    if (article && json_script && dompurify_loaded) {
      if (json_script.innerText.includes('articleObject:')) {
        removeDOMElement(...paywall);
        let json = json_script.textContent.split('articleObject:')[1].split(',articleType')[0];
        let url_nuxt = json_script.textContent.split('comment_count_url:"')[1].split('",')[0].replace(/\\u002F/g, '/');
        if (url_nuxt && !url_nuxt.includes(window.location.pathname))
          ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
        let par_type = json.split('paragraphs:[')[1].split(',{__type:')[1].split(',')[0];
        if (par_type) {
          article.innerHTML = '';
          let json_split = json.split('__type:' + par_type);
          json_split.shift();
          let article_dom;
          let article_text = '';
          let parser = new DOMParser();
          let par_main_title = '';
          for (let par_main of json_split) {
            if (par_main.includes(',content:')) {
              let pars;
              if (par_main.split(',content:"').filter(x => !x.startsWith('\\')).length > 2) {
                if (par_main.startsWith(',title:')) {
                  par_main_title = par_main.split(',title:')[1].split(',')[0].replace(/(^\"|\"$)/g, '');
                  article_text += '<p><strong>' + par_main_title + '</strong></p>';
                }
                par_type = json.split('content:')[1].split('"},{__type:')[1].split(',')[0];
                pars = par_main.split('__type:' + par_type);
              } else {
                pars = [par_main];
              }
              for (let par of pars) {
                par = par.split('}')[0];
                if (par.includes(',content:')) {
                  let content = par.split(',content:"')[1].split('",')[0];
                  let par_title = '';
                  if (par.includes(',title:'))
                    par_title = par.split(',title:')[1].split(',')[0].replace(/(^\"|\"$)/g, '');
                  if (content) {
                    par = content.replace('class=', '');
                    if (par_title.length > 2 && par_title !== par_main_title)
                      par = '<strong>' + par_title + '</strong><br><br>' + content;
                    par = par.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>').replace(/\\u002F/g, '/').replace(/\\"/g, '"').replace(/(^\"|\"$)/g, '').replace(/\\t/g, '');
                    article_text += '<p>' + par + '</p>';
                  }
                }
              }
            }
            par_main = par_main.split('}]')[0];
            if (par_main.includes(',media:')) {
              let media = par_main.split(',media:')[1].split('}}')[0] + '}';
              if (media.includes('ratio:')) {
                let ratio = media.split('ratio:')[1].split(',')[0].split('}')[0];
                if (!parseInt(ratio))
                  ratio = 1.5;
                let url = media.split('url:"')[1].split('"')[0].replace(/\\u002F/g, '/').replace('{width}', '400').replace('{height}', parseInt(400 / ratio)).replace('{quality}', '75');
                if (url)
                  article_text += '<p><img src="' + url + '" style="width:95%;"</img></p>';
              }
            }
          }
          article_dom = parser.parseFromString('<div style="margin:20px; font-family:DINNextLTPro-Regular,sans-serif; font-size:18px;">' + DOMPurify.sanitize(article_text) + '</div>', 'text/html');
          article.appendChild(article_dom.querySelector('div'));
        }
      } else
        ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
    } 
  }
}

else if (matchDomain('lesechos.fr') && window.location.href.match(/\d{6,}/)) {
  if (matchDomain('investir.lesechos.fr')) {
    if (!window.location.href.includes('/amp/')) {
      let paywall = document.querySelector('div.bloc-paywall');
      let amphtml = document.querySelector('link[rel="amphtml"]');
      if (paywall && amphtml) {
        removeDOMElement(paywall);
        window.location.href = amphtml.href;
      }
    } else {
      let amp_ads = document.querySelectorAll('amp-ad');
      removeDOMElement(...amp_ads);
    }
  } else {
    window.setTimeout(function () {
      let abo_banner = document.querySelector('div[class*="pgxf3b-2"]');
      let ad_blocks = document.querySelectorAll('[class*="jzxvkd"');
      for (let ad_block of ad_blocks)
        ad_block.setAttribute('style', 'display:none');
      if (abo_banner && dompurify_loaded) {
        removeDOMElement(abo_banner);
        let url = window.location.href;
        let html = document.documentElement.outerHTML;
        let state;
        let split1 = html.split('window.__CONFIG__=')[1];
        let split2 = split1.split('</script>')[0].trim();
        if (split2.includes('; window.__DATA__=')) {
          state = split2.split('; window.__DATA__=')[1].split('; window.__')[0].trim();
        } else
          state = split2.substr(0, split2.length - 1);
        try {
          let data = JSON.parse(state);
          let data_article = data.article ? data.article : data.pageProps;
          let article = data_article.data.stripes[0].mainContent[0].data.description;
          let url_loaded = data_article.data.path;
          if (url_loaded && !url.replace(/%20/g, '').includes(url_loaded))
            ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
          let paywallNode = document.querySelector('.post-paywall');
          if (paywallNode) {
            let contentNode = document.createElement('div');
            let parser = new DOMParser();
            let article_html = parser.parseFromString('<div>' + DOMPurify.sanitize(article) + '</div>', 'text/html');
            let article_par = article_html.querySelector('div');
            if (article_par) {
              contentNode.appendChild(article_par);
              contentNode.className = paywallNode.className;
              paywallNode.parentNode.insertBefore(contentNode, paywallNode);
              removeDOMElement(paywallNode);
              let paywallLastChildNode = document.querySelector('.post-paywall  > :last-child');
              if (paywallLastChildNode) {
                paywallLastChildNode.setAttribute('style', 'height: auto !important; overflow: hidden !important; max-height: none !important;');
              }
            }
          }
          let styleElem = document.head.appendChild(document.createElement('style'));
          styleElem.innerHTML = ".post-paywall::after {height: auto !important;}";
        } catch (err) {
          ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
        }
      }
    }, 500);
  }
}

else if (matchDomain('lesinrocks.com')) {
  if (window.location.search.startsWith('?amp')) {
    let size_defined = document.querySelector('amp-script.i-amphtml-layout-size-defined');
    if (size_defined)
      size_defined.style = 'overflow:visible !important;';
    let overlays = document.querySelectorAll('section.learn_more, div.sidebar, div.menu-footer, div.tooltip_bib, footer.content-info');
    removeDOMElement(...overlays);
  }
}

else if (matchDomain('lexpress.fr')) {
  let ads = document.querySelectorAll('div.block_pub, div.bottom-bar-full');
  removeDOMElement(...ads);
}

else if (matchDomain('loeildelaphotographie.com')) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
  }
  let premium_pic_boxes = document.querySelectorAll('.premium-pic-box');
  let banners = document.querySelectorAll('.membership-promo-container, .login_form_litle');
  removeDOMElement(...premium_pic_boxes, ...banners);
  let blurred_images = document.querySelectorAll('img[style*="blur"]');
  for (let blurred_image of blurred_images)
    blurred_image.removeAttribute('style');
}

else if (matchDomain('lopinion.fr')) {
  if (window.location.search.startsWith('?_amp=true'))
    amp_unhide_access_hide('="access"', '="NOT access"');
}

else if (matchDomain('marianne.net')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall && dompurify_loaded) {
    let article_source = document.querySelector('div.article-body[data-content-src]');
    if (article_source) {
      let article_text = decode_utf8(atob(article_source.getAttribute('data-content-src')));
      let parser = new DOMParser();
      let html = parser.parseFromString('<div>' + DOMPurify.sanitize(article_text) + '</div>', 'text/html');
      let article = html.querySelector('div');
      article_source.innerHTML = '';
      article_source.appendChild(article);
      article_source.removeAttribute('data-content-src');
    }
    removeDOMElement(paywall);
  }
}

else if (matchDomain('nouvelobs.com')) {
  let paywall = document.querySelector('.paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('science-et-vie.com')) {
  if (window.location.hostname.startsWith('amp.')) {
    let pars = document.querySelectorAll('.qiota_reserve > p, .qiota_reserve > h2');
    let pars_text = [];
    for (let par of pars) {
      if (pars_text.includes(par.innerText))
        removeDOMElement(par);
      else
        pars_text.push(par.innerText);
    }
    let sizer = document.querySelector('div.article-content > amp-script > i-amphtml-sizer');
    removeDOMElement(sizer);
    let replaced_content = document.querySelector('div.i-amphtml-replaced-content');
    if (replaced_content)
      replaced_content.removeAttribute('class');
  }
}

else if (matchDomain(['sudouest.fr', 'charentelibre.fr', 'larepubliquedespyrenees.fr'])) {
  let url = window.location.href;
  let paywall = document.querySelector('.article-premium-footer');
  if (paywall) {
    let premium = document.querySelector('meta[name="gsoi:premium-content"]');
    if (premium) {
      if (premium.content) {
        let url_premium = window.location.origin + premium.content;
        replaceDomElementExt(url_premium, false, true, 'div.full-content');
      }
    }
    removeDOMElement(paywall);
  }
  window.setTimeout(function () {
    let footer_premium = document.querySelector('.footer-premium');
    removeDOMElement(footer_premium);
  }, 500);
}

else
  csDone = true;

} else if (window.location.hostname.endsWith('.it') || matchDomain(['eastwest.eu', 'italian.tech', 'limesonline.com', 'quotidiano.net'])) {//italy

if (matchDomain('corriere.it')) {
  if (window.location.pathname.endsWith('_amp.html')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    let url = window.location.href;
    if (url.includes('_preview.shtml')) {
      window.setTimeout(function () {
        window.location.href = url.replace('_preview.shtml', '.shtml').split('?')[0];
      }, 500);
    }
  }
}

else if (matchDomain('eastwest.eu')) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('style');
    paywall.classList.remove('paywall');
    let intro = document.querySelectorAll('div#testo_articolo > p, div#testo_articolo > h3');
    let offerta = document.querySelectorAll('div.offerta_abbonamenti');
    removeDOMElement(...intro, ...offerta);
  }
}

else if (matchDomain('ilfattoquotidiano.it')) {
  let url = window.location.href;
  if (url.includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, div#_4sVideoContainer');
    let comments = document.querySelector('div.content.comments');
    removeDOMElement(comments);
  } else if (url.split('?')[0].match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
    let paywall = document.querySelector('div.read-more');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.split('?')[0] + 'amp';
    }
  }
}

else if (matchDomain('ilfoglio.it')) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, [class^="adv-"], div#gmpVideoContainer');
  } else {
    let paywall = document.querySelector('div.paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
    let ads = document.querySelectorAll('.advertisement');
    removeDOMElement(...ads);
  }
}

else if (matchDomain(it_ilmessaggero_domains)) {
  if (window.location.pathname.toLowerCase().includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  }
}

else if (matchDomain(it_quotidiano_domains)) {
  if (window.location.pathname.endsWith('/amp')) {
    amp_unhide_access_hide('="c.customGranted"', '="NOT c.customGranted"', 'amp-ad, amp-fx-flying-carpet');
  } else {
    let paywall = document.querySelector('div[data-testid="paywall-container"]');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('lescienze.it')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('.paywall-adagio');
    let body_paywall = document.getElementById('detail-body-paywall');
    let shade = document.querySelector('.shade');
    removeDOMElement(paywall, body_paywall, shade);
    let hidden_bodies = document.querySelectorAll('.detail_body');
    for (let hidden_body of hidden_bodies) {
      hidden_body.removeAttribute('hidden');
      hidden_body.setAttribute('style', 'display:block; max-height:auto; overflow:visible');
    }
  }, 1000);
}

else if (matchDomain('limesonline.com')) {
  window.setTimeout(function () {
    let url = window.location.href;
    if (url.includes('prv=true'))
      window.location.href = new URL(url).pathname;
  }, 500);
}

else if (matchDomain('rep.repubblica.it')) {
  window.setTimeout(function () {
    if (window.location.href.includes('/pwa/')) {
      window.location.href = window.location.href.replace('/pwa/', '/ws/detail/');
    }
  }, 500);
  if (window.location.href.includes('/ws/detail/')) {
    let paywall = document.querySelector('.paywall');
    if (paywall) {
      amp_unhide_subscr_section();
      csDoneOnce = true;
    }
  }
}

else if (matchDomain(it_repubblica_domains)) {
  let url = window.location.href.split('?')[0];
  if (!url.match(/\amp(\/)?$/)) {
    let premium = document.querySelector('#paywall, iframe#__limio_frame');
    if (premium) {
      removeDOMElement(premium);
      if (!url.includes('/podcast/')) {
        let amphtml = document.querySelector('link[rel="amphtml"]');
        if (amphtml)
          window.location.href = amphtml.href;
      }
    } else if (matchDomain('gelocal.it')) {
      premium = document.querySelector('.paywall-adagio');
      if (premium) {
        removeDOMElement(premium);
        window.setTimeout(function () {
          let article_body = document.querySelector('div#article-body[style]');
          if (article_body)
            article_body.removeAttribute('style');
        }, 1000);
      }
    }
    let ads = document.querySelectorAll('div[id^="adv"]');
    removeDOMElement(...ads);
  } else {
    if (matchDomain(['lastampa.it', 'www.repubblica.it'])) {
      let paywall = document.querySelector('div[id^="paywall-banner"]');
      removeDOMElement(paywall);
      amp_unhide_subscr_section('amp-ad, amp-embed');
    } else {
      amp_unhide_access_hide('="showContent"', '', 'amp-ad, amp-embed')
    }
  }
}

else
  csDone = true;

} else if (window.location.hostname.match(/\.(be|nl)$/)) {//belgium/netherlands

if (matchDomain('fd.nl')) {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href.includes('?'))
      window.location.href = window.location.href.split('?')[0];
    let reg_modal = document.querySelector('div.modal.upsell');
    if (reg_modal)
      window.location.reload(true);
  });
}

else if (matchDomain('ftm.nl')) {
  let banner_pp = document.querySelector('div.banner-pp');
  removeDOMElement(banner_pp);
}

else if (matchDomain(['knack.be', 'levif.be'])) {
  let paywall = document.querySelector('[class$="Paywall"], #paywall-modal-below');
  if (paywall) {
    removeDOMElement(paywall);
    let hidden_body = document.querySelector('div.rmgDetail-body div');
    if (hidden_body) {
      hidden_body.removeAttribute('class');
      let body_text = hidden_body.innerText.replace(/(?:^|[\w\"\'])(\.|\?|!)(?=[A-Za-zÀ-ÿ\"\']{2,})/gm, "$&\n\n");
      hidden_body.innerText = body_text;
      let intro_par = document.querySelector('div.rmgDetail-body p');
      if (intro_par && intro_par.innerText.length > 200)
        removeDOMElement(intro_par);
    }
  }
}

else if (matchDomain(["lc.nl", "dvhn.nl"])) {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href.includes('?'))
      window.location.href = window.location.href.split('?')[0];
  });
  let top_ad = document.querySelector('.top__ad');
  let plus = document.querySelector('.plusJustRead');
  removeDOMElement(top_ad, plus);
}

else if (matchDomain(nl_mediahuis_region_domains)) {
  window.setTimeout(function () {
    let close_button = document.querySelector('button[data-testid="button-close"]');
    if (close_button)
      close_button.click();
    let premium = document.querySelector('div.common-components-plus_pluslabel--container');
    if (premium && dompurify_loaded) {
      let hidden_article = document.querySelector('div[data-auth-body="article"]');
      if (hidden_article)
        hidden_article.removeAttribute('style');
      let paywall = document.querySelector('div[data-auth-root="paywall"]');
      removeDOMElement(paywall);
      let auth_body = document.querySelector('div[data-auth-body="article"]');
      if (paywall && auth_body) {
        let auth_body_par_count = auth_body.querySelectorAll('p');
        if (auth_body_par_count.length < 2) {
          let json_script = document.querySelector('script[data-fragment-type="PacoArticleContent"]');
          let json_str = json_script.text.substring(json_script.textContent.indexOf('{'));
          try {
            let json = JSON.parse(json_str);
            let article = Object.values(json)[0]['data']['article']['body'];
            auth_body.innerHTML = '';
            let par_html, par_dom, par_elem, par_div, par_key;
            let parser = new DOMParser();
            for (let par of article) {
              for (let key in par) {
                par_dom = document.createElement('p');
                par_elem = '';
                par_key = par[key];
                if (key === 'subhead') {
                  par_html = parser.parseFromString('<div><strong>' + DOMPurify.sanitize(par_key) + '</strong></div>', 'text/html');
                  par_elem = par_html.querySelector('div');
                } else if (key === 'twitter' || key === 'instagram') {
                  par_elem = document.createElement('a');
                  Object.assign(par_elem, {
                    href: par_key,
                    innerText: par_key.split('?')[0],
                    target: '_blank'
                  });
                } else if (key === 'youtube') {
                  par_elem = document.createElement('iframe');
                  Object.assign(par_elem, {
                    src: 'https://www.youtube.com/embed/' + par_key.id,
                    id: 'ytplayer',
                    type: 'text/html',
                    width: 640,
                    height: 360,
                    frameborder: 0
                  });
                } else if (key === 'streamone') {
                  par_elem = document.createElement('iframe');
                  Object.assign(par_elem, {
                    src: 'https://content.tmgvideo.nl/embed/item=' + par_key.id,
                    type: 'text/html',
                    width: 640,
                    height: 360,
                    frameborder: 0
                  });
                } else if (key === 'image') {
                  par_elem = document.createElement('div');
                  let par_img = document.createElement('img');
                  par_img.src = par_key.url;
                  par_elem.appendChild(par_img);
                  par_div = document.createElement('div');
                  par_div.innerText = par[key].caption ? par[key].caption : '';
                  par_div.innerText += par[key].credit ? '\n' + par[key].credit : '';
                  par_elem.appendChild(par_div);
                } else {
                  par_html = parser.parseFromString('<p style="font-size: 18px; line-height: 1.625;">' + DOMPurify.sanitize(par_key) + '</div>', 'text/html');
                  par_elem = par_html.querySelector('p');
                }
                if (par_elem)
                  par_dom.appendChild(par_elem);
                auth_body.appendChild(par_dom);
              }
            }
          } catch (err) {
            console.warn('unable to parse text');
            console.warn(err);
          }
        }
      }
    }
  }, 500);
}

else if (matchDomain('nrc.nl')) {
  window.setTimeout(function () {
    let nrc_overlay = document.querySelectorAll('[id$="modal__overlay"]');
    let subscribe_bar = document.querySelector('.header__subscribe-bar');
    removeDOMElement(...nrc_overlay, subscribe_bar);
    let paywall = document.querySelector('.has-paywall');
    if (paywall)
      paywall.classList.remove('has-paywall');
    let paywall_overlay = document.querySelector('.has-paywall-overlay');
    if (paywall_overlay)
      paywall_overlay.classList.remove('has-paywall-overlay');
  }, 100);
}

else if (matchDomain(["parool.nl", "trouw.nl", "volkskrant.nl", "humo.be", "demorgen.be"])) {
  let banners = document.querySelectorAll('div[data-temptation-position^="PAGE_"], div[class^="ad--"]');
  let paywall = document.querySelectorAll('[data-temptation-position^="ARTICLE_"]');
  removeDOMElement(...banners, ...paywall);
}

else if (matchDomain('telegraaf.nl')) {
  if (window.location.href.startsWith('https://www.telegraaf.nl/error?ref=/')) {
    window.setTimeout(function () {
      window.location.href = window.location.href.split('&')[0].replace('error?ref=/', '');
    }, 500);
  }
  let refresh = document.querySelector('div[id="content"] > meta[http-equiv="refresh"]');
  if (refresh) {
    window.setTimeout(function () {
      window.location.reload(true);
    }, 500);
  }
  let article_wrapper = document.querySelector('.ArticlePageWrapper__uid');
  let spotx_banner = document.querySelector('.ArticleBodyBlocks__inlineArticleSpotXBanner');
  let paywall = document.querySelector('.MeteringNotification__backdrop');
  removeDOMElement(spotx_banner, paywall);
  let premium = document.querySelector('.PremiumLabelWithLine');
  let article_id = article_wrapper ? article_wrapper.innerText : '123';
  let article_body_done = document.querySelector('#articleBody' + article_id);
  if (premium && !article_body_done) {
    let article_body_old = document.querySelector('[id^="articleBody"]');
    removeDOMElement(article_body_old);
    let html = document.documentElement.outerHTML;
    let json = html.includes('window.__APOLLO_STATE__=') ? html.split('window.__APOLLO_STATE__=')[1].split('};')[0] + '}' : '';
    if (json) {
      let json_article_id = json.split('uid\":')[1].split(',\"')[0];
      if (json_article_id && json_article_id !== article_id) {
        window.setTimeout(function () {
          window.location.reload(true);
        }, 500);
      }
      let json_text = json.includes('"body":"') ? json.split('"body":"')[1].split('","__typename":')[0] : '';
      if (json_text) {
        let intro = document.querySelector('span[id^="articleIntro"]');
        if (intro)
          json_text = json_text.replace(intro.innerText + '\n\n', '');
        let article_body = document.querySelector('section.TextArticlePage__bodyText');
        if (article_body) {
          let div_main = document.createElement('div');
          div_main.setAttribute('id', 'articleBody' + article_id);
          let div_elem = document.createElement('div');
          div_elem.setAttribute('data-element', 'articleBodyBlocks');
          let text_array = json_text.split('\\n');
          text_array.forEach(p_text => {
            let p_div = document.createElement('p');
            p_div.setAttribute('class', 'ArticleBodyBlocks__paragraph');
            p_div.innerText = p_text;
            div_elem.appendChild(p_div);
          });
          div_main.appendChild(div_elem);
          article_body.appendChild(div_main);
        }
      }
    }
  }
}

else if (matchDomain('vn.nl')) {
  let paywall = document.querySelector('div.content__message-no-access-container');
  if (paywall && dompurify_loaded) {
    let content_restriction = document.querySelector('div.content__restriction');
    removeDOMElement(paywall, content_restriction);
    let body = document.querySelector('body');
    if (body)
      body.style = 'height:auto !important;';
    let article_content = document.querySelector('section[data-article-content-element]');
    if (article_content)
      article_content.style = 'max-height:none !important;';
    let json_url_dom = document.querySelector('link[rel="alternate"][type="application/json"]');
    if (json_url_dom) {
      let json_url = json_url_dom.href;
      fetch(json_url)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            let json_text = json.content.rendered;
            let content = document.querySelector('div[data-article-content-target]');
            if (json_text && content) {
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div data-article-content-target>' + DOMPurify.sanitize(json_text) + '</div>', 'text/html');
              let content_new = doc.querySelector('div');
              content.parentNode.replaceChild(content_new, content);
            }
          });
        }
      });
    }
  }
}

else
  csDone = true;

} else if (window.location.hostname.match(/\.(ie|uk)$/) || matchDomain(['theathletic.com'])) {//united kingdom/ireland

if (matchDomain('independent.co.uk')) {
  let url = window.location.href;
  if (url.includes('?amp')) {
    let ads = document.querySelectorAll('amp-ad, amp-embed, [id^="ad-"]');
    removeDOMElement(...ads);
  } else {
    let paywall = document.querySelector('div.article-premium');
    let related = document.querySelector('div.related');
    let msg = document.querySelector('div#bpc_archive');
    if (paywall && !related && !msg) {
      paywall.classList.remove('article-premium');
      let article = document.querySelector('div#main');
      if (article)
        article.insertBefore(archiveLink(url), article.firstChild);
    }
  }
}

else if (matchDomain('prospectmagazine.co.uk')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.paywall_overlay_blend, div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url;
    replaceDomElementExt(url_cache, true, false, 'main');
  }
}

else if (matchDomain('spectator.co.uk')) {
  let url = window.location.href.split('?')[0];
  if (url.match(/\/amp(\/)?$/)) {
    let paywall = document.querySelectorAll('div[amp-access^="p.show"');
    let not_logged_in = document.querySelector('div[amp-access*="NOT loggedIn"]');
    removeDOMElement(...paywall, not_logged_in)
  } else {
    let premium = document.querySelector('.HardPayWallContainer-module__overlay');
    removeDOMElement(premium);
    if (premium)
      window.location.href = url + '/amp';
  }
}

else if (matchDomain('telegraph.co.uk')) {
  let url = window.location.href.split('?')[0];
  if (url.endsWith('/amp/')) {
    let paywall = document.querySelectorAll('.premium-paywall');
    if (paywall.length) {
      let truncated_content = document.querySelector('.truncated-content');
      removeDOMElement(...paywall, truncated_content);
      amp_unhide_access_hide('="c.result=\'ALLOW_ACCESS\'"', '', 'amp-ad, amp-embed', false);
    } else {
      let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
      removeDOMElement(...amp_ads);
    }
  } else {
    let subwall = document.querySelectorAll('[class^="subwall"]');
    let ads = document.querySelectorAll('.advert, .commercial-unit');
    removeDOMElement(...subwall, ...ads);
  }
}

else if (matchDomain('the-tls.co.uk')) {
  let paywall = document.querySelector('.tls-subscriptions-banner__closed-skin');
  removeDOMElement(paywall);
}

else if (matchDomain(['theathletic.com', 'theathletic.co.uk'])) {
  if (!window.location.href.includes('?amp')) {
    let paywall = document.querySelectorAll('div#paywall-container, div[subscriptions-action="subscribe"], a.headline-paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall.length && amphtml) {
      removeDOMElement(...paywall);
      window.setTimeout(function () {
        window.location.href = amphtml.href;
      }, 500);
    }
  } else {
    amp_unhide_subscr_section();
    let subscr_actions = document.querySelectorAll('[subscriptions-actions]');
    removeDOMElement(...subscr_actions);
    let podcast = document.querySelector('div[id^="podcast-clip-"]');
    if (podcast) {
      let podcast_src = podcast.innerHTML.replace(/<amp-/g, '<').replace(/<\/amp-/g, '</');
      let parser = new DOMParser();
      let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(podcast_src, {ADD_TAGS: ['iframe'], ADD_ATTR: ['layout', 'sandbox']}) + '</div>', 'text/html');
      let podcast_new = doc.querySelector('div');
      if (podcast_new)
        podcast.parentNode.replaceChild(podcast_new, podcast);
    }
  }
}

else if (matchDomain('thetimes.co.uk')) {
  let url = window.location.href;
  if (window.location.hostname !== 'epaper.thetimes.co.uk') {
    let block = document.querySelector('.subscription-block');
    let adverts = document.querySelectorAll('#ad-article-inline, #sticky-ad-header, div[class*="InlineAdWrapper"], div[class*="NativeAd"], div.responsiveweb-sc-1exejum-0');
    removeDOMElement(block, ...adverts);
    let paywall = document.querySelector('div#paywall-portal-article-footer');
    if (paywall && !url.includes('?shareToken=')) {
      removeDOMElement(paywall);
      let article = document.querySelector('article[role="article"]');
      if (article)
        article.insertBefore(archiveLink(url), article.firstChild);
    }
    let paywall_page = document.querySelector('div#paywall-portal-page-footer');
    removeDOMElement(paywall_page);
  } else {
    if (url.includes('/textview')) {
      let article_locks = document.querySelectorAll('article[aid] > div > div > a.readmore.dis[href="javascript:void(0)"]');
      for (let elem of article_locks) {
        let article = elem.closest('article[aid]');
        if (article)
          elem.href = 'article/' + article.getAttribute('aid');
      }
      let headers = document.querySelectorAll('article[aid] > header > hgroup > h1');
      for (let elem of headers) {
        let article = elem.closest('article[aid]');
        if (article && !elem.innerHTML.includes('</a>')) {
          let new_link = document.createElement('a');
          new_link.href = 'article/' + article.getAttribute('aid');
          new_link.innerText = elem.innerText;
          elem.innerText = '';
          elem.appendChild(new_link);
        }
      }
      let continued_links = document.querySelectorAll('a.continued[href="javascript:void(0)"]');
      for (let elem of continued_links) {
        let pagenr = parseInt(elem.innerText.replace('Continued from ', ''));
        if (pagenr)
          elem.href = url.replace(/\/page\/(\d)+\/textview/, '/page/' + pagenr + '/textview');
      }
      let bottom_links = document.querySelectorAll('article > a[id^="athumb_"][article-id][href="javascript:void(0)"]');
      for (let elem of bottom_links)
        elem.href = 'article/' + elem.getAttribute('article-id');
    } else {
      let pages = document.querySelectorAll('div.page-left, div.page-right');
      for (let page of pages)
        page.style.height = 'auto';
    }
  }
}

else if (!matchDomain(['belfasttelegraph.co.uk', 'independent.ie']))
  csDone = true;

} else if (window.location.hostname.match(/\.(br|cl|pe)$/) || matchDomain(['clarin.com', 'elespectador.com', 'elmercurio.com', 'latercera.com', 'lasegunda.com', 'valor.globo.com'])) {//south america

if (matchDomain('abril.com.br')) {
  if (window.location.pathname.endsWith('/amp/')) {
    let paywall = document.querySelector('.piano-modal');
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(paywall, ...amp_ads);
  }
}

else if (matchDomain('clarin.com')) {
  let ads = document.querySelectorAll('.ad-slot');
  removeDOMElement(...ads);
}

else if (matchDomain(pe_grupo_elcomercio_domains)) {
  let paywall = document.querySelector('.story-content__nota-premium');
  if (paywall) {
    paywall.classList.remove('story-content__nota-premium');
    paywall.removeAttribute('style');
  }
}

else if (matchDomain('elespectador.com')) {
  if (window.location.search.startsWith('?outputType=amp')) {
    amp_unhide_subscr_section('amp-ad, amp-embed, [class^="Widget"], amp-fx-flying-carpet');
  } else {
    let paywall = document.querySelector('.paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('elmercurio.com')) {
  window.setTimeout(function () {
    let elem_hidden = document.querySelectorAll('[style="visibility:hidden"]');
    for (let elem of elem_hidden)
      elem.removeAttribute('style');
    let page_pdf_content = document.querySelector('div.page_pdf_content');
    let close_html = document.querySelector('div.close_html');
    removeDOMElement(page_pdf_content, close_html);
  }, 1000);
  window.setTimeout(function () {
    let cont_articlelight = document.querySelector('div.cont_articlelight');
    if (cont_articlelight)
      cont_articlelight.setAttribute('style', 'height: 100% !important; width: 90% !important');
  }, 3000);
}

else if (matchDomain('estadao.com.br')) {
  if (window.location.pathname.endsWith('.amp')) {
    amp_unhide_access_hide('="granted"', '="NOT granted"', 'amp-ad, amp-embed, amp-fx-flying-carpet');
  } else {
    let paywall = document.getElementById('paywall-wrapper-iframe-estadao');
    removeDOMElement(paywall);
  }
}

else if (matchDomain('folha.uol.com.br')) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-sticky-ad, amp-embed');
  } else {
    let signup = document.querySelector('.c-top-signup');
    removeDOMElement(signup);
  }
}

else if (matchDomain('blogfolha.uol.com.br')) {
  let hidden_images = document.querySelectorAll('div[id^="attachment_"] > a > img[src^="http:"][srcset]');
  for (let hidden_image of hidden_images) {
    hidden_image.src = hidden_image.src.replace('http:', 'https:');
    hidden_image.srcset = '';
  }
}

else if (matchDomain('latercera.com')) {
    let subscr_banner = document.querySelector('.empty');
    removeDOMElement(subscr_banner);
}

else if (matchDomain('lasegunda.com')) {
  let url = window.location.href;
  if (url.includes('digital.lasegunda.com/mobile')) {
    let lessreadmore = document.querySelectorAll('article.lessreadmore');
    for (let article of lessreadmore)
      article.classList.remove('lessreadmore');
    let bt_readmore = document.querySelectorAll('div[id*="bt_readmore_"]');
    removeDOMElement(...bt_readmore);
  }
}

else if (matchDomain(["mercuriovalpo.cl", "estrellavalpo.cl"])) {
  let content = document.querySelector('div.content');
  if (content)
    content.setAttribute('id', 'content_new');
  let modal_wrapper = document.querySelector('div.modal-wrapper');
  removeDOMElement(modal_wrapper);
  let body_modal = document.querySelector('body.modal-open');
  if (body_modal)
    body_modal.classList.remove('modal-open');
}

else if (matchDomain('valor.globo.com')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url;
    replaceDomElementExt(url_cache, true, false, 'div.protected-content');
  }
  let skeleton_box = document.querySelector('div.glb-skeleton-box');
  if (skeleton_box) {
    skeleton_box.classList.remove('glb-skeleton-box');
    skeleton_box.removeAttribute('style');
  }
}

else
  csDone = true;

} else {//other (like com/org & not at/be/br/ch/cl/de/dk/fi/fr/es/ie/nl/no/pe/pt/se/uk))

if (matchDomain(usa_adv_local_domains)) {
  let url = window.location.href;
  if (url.includes('?outputType=amp')) {
    let amp_ads = document.querySelectorAll('.amp-ad-container, amp-embed');
    removeDOMElement(...amp_ads);
  } else {
    let paywall = document.querySelector('.paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
    let ads = document.querySelectorAll('div.ad');
    removeDOMElement(...ads);
  }
}

else if (matchDomain('adweek.com')) {
  let url = window.location.href;
  let body_single = document.querySelector('body.single');
  let amphtml = document.querySelector('link[rel="amphtml"]');
  if (body_single && amphtml) {
    body_single.classList.remove('single');
    window.location.href = amphtml.href;
  }
}

else if (matchDomain('americanbanker.com')) {
  let inline_gate = document.querySelector('.inline-gate');
  if (inline_gate) {
    inline_gate.classList.remove('inline-gate');
    let inline_gated = document.querySelectorAll('.inline-gated');
    for (let elem of inline_gated)
      elem.classList.remove('inline-gated');
  }
}

else if (matchDomain('artnet.com')) {
  if (window.location.pathname.endsWith('/amp-page')) {
    amp_unhide_subscr_section();
  } else {
    let body_hidden = document.querySelector('.article-body');
    if (body_hidden)
      body_hidden.style = 'display:block;';
  }
}

else if (matchDomain('asia.nikkei.com')) {
  let popup = document.querySelector('#pianoj_ribbon');
  removeDOMElement(popup);
}

else if (matchDomain('asiatimes.com')) {
  if (!window.location.search.includes('?amp_markup=1')) {
    let paywall = document.querySelector('div.woocommerce');
    if (paywall) {
      removeDOMElement(paywall);
      let url_amp = window.location.href.split('?')[0] + '?amp_markup=1';
      replaceDomElementExt(url_amp, false, false, 'div.entry-content', '', 'article.ia2amp-article');
    }
  }
}

else if (matchDomain('barrons.com')) {
  let url = window.location.href;
  if (!url.includes('barrons.com/amp/')) {
    let body_continuous = document.querySelector('body.is-continuous');
    let snippet = document.querySelector('meta[content="snippet"]');
    if (body_continuous && snippet) {
      removeDOMElement(snippet);
      window.location.href = url.replace('barrons.com', 'barrons.com/amp');
    }
    let signin_links = document.querySelectorAll('a.primary-button--link[href*="target="]');
    for (let signin_link of signin_links) {
      signin_link.href = decodeURIComponent(signin_link.href.split('target=')[1]).split('?')[0];
      signin_link.text = 'Click';
    }
    let barrons_ads = document.querySelectorAll('.barrons-body-ad-placement');
    removeDOMElement(...barrons_ads);
  } else {
    amp_unhide_subscr_section('.wsj-ad, amp-ad');
  }
}

else if (matchDomain('billboard.com')) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  }
}

else if (matchDomain('bloomberg.com')) {
  function bloomberg_noscroll(node) {
    node.removeAttribute('data-paywall-overlay-status');
  }
  waitDOMElement('div#fortress-paywall-container-root', 'DIV', removeDOMElement, true);
  waitDOMAttribute('body', 'BODY', 'data-paywall-overlay-status', bloomberg_noscroll, true);
  let paywall = document.querySelector('div#fortress-paywall-container-root');
  let counter = document.querySelector('div#fortress-preblocked-container-root');
  let leaderboard = document.querySelector('div[id^="leaderboard"], div[class^="leaderboard"], div.canopy-container');
  let noscroll = document.querySelector('body[data-paywall-overlay-status]');
  if (noscroll)
    noscroll.removeAttribute('data-paywall-overlay-status');
  removeDOMElement(paywall, counter, leaderboard);
  sessionStorage.clear();
  let url = window.location.href;
  if (url.match(/\/(articles|features)\//)) {
    let page_ad = document.querySelectorAll('div.page-ad, div[data-ad-placeholder]');
    let reg_ui_client = document.querySelector('div#reg-ui-client');
    removeDOMElement(leaderboard, ...page_ad, reg_ui_client);
    let hidden_images = document.querySelectorAll('img.lazy-img__image[src][data-native-src]');
    for (let hidden_image of hidden_images) {
      if (hidden_image.src.match(/\/(60|150)x-1\.(png|jpg)$/))
        hidden_image.setAttribute('src', hidden_image.getAttribute('data-native-src'));
      hidden_image.style.filter = 'none';
    }
    let hidden_charts = document.querySelectorAll('div[data-toaster-id][data-src]');
    for (let hidden_chart of hidden_charts) {
      let elem = document.createElement('iframe');
      Object.assign(elem, {
        src: hidden_chart.getAttribute('data-src'),
        frameborder: 0,
        height: hidden_chart.getAttribute('style').replace('min-height: ', ''),
        scrolling: 'no'
      });
      hidden_chart.parentNode.replaceChild(elem, hidden_chart);
    }
    let blur = document.querySelector('div.blur[style]');
    if (blur) {
      blur.classList.remove('blur');
      blur.removeAttribute('style');
    }
    let shimmering_content = document.querySelectorAll('div.shimmering-text');
    let body_transparent = document.querySelector('div[class*="nearly-transparent-text-blur"]');
    if ((shimmering_content.length || body_transparent) && dompurify_loaded) {
      removeDOMElement(...shimmering_content);
      if (body_transparent)
        removeClassesByPrefix(body_transparent, 'nearly-transparent-text-blur');
      let json_script = document.querySelector('script[data-component-props="ArticleBody"], script[data-component-props="FeatureBody"]');
      if (json_script) {
        let json = JSON.parse(json_script.innerHTML);
        if (json) {
          let json_text;
          if (json.body)
            json_text = json.body;
          else if (json.story && json.story.body)
            json_text = json.story.body;
          if (json_text) {
            removeDOMElement(json_script);
            let article = document.querySelector('div.body-copy-v2:not(.art_done)');
            let article_class = 'body-copy-v2';
            if (!article) {
              article = document.querySelector('div.body-copy:not(.art_done)');
              article_class = 'body-copy';
            }
            if (!article) {
              article = document.querySelector('div.body-content:not(.art_done)');
              article_class = 'body-content';
            }
            if (article) {
              article_class += ' art_done';
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div class="' + article_class + '">' + DOMPurify.sanitize(json_text, {ADD_TAGS: ['iframe', 'script']}) + '</div>', 'text/html');
              let article_new = doc.querySelector('div');
              if (article_new) {
                article.parentNode.replaceChild(article_new, article);
                let teaser_body = document.querySelector('div.body-content[class*="teaser-content_"]');
                removeDOMElement(teaser_body);
                let thirdparty_embed = document.querySelector('div.thirdparty-embed__container[style*="height: 0;"]');
                if (thirdparty_embed)
                  thirdparty_embed.setAttribute('style', 'height: 550px !important;');
              }
            }
          }
        }
      }
    }
  }
}

else if (matchDomain('bloombergquint.com')) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_subscr_section();
  }
}

else if (matchDomain('bostonglobe.com')) {
  if (window.location.search.startsWith('?outputType=amp')) {
    amp_unhide_subscr_section();
  } else {
    let ads = document.querySelectorAll('div.arc_ad');
    removeDOMElement(...ads);
  }
}

else if (matchDomain('business-standard.com')) {
  let skip_button = document.querySelector('a.btn_skip');
  if (skip_button)
    skip_button.click();
  let p_content = document.querySelector('span.p-content.paywall');
  if (p_content) {
    p_content.classList.remove('paywall');
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json_text = JSON.parse(json_script.text.replace(/(\r|\n|\t)/gm, ''))[0].articleBody;
      json_text = parseHtmlEntities(json_text);
      json_text = json_text.replace(/(?:^|[\w\"\'\’])(\.|\?|!)(?=[A-Z\"\”\“\‘\’\'][A-Za-zÀ-ÿ\"\”\“\‘\’\']{1,})/gm, "$&\r\n\r\n") + '\r\n\r\n';
      let article = document.createElement('div');
      article.innerText = json_text;
      if (article) {
        let old_pars = p_content.querySelectorAll('p');
        for (let old_par of old_pars) {
          if (!old_par.querySelector('img'))
            removeDOMElement(old_par);
        }
        p_content.appendChild(article);
      }
    }
  }
}

else if (matchDomain('businessoffashion.com')) {
  let ads = document.querySelectorAll('div[class^="default__AdsBlockWrapper"]');
  removeDOMElement(...ads);
}

else if (matchDomain(ca_torstar_domains)) {
  window.setTimeout(function () {
    let meter_banner = document.querySelector('.c-article-meter-banner');
    let ads = document.querySelectorAll('.seo-media-query, .c-googleadslot');
    removeDOMElement(meter_banner, ...ads);
    let end_of_article = document.querySelector('#end-of-article');
    if (end_of_article)
      end_of_article.setAttribute('style', 'display:none;');
    let rightrail = document.querySelector('.c-article-body__rightrail');
    if (rightrail)
      rightrail.setAttribute('style', 'display:none;');
  }, 500);
}

else if (matchDomain('cen.acs.org')) {
  let meteredBar = document.querySelector('.meteredBar');
  removeDOMElement(meteredBar);
}

else if (matchDomain('chronicle.com')) {
  let preview = document.querySelector('div[data-content-summary]');
  removeDOMElement(preview);
  let article_hidden = document.querySelector('div[data-content-body]');
  if (article_hidden)
    article_hidden.removeAttribute('data-content-body');
}

else if (matchDomain('csmonitor.com')) {
  let paywall = document.querySelector('div.paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('dallasnews.com')) {
  if (window.location.search.startsWith('?outputType=amp')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  }
}

else if (matchDomain('digiday.com')) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_access_hide('="NOT p.showPageviewExpired AND NOT p.showPayWall"', '', 'amp-ad, .advertisement, .ad-wrapper');
  }
}

else if (matchDomain('discovermagazine.com')) {
  window.setTimeout(function () {
    let mammoth = document.querySelector('.iXVGnF');
    if (mammoth)
      window.location.reload();
    let banner = document.querySelector('div.dPURIw');
    if (banner)
      banner.setAttribute('style', 'display:none;');
  }, 1000);
}

else if (matchDomain('economictimes.com')) {
  if (window.location.pathname.includes('/amp_')) {
    let paywall = document.querySelector('.paywall_wrap');
    if (paywall) {
      let content = document.querySelector('.paywall[style="display:none;"]');
      if (content)
        content.setAttribute('style', 'display:block;');
      let intro = document.querySelector('.art_wrap');
      let article_blocker = document.querySelector('.articleBlocker');
      let amp_ads = document.querySelectorAll('amp-ad');
      removeDOMElement(paywall, intro, article_blocker, ...amp_ads);
    }
  } else {
    window.setTimeout(function () {
      let paywall = document.querySelector('div#blocker_layer');
      let data_prime = document.querySelector('div[data-prime="1"]');
      if ((paywall || data_prime) && dompurify_loaded) {
        removeDOMElement(paywall);
        if (data_prime)
          data_prime.removeAttribute('data-prime');
        let content = document.querySelector('div[id^="articlebody_"]');
        if (content && content.classList.contains('paywall')) {
          content.classList.remove('paywall');
          window.location.reload(true);
        }
        let full_text = document.querySelector('div.paywall:not([id])');
        if (content && full_text) {
          content.innerText = '';
          let parser = new DOMParser();
          let html = parser.parseFromString('<div>' + DOMPurify.sanitize(full_text.innerHTML, {ADD_ATTR: ['frameborder'], ADD_TAGS: ['iframe']}) + '</div>', 'text/html');
          let article = html.querySelector('div');
          content.appendChild(article);
          removeDOMElement(full_text);
          let data_adaptive = document.querySelector('div[data-adaptive="1"]');
          if (data_adaptive)
            data_adaptive.removeAttribute('data-adaptive');
          let prime_banner = document.querySelector('div.q0AQz');
          removeDOMElement(prime_banner);
        }
      }
    }, 500);
  }
}

else if (matchDomain('economictimes.indiatimes.com')) {
  let paywall = document.querySelector('section.prime_paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let content = document.querySelector('div.content1, div.artText');
    let full_text = document.querySelector('div.paywall.p1');
    if (content && full_text)
      content.innerText = full_text.innerText;
    let page_content = document.querySelector('div.pageContent:not([style]');
    if (page_content)
      page_content.setAttribute('style', 'height: auto !important;');
  }
}

else if (matchDomain('economist.com')) {
  let subscribe = document.querySelector('.subscription-proposition');
  let wrapper = document.getElementById('bottom-page-wrapper');
  let adverts = document.querySelectorAll('div.advert');
  removeDOMElement(subscribe, wrapper, ...adverts);
  let p_articles = document.querySelectorAll('p.article__body-text');
  let href;
  for (let p_article of p_articles) {
    let e_anchors = document.querySelectorAll('a');
    href = '';
    for (let e_anchor of e_anchors) {
      if (e_anchor.href) {
        href = e_anchor.href;
      } else {
        e_anchor.href = href;
      }
    }
  }
}

else if (matchDomain('entrepreneur.com')) {
  let promo = document.querySelector('.paywall-promo');
  if (promo) {
    removeDOMElement(promo);
    let gate_check = document.querySelector('.gate-check');
    if (gate_check)
      gate_check.removeAttribute('class');
    let hidden_images = document.querySelectorAll('img.lazy[src*="blur"][data-src]');
    for (let hidden_image of hidden_images)
      hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
  }
}

else if (matchDomain('firstthings.com')) {
  let paywall = document.querySelector('.paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('foreignaffairs.com')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('.paywall');
    let loading_indicator = document.querySelector('.loading-indicator');
    let msg_bottom = document.querySelector('.messages--container--bottom');
    removeDOMElement(paywall, loading_indicator, msg_bottom);
    let article_dropcap = document.querySelectorAll('.article-dropcap');
    for (let elem of article_dropcap)
      elem.classList.add('loaded');
    let hidden_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
    for (let hidden_image of hidden_images) {
      hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
      hidden_image.removeAttribute('class');
    }
    let img_list = document.querySelectorAll('.magazine-list-article img');
    for (let img_elem of img_list)
      img_elem.setAttribute('class', 'mb-4');
    if (window.location.href.includes('/interviews/')) {
      let img_header = document.querySelector('.interview-header > div');
      if (img_header) {
        let img_src = img_header.getAttribute('data-src');
        let img_elem = document.createElement('img');
        img_elem.src = img_src;
        img_header.appendChild(img_elem);
      }
    }
  }, 1000);
}

else if (matchDomain('foreignpolicy.com')) {
  let content_ungated = document.querySelector('div.content-ungated');
  removeDOMElement(content_ungated);
  let content_gated = document.querySelector('div.content-gated');
  if (content_gated)
    content_gated.classList.remove('content-gated');
}

else if (matchDomain('fortune.com')) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_access_hide('="NOT p.showRegWall AND NOT p.showPayWall"', '', '[class^="amp-ad"]');
    let paywall = document.querySelector('.paywall');
    removeDOMElement(paywall);
  }
}

else if (matchDomain('ft.com')) {
  if (window.location.hostname.startsWith('amp.')) {
    amp_unhide_subscr_section('.ad-container, amp-ad');
  } else {
    let cookie_banner = document.querySelector('.o-banner__outer');
    let ribbon = document.querySelector('.js-article-ribbon');
    let ads = document.querySelector('.o-ads');
    removeDOMElement(cookie_banner, ribbon, ads);
  }
}

else if (matchDomain('griffithreview.com')) {
  let body_single = document.querySelector('body.single');
  if (body_single)
    body_single.classList.remove('single');
  let subscribe = document.querySelector('div.call-to-action');
  removeDOMElement(subscribe);
}

else if (matchDomain('harpers.org')) {
  let overlay = document.querySelector('div[id^="pum-"]');
  removeDOMElement(overlay);
  let entry_content = document.querySelectorAll('.entry-content');
  for (let elem of entry_content)
    elem.setAttribute('style', 'display: block !important');
}

else if (matchDomain('hbr.org')) {
  let popup = document.querySelector('.persistent-banner');
  removeDOMElement(popup);
}

else if (matchDomain('hbrchina.org')) {
  let div_hidden = document.querySelector('div#the_content');
  if (div_hidden)
    div_hidden.removeAttribute('style');
}

else if (matchDomain('hilltimes.com')) {
  let paywall = document.querySelector('div.paywallcont');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = getArticleJsonScript();
    if (json_script) {
      let json = JSON.parse(json_script.text).filter(x => x.articleBody)[0];
      if (json) {
        let json_text = json.articleBody.replace(/&nbsp;/g, '').replace(/(\.|\%)\s{3,}/g, "$&\r\n\r\n");
        let content = document.querySelector('div#xorg');
        if (json_text && content)
          content.innerText = '\r\n' + json_text;
      }
    }
  }
}

else if (matchDomain('hindustantimes.com')) {
  let paywall = document.querySelector('.freemium-card');
  if (paywall) {
    removeDOMElement(paywall);
    let freemium_text = document.querySelector('.freemiumText');
    if (freemium_text)
      freemium_text.classList.remove('freemiumText');
  }
  let noscroll = document.querySelector('body.open-popup');
  if (noscroll)
    noscroll.classList.remove('open-popup');
  let close_story = document.querySelector('.closeStory');
  let ads = document.querySelectorAll('div[class^="adHeight"]');
  removeDOMElement(close_story, ...ads);
}

else if (matchDomain('historyextra.com')) {
  let article_masked = document.querySelector('.template-article__masked');
  if (article_masked) {
    let extra_pars = document.querySelectorAll('div.template-article__masked > p');
    removeDOMElement(...extra_pars);
    article_masked.classList.remove('template-article__masked');
  }
  let ad_banner = document.querySelector('.ad-banner-container');
  removeDOMElement(ad_banner);
}

else if (matchDomain(usa_hearst_comm_domains)) {
  let wrapper = document.querySelector('.belowMastheadWrapper');
  removeDOMElement(wrapper);
}

else if (matchDomain('inc42.com')) {
  let url = window.location.href;
  if (!url.includes('/amp/')) {
    let premium = document.querySelector('div.premium-container');
    if (premium) {
      removeDOMElement(premium);
      window.location.href = url.split('?')[0] + 'amp/';
    }
  } else {
    let plus_popup = document.querySelector('div#plus-pop');
    if (plus_popup) {
      removeDOMElement(plus_popup);
      let expired = document.querySelectorAll('div[amp-access="p.showPageviewExpired"], div[amp-access="cm.maxViews AND NOT loggedIn"]');
      removeDOMElement(...expired);
      amp_unhide_access_hide('^="NOT p.showPageviewExpired"')
    }
  }
}

else if (matchDomain('indianexpress.com')) {
  if (window.location.pathname.endsWith('/lite/'))
    amp_unhide_access_hide('="metering.result=\'ALLOW_ACCESS\'"', '', 'amp-ad, amp-embed');
  else {
    let paywall = document.querySelector('div#pcl-rest-content[style]');
    if (paywall)
      paywall.removeAttribute('style');
    let register = document.querySelector('div#app-pcl');
    let ads = document.querySelectorAll('div[class^="adsbox"]');
    removeDOMElement(register, ...ads);
  }
}

else if (matchDomain('indiatoday.in')) {
  if (window.location.pathname.match(/(\/amp)?\/magazine\//)) {
    let url = window.location.href;
    if (!url.includes('/amp/')) {
      let paywall = document.querySelector('#csc-paywall');
      let amphtml = document.querySelector('link[rel="amphtml"]');
      if (paywall && amphtml) {
        removeDOMElement(paywall);
        window.location.href = amphtml.href;
      }
    } else {
      amp_unhide_access_hide('="granted"', '="NOT NOT granted"', 'amp-ad, amp-embed');
    }
  } else
    csDoneOnce = true;
}

else if (matchDomain('infzm.com')) {
  let url = window.location.href;
  if (url.includes('/wap/#/')) {
    let container = document.querySelector('section.container');
    if (container)
      container.classList.remove('container');
    let overlay = document.querySelector('div.article-content[style]');
    if (overlay)
      overlay.removeAttribute('style');
  }
}

else if (matchDomain('inkl.com')) {
  // plus code in contentScript_once.js
}

else if (matchDomain('ipolitics.ca')) {
  let login = document.querySelector('div.login');
  if (login) {
    removeDOMElement(login);
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script && dompurify_loaded) {
      let json = JSON.parse(json_script.innerText);
      if (json && json.props.pageProps.post.content) {
        let article_new = json.props.pageProps.post.content;
        let article = document.querySelector('.post-header');
        if (article) {
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(article_new) + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          article.appendChild(content_new);
        }
      }
    }
  }
}

else if (matchDomain('jpost.com')) {
  let premium_banners = document.querySelectorAll('.hide-for-premium, #hiddenPremiumForm, #hiddenLink');
  removeDOMElement(...premium_banners);
}

else if (matchDomain(['latimes.com', 'sandiegouniontribune.com'])) {
  if (window.location.search.startsWith('?_amp=true')) {
    amp_unhide_subscr_section('amp-ad, [class*="-ad-wrapper"]');
  } else {
    window.setTimeout(function () {
      let metering_bottompanel = document.querySelector('metering-bottompanel');
      removeDOMElement(metering_bottompanel);
    }, 500);
  }
}

else if (matchDomain('law360.com')) {
  window.setTimeout(function () {
    let modal = document.querySelectorAll('div#NewsletterModal, div.modal-backdrop');
    removeDOMElement(...modal);
  }, 500);
}

else if (matchDomain('livelaw.in')) {
  let paywall = document.querySelector('div.restricted_message');
  if (paywall) {
    let intro = paywall.querySelectorAll('div.story, div#subscription_paid_message');
    removeDOMElement(...intro);
    paywall.classList.remove('restricted_message');
    let paywall_content = document.querySelector('div.paywall-content.hide');
    if (paywall_content)
      paywall_content.classList.remove('hide');
  }
}

else if (matchDomain('livemint.com')) {
  if (window.location.pathname.includes('/amp-')) {
    let paywall = document.querySelectorAll('[amp-access="NOT subscribed"]');
    removeDOMElement(...paywall);
  }
}

else if (matchDomain('magazine.atavist.com')) {
  let bottom_notification = document.querySelector('div.bottom-notification');
  let overlay = document.querySelector('div.notification-overlay');
  removeDOMElement(bottom_notification, overlay);
  let paywall = document.querySelector('body.paywall-notification-visible');
  if (paywall)
    paywall.classList.remove('paywall-notification-visible');
}

else if (matchDomain('marketwatch.com')) {
  let premium = document.querySelector('html.is-paywall');
  let url = window.location.href;
  if (!url.includes('/amp/')) {
    if (premium) {
      premium.classList.remove('is-paywall');
      window.location.href = url.replace('.marketwatch.com/', '.marketwatch.com/amp/');
    }
  } else {
    let meter = document.querySelector('div.meter');
    let container_sponsored = document.querySelector('div.container--sponsored');
    removeDOMElement(meter, container_sponsored);
    amp_unhide_subscr_section('.display-ad');
  }
  let ads = document.querySelectorAll('div.element--ad, div.j-ad');
  removeDOMElement(...ads);
}

else if (matchDomain('medianama.com')) {
  window.setTimeout(function () {
    let modal = document.querySelector('div.modal');
    removeDOMElement(modal);
  }, 500);
  function medianama_height(node) {
    node.removeAttribute('style');
  }
  waitDOMAttribute('div.zox-post-body', 'DIV', 'style', medianama_height, true);
  csDoneOnce = true;
}

else if (matchDomain('mid-day.com')) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_access_hide('="granted"', '="NOT granted"', 'amp-ad, amp-embed, [class*="BannerAd"]');
  } else {
    let paywall = document.querySelector('div#widget-_csc');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    } else {
      let read_more = document.querySelector('#read-more-my');
      if (read_more)
        read_more.click();
    }
  }
}

else if (matchDomain('nation.africa')) {
  let datawall_content = document.querySelector('.datawall-content');
  if (datawall_content)
    datawall_content.classList.remove('datawall-content');
  let div_hidden = document.querySelectorAll('[data="datawall-content"]');
  for (let elem of div_hidden)
    elem.removeAttribute('style');
  let hidden_images = document.querySelectorAll('img.lazy-img:not([src])[data-srcset]');
  for (let hidden_image of hidden_images) {
    hidden_image.classList.remove('lazy-img');
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-srcset').split(',')[1].split(' ')[0]);
  }
}

else if (matchDomain('nationalgeographic.com')) {
  // plus code in contentScript_once.js
  let url = window.location.href;
  let subscribed = document.querySelector('.Article__Content--gated');
  let overlay = document.querySelector('.Article__Content__Overlay--gated');
  let msg = document.querySelector('div#bpc_archive');
  if (subscribed && !msg) {
    subscribed.appendChild(archiveLink(url));
    subscribed.setAttribute('style', 'overflow: visible !important;');
    if (overlay)
      overlay.classList.remove('Article__Content__Overlay--gated');
  }
  let ads = document.querySelectorAll('div.ad-slot');
  removeDOMElement(...ads);
}

else if (matchDomain('nationalreview.com')) {
  let url = window.location.href.split('?')[0];
  if (!url.includes('/amp/')) {
    let continue_reading = document.querySelector('div.continue-reading');
    if (continue_reading) {
      removeDOMElement(continue_reading);
      window.location.href = url + 'amp';
    }
  }
  let adverts = document.querySelectorAll('amp-ad, .ad-unit--center, amp-connatix-player');
  removeDOMElement(...adverts);
}

else if (matchDomain('newleftreview.org')) {
  window.setTimeout(function () {
    let url = window.location.href;
    let paywall = document.querySelector('div.promo-wrapper');
    if (paywall) {
      removeDOMElement(paywall);
      let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url;
      replaceDomElementExt(url_cache, true, false, 'div.article-page');
    }
  }, 500);
}

else if (matchDomain('newrepublic.com')) {
  let pw_popups = document.querySelector('div#pwPopups');
  let ads = document.querySelectorAll('.ad-unit, .ad-container');
  removeDOMElement(pw_popups, ...ads);
}

else if (matchDomain('newsday.com')) {
  if (window.location.pathname.startsWith('/amp/')) {
    amp_unhide_access_hide('="AccessLevel = \'Full Content Access\' OR Error = true"', '="AccessLevel = \'Page View Limit\'"');
  }
}

else if (matchDomain(['nola.com', 'theadvocate.com'])) {
  if (window.location.pathname.endsWith('.amp.html')) {
    let body_hidden = document.querySelector('.site-container');
    if (body_hidden)
      body_hidden.setAttribute('style', 'display:block;');
  }
}

else if (matchDomain('nzherald.co.nz')) {
  // plus code in contentScript_once.js
  let article_content = document.querySelector('.article__content');
  if (article_content) {
    let premium = document.querySelector('span.ellipsis');
    if (premium && dompurify_loaded) {
      premium.classList.remove('ellipsis');
      let article_offer = document.querySelector('.article-offer');
      removeDOMElement(article_offer);
      let css_selector = article_content.querySelectorAll('p[style]')[1].getAttribute('class');
      let hidden_not_pars = article_content.querySelectorAll('.' + css_selector + ':not(p)');
      for (let hidden_not_par of hidden_not_pars) {
        hidden_not_par.classList.remove(css_selector);
        hidden_not_par.removeAttribute('style');
      }
      let hidden_pars = article_content.querySelectorAll('p.' + css_selector);
      let par_html, par_dom;
      let parser = new DOMParser();
      for (let hidden_par of hidden_pars) {
        let par_html = parser.parseFromString('<div style="margin: 10px 0px; font-size: 17px">' + DOMPurify.sanitize(hidden_par.innerHTML) + '</div>', 'text/html');
        let par_dom = par_html.querySelector('div');
        article_content.insertBefore(par_dom, hidden_par);
      }
      let first_span = document.querySelector('p > span');
      if (first_span)
        first_span.removeAttribute('class');
    }
  }
  let premium_toaster = document.querySelector('#premium-toaster');
  removeDOMElement(premium_toaster);
}

else if (matchDomain('nybooks.com')) {
  let paywall_article = document.querySelector('.paywall-article');
  if (paywall_article)
    paywall_article.classList.remove('paywall-article');
  let banner = document.querySelector('div.toast-cta');
  removeDOMElement(banner);
}

else if (matchDomain('nytimes.com')) {
  function nyt_main() {
    navigator.storage.estimate = undefined;
    webkitRequestFileSystem = function () {};
  }
  insert_script(nyt_main);
  let preview_button = document.querySelector('.css-3s1ce0');
  if (preview_button)
    preview_button.click();
  if (window.location.hostname === 'cooking.nytimes.com') {
    let no_scroll = document.querySelectorAll('.nytc---modal-window---noScroll');
    for (let elem of no_scroll)
      elem.classList.remove('nytc---modal-window---noScroll');
    let login = document.querySelector('.nytc---modal-window---isShown');
    if (login) {
      let close_button = login.querySelector('span[aria-label="close"]');
      if (!close_button)
        login.classList.remove('nytc---modal-window---isShown');
    }
  } else {
    waitDOMElement('div[data-testid="inline-message"]', 'DIV', removeDOMElement, false);
    waitDOMElement('div.expanded-dock', 'DIV', removeDOMElement, false);
    csDoneOnce = true;
  }
}

else if (matchDomain('quora.com')) {
  let overlays = document.querySelectorAll('div[class*="_overlay"]');
  removeDOMElement(...overlays);
  let mask_image = document.querySelector('div.ePDXbR');
  if (mask_image)
    mask_image.classList.remove('ePDXbR');
}

else if (matchDomain('qz.com')) {
  let url = window.location.href;
  window.setTimeout(function () {
    if (url.includes('utm_source='))
      window.location.href = url.split('?')[0];
  }, 500);
  let paywall = document.querySelector('div.KbD9m');
  let overflow = document.querySelector('div._7S-qA');
  let msg = document.querySelector('div#bpc_archive');
  if (paywall && !msg) {
    if (overflow)
      overflow.classList.remove('_7S-qA');
    let article = document.querySelector('div#article-content');
    if (article)
      article.appendChild(archiveLink(url));
  }
}

else if (matchDomain('rugbypass.com')) {
  if (window.location.pathname.startsWith('/plus/')) {
    let paywall = document.querySelector('.premium-fold-bottom');
    if (paywall) {
      paywall.classList.remove('premium-fold-bottom');
      let offer = document.querySelector('.plus-article-offer');
      removeDOMElement(offer);
      let fade = document.querySelector('.fade');
      if (fade)
        fade.classList.remove('fade');
    }
  } else
    csDoneOnce = true;
}

else if (matchDomain('science.org')) {
  let paywall = document.querySelector('div.alert-read-limit');
  removeDOMElement(paywall);
  let overlay = document.querySelector('body.alert-read-limit__overlay');
  if (overlay)
    overlay.classList.remove('alert-read-limit__overlay');
}

else if (matchDomain('scmp.com')) {
  if (window.location.href.includes('/amp.')) {
    let div_hidden = document.querySelectorAll('div.article-body[amp-access][amp-access-hide]');
    for (let elem of div_hidden)
      elem.removeAttribute('amp-access-hide');
    let default_meters = document.querySelectorAll('div.default-meter, div#archive-article-meter');
    let adverts = document.querySelectorAll('amp-ad, div.ad-banner, div.advert-fly-carpet-container, div.inline-advert');
    removeDOMElement(...default_meters, ...adverts);
  } else
    csDoneOnce = true;
}

else if (matchDomain('scribd.com')) {
  let blurred_pages = document.querySelectorAll('.blurred_page');
  for (let blurred_page of blurred_pages) {
    blurred_page.classList.remove('blurred_page');
  }
  let portal = document.querySelector('.between_page_portal_root');
  let page_module = document.querySelector('.between_page_module');
  let promo = document.querySelector('.auto__doc_page_webpack_doc_page_body_static_promo_study');
  let ad = document.querySelector('.auto__explain_scribd_v2_advertisement');
  removeDOMElement(portal, page_module, promo, ad);
}

else if (matchDomain('seekingalpha.com')) {
  let url = window.location.href;
  let locked = document.querySelector('div[data-test-id="post-locked-banner"]');
  if (locked && !url.includes('/amp/')) {
    window.setTimeout(function () {
      window.location.href = url.replace('seekingalpha.com/', 'seekingalpha.com/amp/');
    }, 500);
  } else if (url.includes('/amp/')) {
    amp_unhide_access_hide('*="premium_access OR"', '', '.ad-wrap');
    let paywall = document.querySelector('[class*="paywall-container"]');
    removeDOMElement(paywall);
  }
}

else if (matchDomain('slate.com')) {
  let slate_roadblock = document.querySelector('.slate-roadblock');
  let ads = document.querySelectorAll('section[class*="-ad"]');
  removeDOMElement(slate_roadblock, ...ads);
}

else if (matchDomain('sloanreview.mit.edu')) {
  let paywall = document.querySelector('div.paywall-blinder');
  removeDOMElement(paywall);
  if (paywall) {
    ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
    csDoneOnce = true;
  }
}

else if (matchDomain('sofrep.com')) {
  let banners = document.querySelectorAll('#scrollerCTA, #botCta');
  removeDOMElement(...banners);
}

else if (matchDomain('spglobal.com')) {
  let overlay = document.querySelector('.article__overlay');
  removeDOMElement(overlay);
  let html_noscroll = document.querySelector('html[class]');
  if (html_noscroll)
    html_noscroll.removeAttribute('class');
}

else if (matchDomain('staradvertiser.com')) {
  let url = window.location.href.split('?')[0];
  if (url.endsWith('/amp/')) {
    amp_unhide_subscr_section();
  } else {
    let paywall = document.querySelector('div#hsa-paywall-overlay');
    if (paywall) {
      removeDOMElement(paywall);
      let div_hidden = document.querySelector('div#hsa-paywall-content[style]');
      if (div_hidden)
        div_hidden.removeAttribute('style');
    }
  }
}

else if (matchDomain('startribune.com')) {
  let ads = document.querySelectorAll('div.ad-placeholder');
  removeDOMElement(...ads);
}

else if (matchDomain('stocknews.com')) {
  let hideme = document.querySelector('div#hideme');
  removeDOMElement(hideme);
  let blurmes = document.querySelectorAll('div[id^="blurme"]');
  for (let i = 0; i < blurmes.length; i++)
    blurmes[i].setAttribute('id', 'blurmenot' + i);
}

else if (matchDomain('stratfor.com')) {
  let banner = document.querySelector('.free-cta-container, .paywall-banner');
  removeDOMElement(banner);
  let hidden_images = document.querySelectorAll('img[src^="data:image/gif"][data-src]');
  for (let hidden_image of hidden_images)
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
  let url = window.location.href.split('?')[0];
  if (url.match(/(\/(\d){4}-([a-z]|-)+-forecast(-([a-z]|-)+)?|-forecast-(\d){4}-([a-z]|[0-9]|-)+)$/)) {
    let json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script && dompurify_loaded) {
      let json = JSON.parse(json_script.innerText);
      if (json && json.props.pageProps.data) {
        let overview_div = document.querySelector('div[class^="overview_overview__"] > div');
        if (overview_div) {
          let data = json.props.pageProps.data;
          let parser = new DOMParser();
          let data_overview = data.overview;
          if (!parseHtmlEntities(data_overview).includes(data.teaser_body))
            data_overview = '<p>' + data.teaser_body + '</p>' + data_overview;
          let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(data_overview + '<p><h2>Sections</h2></p>') + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          let sections = data.section;
          for (let section of sections) {
            let section_link = document.createElement('a');
            section_link.innerText = section.title;
            section_link.href = 'https://' + window.location.hostname + '/' + section.path_alias;
            content_new.appendChild(section_link);
            content_new.appendChild(document.createElement('br'));
          }
          overview_div.parentNode.replaceChild(content_new, overview_div);
          csDoneOnce = true;
        }
      }
    }
    waitDOMElement('div.paywall-banner', 'DIV', removeDOMElement, false);
  } else if (url.match(/\/article\/.+-forecast(-.+)?\//)) {
    let next_section_buttons = document.querySelectorAll('div[class^="nextSection_nextSection__"] > button');
    for (let elem of next_section_buttons) {
      let section_link = document.createElement('a');
      section_link.innerText = elem.innerText;
      section_link.href = url.replace(/[^\/]+$/, '') + elem.innerText.split(': ')[1].toLowerCase().split(' ').filter(x => !['a', 'an', 'of', 'the'].includes(x)).join('-');
      elem.parentNode.replaceChild(section_link, elem);
    }
  }
}

else if (matchDomain('study.com')) {
  let faded_content = document.querySelector('div.faded-content');
  if (faded_content)
    faded_content.removeAttribute('class');
  let div_hidden = document.querySelector('div.hidden[ng-non-bindable]');
  if (div_hidden)
    div_hidden.removeAttribute('class');
}

else if (matchDomain('techinasia.com')) {
  let paywall = document.querySelector('.paywall-content');
  if (paywall && dompurify_loaded) {
    paywall.classList.remove('paywall-content');
    let url = window.location.href;
    let url_xhr = url.replace('.com/', '.com/wp-json/techinasia/2.0/posts/').replace('/visual-story/', '/');
    fetch(url_xhr)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          let json_text = json.posts[0].content;
          json_text = json_text.replace(/width\=\"(\d){3,}\"/g, 'width="100%"').replace(/height\=\"(\d){3,}\"/g, 'height="100%"');
          let content = document.querySelector('div.content');
          if (json_text && content) {
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div class="jsx-1794864983 content">' + DOMPurify.sanitize(json_text) + '</div>', 'text/html');
            let content_new = doc.querySelector('div.content');
            content.parentNode.replaceChild(content_new, content);
          }
        });
      }
    });
  }
  let splash_subscribe = document.querySelector('.splash-subscribe');
  let paywall_hard = document.querySelector('.paywall-hard');
  removeDOMElement(splash_subscribe, paywall_hard);
}

else if (matchDomain('the-american-interest.com')) {
  let counter = document.getElementById('article-counter');
  removeDOMElement(counter);
}

else if (matchDomain('theatlantic.com')) {
  let banner = document.querySelector('.c-nudge__container,.c-non-metered-nudge');
  removeDOMElement(banner);
}

else if (matchDomain('thedailybeast.com')) {
  let paywall = document.querySelector('div.Body__paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = document.querySelector('script[displayName="initialState"]');
    if (json_script) {
      let json_str = json_script.text.substring(json_script.textContent.indexOf('{'));
      try {
        let json = JSON.parse(json_str);
        if (json.body) {
          let pars = json.body.sections;
          let cards = json.body.cards;
          if (pars) {
            let mobile_doc = document.querySelector('div.Mobiledoc');
            if (mobile_doc) {
              let mobile_doc_text = mobile_doc.innerText.replace(/(\r|\n)/g, '');
              for (let elem of pars) {
                let par_elem = '';
                if (elem[0] === 1) {
                  if (elem[1] === 'p') {
                    let par = '';
                    for (let part of elem[2])
                      par += part[3];
                    if (par && !mobile_doc_text.includes(par)) {
                      par_elem = document.createElement('p');
                      par_elem.innerText = par;
                    }
                  }
                } else if (elem[0] === 10) {
                  if (cards && cards[elem[1]]) {
                    let card = cards[elem[1]];
                    if (card[0] === 'pt-image') {
                      par_elem = document.createElement('p');
                      let par_fig = document.createElement('figure');
                      let par_img = document.createElement('img');
                      par_img.src = card[1].url;
                      par_fig.appendChild(par_img);
                      par_elem.appendChild(par_fig);
                      let par_cap = document.createElement('figcaption');
                      par_cap.innerText = card[1].title + ' ' + card[1].credit;
                      par_elem.appendChild(par_cap);
                    } else if (card[0] === 'pt-fancy-links-card') {
                      par_elem = document.createElement('p');
                      let par_link = document.createElement('a');
                      par_link.href = card[1].links;
                      par_link.innerText = card[1].linksData[0].long_headline;
                      par_elem.appendChild(par_link);
                    }
                  }
                }
                if (par_elem)
                  mobile_doc.appendChild(par_elem);
              }
            }
          }
        }
        csDoneOnce = true;
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('thediplomat.com')) {
  let preview = document.querySelector('.dpl-preview');
  if (preview)
    preview.classList.remove('dpl-preview');
}

else if (matchDomain('theglobeandmail.com')) {
  let article_body_subscribed = document.querySelector('.c-article-body--subscribed');
  if (article_body_subscribed)
    article_body_subscribed.removeAttribute('class');
}

else if (matchDomain(['thehindu.com', 'thehindubusinessline.com'])) {
  if (!localStorage.geo) {
    localStorage.setItem("geo", '{"v":{"clientTcpRtt":20,"longitude":"' + makeRandomNumber(2) + '.' + makeRandomNumber(5) + '","httpProtocol":"HTTP/2","tlsCipher":"AEAD-AES128-GCM-SHA256","continent":"EU","asn":1234,"clientAcceptEncoding":"gzip, deflate,br","country":"UK","isEUCountry":"1","tlsClientAuth":{"certIssuerDNLegacy":"","certIssuerDN":"","certIssuerDNRFC2253":"","certSubjectDNLegacy":"","certVerified":"NONE","certNotAfter":"","certSubjectDN":"","certFingerprintSHA1":"","certNotBefore":"","certSerial":"","certPresented":"0","certSubjectDNRFC2253":""},"tlsVersion":"TLSv1.3","colo":"DUS","timezone":"Europe/London","edgeRequestKeepAliveStatus":1,"requestPriority":"weight=220;exclusive=1","botManagement":{"staticResource":false,"verifiedBot":false,"score":99},"clientTrustScore":99,"postalCode":"' + makeRandomNumber(4) + '","regionCode":"QR","region":"County","city":"London","latitude":"' + makeRandomNumber(2) + '.' + makeRandomNumber(5) + '"},"e":' + makeRandomNumber(13) + '}');
  }
  let counter = document.querySelector('#test');
  removeDOMElement(counter);
  function hindu_main() {
    document.addEventListener('bpc_event', function (e) {
      if (window) {
        window.Adblock = false;
        window.isNonSubcribed = false;
      }
    })
  }
  insert_script(hindu_main);
  document.dispatchEvent(new CustomEvent('bpc_event', {}));
}

else if (matchDomain('thenewatlantis.com')) {
  let article_gated = document.querySelector('.article-gated');
  if (article_gated)
    article_gated.classList.remove('article-gated');
}

else if (matchDomain('thepointmag.com')) {
  let overlay = document.querySelectorAll('div.overlay, div#tpopup-');
  for (let elem of overlay)
    removeDOMElement(elem);
}

else if (matchDomain('thewrap.com')) {
  let paywall = document.querySelector('.wrappro-paywall');
  if (paywall)
    paywall.classList.remove('wrappro-paywall');
}

else if (matchDomain('time.com')) {
  let body = document.querySelector('body');
  if (body)
    body.setAttribute('style', 'position:relative !important;');
}

else if (matchDomain('timeshighereducation.com')) {
  let paywall_cta = document.querySelector('div.paywall-cta');
  if (paywall_cta) {
    paywall_cta.removeAttribute('style');
    let hidden_divs = document.querySelectorAll('div[style="display: none;"]');
    for (let hidden_div of hidden_divs)
      hidden_div.removeAttribute('style');
    let paywall_fade = document.querySelector('div.paywall-fade');
    if (paywall_fade)
      paywall_fade.classList.remove('paywall-fade');
  }
  let hidden_images = document.querySelectorAll('img.b-lazy[src^="data:image/"][data-src]');
  for (let hidden_image of hidden_images) {
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
    hidden_image.classList.remove('b-lazy');
    hidden_image.parentElement.classList.remove('media--loading');
  }
  let ads = document.querySelectorAll('div[id^="div-gpt-in-article-ad-"], div[class^="the-dfp__in-article-ATD"]');
  removeDOMElement(...ads);
}

else if (matchDomain(timesofindia_domains)) {
  let region_block = document.querySelector('div.plan-popup.active');
  if (region_block) {
    removeDOMElement(region_block);
    let overflow = document.querySelector('html[style]');
    if (overflow)
      overflow.removeAttribute('style');
  }
  if (window.location.pathname.includes('/amp_')) {
    let paywall = document.querySelector('div.paywall');
    if (paywall && dompurify_loaded) {
      let contentblocker = document.querySelector('div#contentblocker');
      removeDOMElement(contentblocker);
      let preview = document.querySelector('div.article-txt');
      if (preview) {
        let parser = new DOMParser();
        let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(paywall.innerHTML, {ADD_TAGS: ['amp-img']}) + '</div>', 'text/html');
        let article = doc.querySelector('div');
        preview.parentNode.replaceChild(article, preview);
        preview.classList.remove('prime-bottom-blur');
      }
    }
    let amp_images = document.querySelectorAll('div.inline-imgecontent > amp-img');
    for (let amp_img of amp_images) {
      let img_new = document.createElement('img');
      img_new.src = amp_img.getAttribute('src');
      amp_img.parentNode.replaceChild(img_new, amp_img);
      img_new.parentElement.classList.remove('inline-imgecontent');
      img_new.parentElement.style = 'text-align: center;';
    }
  }
}

else if (matchDomain(no_nhst_media_domains)) {
  let url = window.location.href;
  if (url.includes('.tradewinds.com/markets/')) {
    let paywall = document.querySelector('iframe[src]');
    removeDOMElement(paywall);
    let overflow = document.querySelector('body[style]');
    if (overflow)
      overflow.removeAttribute('style');
    let blurred = document.querySelector('body > div[style]');
    if (blurred)
      blurred.removeAttribute('style');
  } else {
    window.setTimeout(function () {
      let paywall = document.querySelector('iframe#paywall-iframe');
      if (paywall && dompurify_loaded) {
        let article = paywall.parentNode;
        removeDOMElement(paywall);
        fetch(url)
        .then(response => {
          if (response.ok) {
            response.text().then(html => {
              let split1 = html.split('window.__INITIAL_STATE__=')[1];
              let state = (split1.split('};')[0] + '}').split('</script>')[0];
              if (state) {
                let json = JSON.parse(state);
                if (json) {
                  let json_text = json.article.body;
                  let parser = new DOMParser();
                  let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(json_text, {ADD_ATTR: ['itemprop'], ADD_TAGS: ['link']}) + '</div>', 'text/html');
                  let article_new = doc.querySelector('div');
                  if (article_new) {
                    if (article)
                      article.appendChild(article_new);
                  }
                }
              }
            })
          }
        })
      }
    }, 500);
  }
}

else if (matchDomain(usa_conde_nast_domains)) {
  if (window.location.pathname.endsWith('/amp')) {
    amp_unhide_subscr_section('amp-ad, amp-embed, .ad');
  } else {
    let paywall_bar = document.querySelector('.paywall-bar');
    removeDOMElement(paywall_bar);
  }
}

else if (matchDomain(usa_craincomm_domains)) {
  let body_hidden = document.querySelector('body[class]');
  if (body_hidden)
    body_hidden.removeAttribute('class');
  let lazy_images = document.querySelectorAll('img.lazy[data-src]');
  for (let lazy_image of lazy_images) {
    lazy_image.src = lazy_image.getAttribute('data-src');
    lazy_image.removeAttribute('class');
  }
  let lazy_sources = document.querySelectorAll('source[srcset^="data:image"]');
  removeDOMElement(...lazy_sources);
}

else if (matchDomain(usa_outside_mag_domains)) {
  let paywall = document.querySelector('div.o-membership-overlay');
  if (paywall) {
    let is_gated = document.querySelectorAll('[class*="is-gated"]');
    for (let elem of is_gated)
      removeClassesByPrefix(elem, 'is-gated');
    removeDOMElement(paywall);
  }
  if (matchDomain('cyclingtips.com')) {
    let ads = document.querySelectorAll('div[data-block-name="ads"], div#takeover');
    removeDOMElement(...ads);
  }
}

else if (matchDomain(usa_tribune_domains)) {
  let overlay = document.querySelector('div#zephr-overlay');
  removeDOMElement(overlay);
}

else if (matchDomain('usatoday.com')) {
  if (window.location.hostname.startsWith('amp.')) {
    amp_unhide_access_hide('="gup.hasAssetAccess"', '', 'div[class*="ad-"]');
  } else {
    let roadblock = document.querySelector('.roadblock-container');
    if (roadblock) {
      removeDOMElement(roadblock);
      article_next = document.querySelector('article.next-in-depth-story > div.article-inner');
      if (article_next) {
        let url = article_next.getAttribute('data-url');
        let weblink = document.createElement('a');
        weblink.href = url;
        weblink.innerText = 'open next in-depth story';
        article_next.appendChild(weblink);
      }
    }
  }
}

else if (matchDomain('venturebeat.com')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div.paywall');
    if (paywall)
      paywall.classList.remove('paywall');
  }, 500);
}

else if (matchDomain('washingtonpost.com')) {
  let leaderboard = document.querySelector('#leaderboard-wrapper');
  let adverts = document.querySelectorAll('div[data-qa$="-ad"]');
  removeDOMElement(leaderboard, ...adverts);
}

else if (matchDomain('winnipegfreepress.com')) {
  let paywall = document.querySelector('.paidaccess');
  if (paywall) {
    paywall.classList.remove('paidaccess');
    let teaser = document.querySelector('#paywall-teaser');
    removeDOMElement(teaser);
  }
  let ads = document.querySelectorAll('.billboard-ad-space, .ad, .article-ad, .fixed-sky');
  removeDOMElement(...ads);
}

else if (matchDomain('wsj.com')) {
  let url = window.location.href;
  if (location.href.includes('/articles/')) {
    let close_button = document.querySelector('div.close-btn[role="button"]');
    if (close_button)
      close_button.click();
  }
  let wsj_ads = document.querySelectorAll('div[class*="wsj-ad"], div[class*="BodyAdWrapper"]');
  removeDOMElement(...wsj_ads);
  if (url.includes('/amp/')) {
    let masthead_link = document.querySelector('div.masthead > a[href*="/articles/"]');
    if (masthead_link)
      masthead_link.href = 'https://www.wsj.com';
    amp_unhide_subscr_section();
  } else {
    let snippet = document.querySelector('.snippet-promotion');
    let wsj_pro = document.querySelector('meta[name="page.site"][content="wsjpro"]');
    if (snippet || wsj_pro) {
      removeDOMElement(snippet, wsj_pro);
      window.location.href = url.replace('wsj.com', 'wsj.com/amp');
    }
  }
}

else if (matchDomain(usa_lee_ent_domains) || (window.location.pathname.endsWith('.amp.html') && document.querySelector('div.site-copyright>p> a[href^="https://bloxcms.com"]'))) {
  if (window.location.pathname.endsWith('.amp.html')) {
    amp_unhide_access_hide('="hasAccess"', '="NOT hasAccess"');
    let elem_hidden = document.querySelectorAll('html[class], body[class]');
    for (let elem of elem_hidden)
      elem.removeAttribute('class');
  }
}

else if ((domain = matchDomain(usa_mcc_domains)) || document.querySelector('script[src^="https://media.mcclatchyinteractive.com/"]') || (window.location.href.match(/\/\/amp\..+\.com\/(.+\/)?article(\d){8,}\.html/) && document.querySelector('a[href^="https://classifieds.mcclatchy.com/"]'))) {
  if (!domain)
    domain = document.domain.replace(/(account|amp)\./, '');
  let url = window.location.href;
  if (url.includes('account.' + domain + '/paywall/')) {
    window.setTimeout(function () {
      window.location.href = 'https://amp.' + domain + '/article' + url.split('resume=')[1].split(/[#&]/)[0] + '.html';
    }, 500);
  } else if (url.includes('amp.' + domain + '/')) {
    amp_unhide_subscr_section();
    let subscr_tag = document.querySelector('div#subscriber-exclusive-tag');
    let amp_players = document.querySelectorAll('amp-connatix-player');
    removeDOMElement(subscr_tag, ...amp_players);
  }
  let premium_svgs = document.querySelectorAll('h3 > a > svg');
  let premium_link;
  for (let premium_svg of premium_svgs) {
    premium_link = premium_svg.parentElement;
    if (premium_link.href.includes('www.'))
      premium_link.href = premium_link.href.replace('www.', 'amp.');
  }
}

else if (matchDomain(usa_mng_domains) || (window.location.href.match(/\.com\/(\d){4}\/(\d){2}\/(\d){2}\/.+\/amp\//) && document.querySelector('amp-img#paywall[src*=".com/wp-content/plugins/dfm-amp-mods/"]'))) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  }
}

else
  csDone = true;
}

if ((csDone && (bg2csData !== undefined)) || csDoneOnce) {
  addDivBpcDone();
  if (csDone && (bg2csData !== undefined) && !bg2csData.amp_unhide)
    ext_api.runtime.sendMessage({csDone: true});
}

} // end div_bpc_done

// General Functions
function removeDOMElement(...elements) {
  for (let element of elements) {
    if (element)
      element.remove();
  }
}

function waitDOMElement(selector, tagName = '', callback, multiple = false) {
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (!tagName || (node.tagName === tagName)) {
          if (node.matches(selector)) {
            callback(node);
            if (!multiple)
              this.disconnect();
          }
        }
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true
  });
}

function waitDOMAttribute(selector, tagName = '', attributeName = '', callback, multiple = false) {
  let targetNode = document.querySelector(selector);
  if (!targetNode)
    return;
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.target.attributes[attributeName]) {
        callback(mutation.target);
        if (!multiple)
          this.disconnect();
      }
    }
  }).observe(targetNode, {
    attributes: true,
    attributeFilter: [attributeName]
  });
}

function addDivBpcDone() {
  let div_bpc_new = document.createElement('div');
  div_bpc_new.setAttribute('id', 'bpc_done');
  div_bpc_new.setAttribute('style', 'display: none;');
  let insertAfter = (document.body || document.head || document.documentElement);
  insertAfter.appendChild(div_bpc_new);
}

function matchDomain(domains, hostname = window.location.hostname) {
  let matched_domain = false;
  if (typeof domains === 'string')
    domains = [domains];
  domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matched_domain = domain));
  return matched_domain;
}

function replaceDomElementExt(url, proxy, base64, selector, text_fail = '', selector_source = selector) {
  let proxyurl = proxy ? 'https://bpc-cors-anywhere.herokuapp.com/' : '';
  fetch(proxyurl + url, {headers: {"Content-Type": "text/plain", "X-Requested-With": "XMLHttpRequest"} })
  .then(response => {
    let article = document.querySelector(selector);
    if (response.ok) {
      response.text().then(html => {
        if (base64) {
          html = decode_utf8(atob(html));
          selector_source = 'body';
        }
        let parser = new DOMParser();
        let doc = parser.parseFromString(DOMPurify.sanitize(html, {ADD_ATTR: ['layout'], ADD_TAGS: ['amp-img']}), 'text/html');
        //console.log(DOMPurify.removed);
        let article_new = doc.querySelector(selector_source);
        if (article_new) {
          if (article && article.parentNode)
            article.parentNode.replaceChild(article_new, article);
        }
      });
    } else {
      if (!text_fail) {
        if (url.includes('webcache.googleusercontent.com'))
          text_fail = 'BPC > failed to load from Google webcache: '
      }
      if (text_fail && article) {
        let text_fail_div = document.createElement('div');
        text_fail_div.setAttribute('style', 'margin: 0px 50px; font-weight: bold; color: red;');
        text_fail_div.appendChild(document.createTextNode(text_fail));
        if (proxy) {
          let a_link = document.createElement('a');
          a_link.innerText = url;
          a_link.href = url;
          a_link.target = '_blank';
          text_fail_div.appendChild(a_link);
        }
        article.insertBefore(text_fail_div, article.firstChild);
      }
    }
  }).catch(function (err) {
    false;
  });
}

function archiveLink(url) {
  let text_fail_div = document.createElement('div');
  text_fail_div.id = 'bpc_archive';
  text_fail_div.setAttribute('style', 'margin: 20px; font-weight: bold; color:red;');
  text_fail_div.appendChild(document.createTextNode('BPC > Full article text:\r\n'));
  function add_links(domains) {
    for (let domain of domains) {
      let a_link = document.createElement('a');
      a_link.innerText = domain;
      a_link.href = 'https://' + domain + '?run=1&url=' + url.split('?')[0];
      a_link.target = '_blank';
      text_fail_div.appendChild(document.createTextNode(' | '));
      text_fail_div.appendChild(a_link);
    }
  }
  add_links(['archive.today', 'archive.is']);
  return text_fail_div;
}

function removeClassesByPrefix(el, prefix) {
  let el_classes = el.classList;
  for (let el_class of el_classes) {
    if (el_class.startsWith(prefix))
      el_classes.remove(el_class);
  }
}

function cookieExists(name) {
  return document.cookie.split(';').some(function (item) {
    return item.trim().indexOf(name + '=') === 0
  })
}

function setCookie(name, value, domain, path, days) {
  let max_age = days * 24 * 60 * 60;
  document.cookie = name + "=" + (value || "") + "; domain=" + domain + "; path=" + path + "; max-age=" + max_age;
}

function insert_script(func, insertAfterDom) {
  let bpc_script = document.querySelector('script#bpc_script');
  if (!bpc_script) {
    let script = document.createElement('script');
    script.setAttribute('id', 'bpc_script');
    script.appendChild(document.createTextNode('(' + func + ')();'));
    let insertAfter = insertAfterDom ? insertAfterDom : (document.body || document.head || document.documentElement);
    insertAfter.appendChild(script);
  }
}

function genHexString(len) {
  let output = '';
  for (let i = 0; i < len; i++)
    output += (Math.floor(Math.random() * 16)).toString(16);
  return output;
}

function makeRandomNumber(len) {
  let result = '';
  let characters = '123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < len; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

function pageContains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

function breakText(str) {
  str = str.replace(/(?:^|[A-Za-z\"\“])(\.|\?|!)(?=[A-ZÖÜ\„\d][A-Za-zÀ-ÿ\„\d]{1,})/gm, "$&\n\n");
  str = str.replace(/(([a-z]{2,}|[\"\“]))(?=[A-Z](?=[A-Za-zÀ-ÿ]+))/gm, "$&\n\n");
  // exceptions: names with alternating lower/uppercase (no general fix)
  let str_rep_arr = ['AstraZeneca', 'BaFin', 'BerlHG', 'BfArM', 'BilMoG', 'BioNTech', 'DiGA', 'EuGH', 'FinTechRat', 'GlaxoSmithKline', 'IfSG', 'medRxiv', 'mmHg', 'PlosOne', 'StVO'];
  let str_rep_split,
  str_rep_src;
  for (let str_rep of str_rep_arr) {
    str_rep_split = str_rep.split(/([a-z]+)(?=[A-Z](?=[A-Za-z]+))/);
    str_rep_src = str_rep_split.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue + ((currentValue !== currentValue.toUpperCase()) ? '\n\n' : '');
      });
    if (str_rep_src.endsWith('\n\n'))
      str_rep_src = str_rep_src.slice(0, -2);
    str = str.replace(new RegExp(str_rep_src, "g"), str_rep);
  }
  str = str.replace(/De\n\n([A-Z])/g, "De$1");
  str = str.replace(/La\n\n([A-Z])/g, "La$1");
  str = str.replace(/Le\n\n([A-Z])/g, "Le$1");
  str = str.replace(/Mc\n\n([A-Z])/g, "Mc$1");
  return str;
};

function parseHtmlEntities(encodedString) {
  let translate_re = /&(nbsp|amp|quot|lt|gt|deg|hellip|laquo|raquo|ldquo|rdquo|lsquo|rsquo|mdash);/g;
  let translate = {"nbsp": " ", "amp": "&", "quot": "\"", "lt": "<", "gt": ">", "deg": "°", "hellip": "…",
      "laquo": "«", "raquo": "»", "ldquo": "“", "rdquo": "”", "lsquo": "‘", "rsquo": "’", "mdash": "—"};
  return encodedString.replace(translate_re, function (match, entity) {
      return translate[entity];
  }).replace(/&#(\d+);/gi, function (match, numStr) {
      let num = parseInt(numStr, 10);
      return String.fromCharCode(num);
  });
}

function encode_utf8(str) {
  return unescape(encodeURIComponent(str));
}

function decode_utf8(str) {
  return decodeURIComponent(escape(str));
}
