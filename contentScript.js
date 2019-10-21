window.localStorage.clear();

if (location.hostname.endsWith('rep.repubblica.it')) {
    if (location.href.includes('/pwa/')) {
        location.href = location.href.replace('/pwa/', '/ws/detail/');
    }

    if (location.href.includes('/ws/detail/')) {
        const paywall = document.querySelector('.paywall[subscriptions-section="content"]');
        if (paywall) {
            paywall.removeAttribute('subscriptions-section');
            const preview = document.querySelector('div[subscriptions-section="content-not-granted"]');
            if (preview) {
                preview.remove();
            }
        }
    }
}

if (window.location.href.indexOf("americanbanker.com") !== -1) {
	const paywall = document.getElementsByClassName(
		"embargo-content"
	);
	if (paywall && paywall.length > 0) {
		paywall[0].className = "";
	}
}

if (window.location.href.indexOf('telegraaf.nl') !== -1) {
    const paywall = document.getElementById('TEMPRORARY_METERING_ID');
    if (paywall) {
        window.location.reload(1);
    }
}

if (window.location.href.indexOf('ed.nl') !== -1) {
	let paywall = document.querySelector('.article__component.article__component--paywall-module-notification');
	if (paywall) {
		paywall.remove();
		paywall = null;
	}
}

if (window.location.href.indexOf("washingtonpost.com") !== -1) {
    if (location.href.includes('/gdpr-consent/')) {
        const free_button = document.querySelector('.gdpr-consent-container .continue-btn.button.free');
        if (free_button)
            free_button.click();

        setTimeout(function () {
            const gdprcheckbox = document.querySelector('.gdpr-consent-container .consent-page:not(.hide) #agree');
            if (gdprcheckbox) {
                gdprcheckbox.checked = true;
                gdprcheckbox.dispatchEvent(new Event('change'));

                document.querySelector('.gdpr-consent-container .consent-page:not(.hide) .continue-btn.button.accept-consent').click();
            }
        }, 300); // Delay (in milliseconds)
    }
}

if (window.location.href.indexOf("wsj.com") !== -1) {
    if (location.href.includes('/articles/')) {
        document.querySelector('.close-btn').click();
    }
}

if (window.location.href.indexOf("sloanreview.mit.edu") !== -1) {
    document.querySelector('#cboxClose').click();
}

if (window.location.href.indexOf("mexiconewsdaily.com") !== -1) {
    document.addEventListener('DOMContentLoaded', () => {
        const sideNotification = document.querySelector('.pigeon-widget-prompt');
        const subMessage = document.querySelector('.sub_message_container');
        const popup = document.querySelector('.popupally-pro-outer-full-width-7-fluid_qemskqa');
        const bgFocusRemoverId = document.getElementById('popup-box-pro-gfcr-7');

        removeDOMElement(sideNotification, subMessage, popup, bgFocusRemoverId);
    });
}

if (window.location.href.indexOf("the-american-interest.com") !== -1) {
	let counter = document.getElementById('article-counter') || false;
	if (counter) {
		counter.remove();
		counter = false;
	}
}

if (window.location.href.indexOf("nzherald.co.nz") !== -1) {
	const paywall = document.getElementById(
		"article-content"
	);
	if (paywall) {
		paywall.classList.remove('premium-content');
		paywall.classList.add('full-content');
		var paras = paywall.querySelectorAll("p, span, h2, div");
		var delClass = "";
		for (var i = paras.length; i--;) {
			if (delClass == "") {
				delClass = paras[i].className;
			}
			paras[i].classList.remove(delClass);
			paras[i].removeAttribute('style');
		}
	}
}

if (window.location.href.indexOf("parool.nl") !== -1 || window.location.href.indexOf("trouw.nl") !== -1 || window.location.href.indexOf("volkskrant.nl") !== -1) {
	document.addEventListener('DOMContentLoaded', () => {
		const paywall = document.querySelector('div[data-temptation-position="ARTICLE_BOTTOM"]');
		const hidden_section = document.querySelector('div[data-temptation-position="ARTICLE_INLINE"]');
		removeDOMElement(paywall, hidden_section);
	});
}

if (window.location.href.indexOf("firstthings.com") !== -1) {
    const paywall = document.getElementsByClassName('paywall')[0];

  if (paywall)
        removeDOMElement(paywall);
}

if (window.location.href.indexOf("bloomberg.com") !== -1) {
    document.addEventListener('DOMContentLoaded', () => {
        const paywall = document.getElementById('paywall-banner');
        removeDOMElement(paywall);
    });
}

if (window.location.href.indexOf("bloombergquint.com") !== -1) {
    const articlesLeftModal = document.getElementsByClassName('paywall-meter-module__story-paywall-container__1UgCE')[0];
    const paywall = document.getElementById('paywallDmp');
    removeDOMElement(articlesLeftModal, paywall);
}

if (window.location.href.indexOf('lemonde.fr') !== -1) {
    document.addEventListener('DOMContentLoaded', () => {
		const hidden_section = document.getElementsByClassName('article__content--restricted-media')[0];
		if (hidden_section)
			hidden_section.classList.remove('article__content--restricted-media');
		const longform_article_restricted = document.getElementsByClassName('article__content--restricted')[0];		
		if (longform_article_restricted)
			longform_article_restricted.classList.remove('article__content--restricted');	
		const longform_paywall = document.getElementsByClassName('paywall--longform')[0];		
		if (longform_paywall)
			longform_paywall.classList.remove('paywall--longform');	
        const paywall = document.getElementById('js-paywall-content');
		const friend_paywall = document.getElementsByClassName('friend--paywall')[0];
		const cookie_banner = document.getElementById('cookie-banner');
        removeDOMElement(paywall, friend_paywall, cookie_banner);
    });
}


function removeDOMElement(...elements) {
    for (let element of elements) {
        if (element)
            element.remove();
    }
}