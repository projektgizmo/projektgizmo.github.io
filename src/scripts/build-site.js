const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const template = fs.readFileSync(path.join(root, 'src/templates/home.html'), 'utf8');
const images = [
  ['image3360-xpg-2200h.png', 'Petrochemia', 'Petrochemicals', 'INSPEKCJA', 'INSPECTION', 'Gizmo pomaga monitorować instalacje i wykrywać problemy zanim zatrzymają produkcję.', 'Gizmo helps monitor installations and detect problems before they stop production.'],
  ['rectangle123360-hanq-900h.png', 'Rolnictwo', 'Agriculture', 'ZBIORY', 'HARVESTING', 'Modułowa konstrukcja Gizmo wspiera powtarzalne zadania w uprawach.', 'Gizmo’s modular design supports repetitive tasks in growing environments.'],
  ['rectangle133360-7wul-800h.png', 'Logistyka', 'Logistics', 'TRANSPORT', 'TRANSPORT', 'Gizmo przenosi ładunki tam, gdzie potrzebujesz go najbardziej.', 'Gizmo moves loads wherever you need it most.'],
  ['homepage_render.png', 'Produkcja', 'Manufacturing', 'AUTOMATYZACJA', 'AUTOMATION', 'Elastyczna robotyka dopasowuje się do Twojego procesu pracy.', 'Flexible robotics adapt to your workflow.']
];

const links = {
  pl: ['index.html', 'desktop2.html', 'zespol.html', 'wdrozenia.html', 'galeria.html', 'kontakt.html', 'investor.html', 'client.html'],
  en: ['index.html', 'history.html', 'team.html', 'deployments.html', 'gallery.html', 'contact.html', 'investor.html', 'client.html']
};
const socials = [
  ['instagram-svgrepo-com.svg', 'Instagram', '@projekt_gizmo', 'https://www.instagram.com/projekt_gizmo/'],
  ['linkedin-fill-svgrepo-com.svg', 'LinkedIn', 'Projekt Gizmo', 'https://www.linkedin.com/company/projekt-gizmo/'],
  ['facebook-svgrepo-com.svg', 'Facebook', 'Projekt Gizmo', 'https://www.facebook.com/p/Projekt-Gizmo-61575747850184/']
];

function render(locale, localized) {
  const data = JSON.parse(fs.readFileSync(path.join(root, `src/content/${locale}.json`), 'utf8'));
  const base = localized ? '../' : './';
  const url = (lang) => localized ? `../${lang}/index.html` : lang === 'pl' ? 'index.html' : 'en/index.html';
  const pageUrl = (page, i) => localized ? `./${page}` : i === 0 ? 'index.html' : i === 5 ? '#contact' : `pl/${page}`;
  const navigation = renderNavigation(data.navigation, locale, localized, 0);
  const slides = images.map(([file, plCategory, enCategory, plTitle, enTitle, plCopy, enCopy]) => `<article class="photo-carousel__slide"><div class="photo-carousel__image"><img src="${base}public/${file === 'homepage_render.png' ? 'renders/' : 'external/'}${file}" alt="${locale === 'en' ? enCategory : plCategory}" /></div><div class="photo-carousel__content"><p class="photo-carousel__category">${locale === 'en' ? enCategory : plCategory}</p><h3>${locale === 'en' ? enTitle : plTitle}</h3><p class="photo-carousel__copy">${locale === 'en' ? enCopy : plCopy}</p></div></article>`).join('');
  const stats = data.stats.map(([value, label]) => `<div class="stat-card"><span class="stat-card__value">${value}</span><span class="stat-card__label">${label}</span></div>`).join('');
  const checklist = data.checklist.map((item) => `<li>${item}</li>`).join('');
  const socialCards = socials.map(([icon, name, handle, href]) => `<a class="social-updates__card" href="${href}" target="_blank" rel="noopener noreferrer"><img src="${base}public/external/${icon}" alt="" aria-hidden="true"><span class="social-updates__name">${name}</span><span class="social-updates__handle">${handle}</span><span class="social-updates__action">${data.socialAction} <span aria-hidden="true">↗</span></span></a>`).join('');
  const founders = data.founders.map((founder, index) => `<article class="founder-card founder-card--${index === 0 ? 'purple' : 'lime'}"><div class="founder-card__portrait"><div class="founder-card__portrait-crop"><img class="founder-card__portrait-image${founder.photo === 'bfeliks.png' ? ' founder-card__portrait-image--feliks' : ''}" src="${base}public/team_photos/${founder.photo}" alt="${founder.name}" /></div></div><div class="founder-card__content"><span class="founder-card__role">${founder.role}</span><h3>${founder.name}</h3><p>${founder.bio}</p></div></article>`).join('');
  const teamDetails = data.team.map((member, index) => `<div id="team-detail-${index}" class="team-carousel__detail${index === 0 ? ' team-carousel__detail--active' : ''}" data-team-detail="${index}" ${index === 0 ? '' : 'hidden'}><p>${member.bio}</p></div>`).join('');
  const teamMembers = data.team.map((member, index) => `<button class="team-carousel__member${index === 0 ? ' team-carousel__member--active' : ''}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="team-detail-${index}" data-team-member="${index}" data-team-name="${member.name}" data-team-role="${member.role}" tabindex="${index === 0 ? '0' : '-1'}"><span class="team-carousel__member-ring"><img src="${member.photo ? `${base}public/team_photos/${member.photo}` : `${base}public/external/avatar.svg`}" alt="${member.name}" /></span></button>`).join('');
  const values = { ...data, base, founders, firstTeamName: data.team[0].name, firstTeamRole: data.team[0].role, homeUrl: localized ? './index.html' : 'index.html', contactUrl: localized ? `./${links[locale][5]}` : '#contact', historyUrl: pageUrl(links[locale][1], 1), deploymentsUrl: pageUrl(links[locale][3], 3), investorUrl: pageUrl(links[locale][6], 6), clientUrl: pageUrl(links[locale][7], 7), menuOpen: locale === 'en' ? 'Open menu' : 'Otwórz menu', plUrl: url('pl'), enUrl: url('en'), plActive: locale === 'pl' ? 'navbar__lang--active' : '', enActive: locale === 'en' ? 'navbar__lang--active' : '', navigation, slides, stats, checklist, socialCards, teamMembers, teamDetails };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}

function renderNavigation(labels, locale, localized, activeIndex) {
  return labels.map((label, i) => {
    const page = links[locale][i];
    const href = localized ? `./${page}` : i === 0 ? 'index.html' : i === 5 ? '#contact' : `pl/${page}`;
    return `<li><a href="${href}" class="navbar__link${i === activeIndex ? ' navbar__link--active' : ''}">${label}</a></li>`;
  }).join('');
}

for (const locale of ['pl', 'en']) {
  const localizedDir = path.join(root, locale);
  fs.mkdirSync(localizedDir, { recursive: true });
  fs.writeFileSync(path.join(localizedDir, 'index.html'), render(locale, true));
  if (locale === 'pl') {
    fs.writeFileSync(path.join(root, 'index.html'), render(locale, false));
  }
}

const polishPages = {
  history: ['desktop2.html', 'history.html'],
  team: ['zespol.html', 'team.html'],
  deployments: ['wdrozenia.html', 'deployments.html'],
  gallery: ['galeria.html', 'gallery.html'],
  contact: ['kontakt.html', 'contact.html']
};

const englishPages = JSON.parse(fs.readFileSync(path.join(root, 'src/content/en-pages.json'), 'utf8'));

function renderPage(locale, pageKey, sourceName) {
  let html = fs.readFileSync(path.join(root, 'src/templates/pl', sourceName), 'utf8');
  const pageNames = polishPages[pageKey];
  const pageName = pageNames[locale === 'en' ? 1 : 0];
  const data = JSON.parse(fs.readFileSync(path.join(root, `src/content/${locale}.json`), 'utf8'));
  const navigationLabels = data.navigation;
  html = html
    .replace('<html lang="pl">', `<html lang="${locale}">`)
    .replaceAll('./src/styles/site.css', '../src/styles/site.css')
    .replaceAll('./src/scripts/navigation.js', '../src/scripts/navigation.js')
    .replaceAll('public/external/', '../public/external/')
    .replaceAll('public/team_photos/', '../public/team_photos/')
    .replaceAll('public\\external\\', '../public/external/');

  if (locale === 'en') {
    for (const [source, translation] of Object.entries(englishPages[pageKey])) {
      html = html.replaceAll(source, translation);
    }
    for (const [source, translation] of Object.entries(englishPages.common)) {
      html = html.replaceAll(source, translation);
    }
  }

  const localizedLinks = new Map([
    ['index.html', 'index.html'],
    ['desktop2.html', links[locale][1]],
    ['zespol.html', links[locale][2]],
    ['wdrozenia.html', links[locale][3]],
    ['galeria.html', links[locale][4]],
    ['kontakt.html', links[locale][5]],
    ['investor.html', 'investor.html'],
    ['client.html', 'client.html']
  ]);
  html = html.replace(/href="([^"#]+\.html)(#[^"]*)?"/g, (match, href, hash = '') => {
    const target = localizedLinks.get(href);
    return target ? `href="./${target}${hash}"` : match;
  });

  const plHref = `../pl/${pageNames[0]}`;
  const enHref = `../en/${pageNames[1]}`;
  const languageSwitcher = `<div class="navbar__lang-switcher"><a href="${plHref}" class="navbar__lang${locale === 'pl' ? ' navbar__lang--active' : ''}">PL</a><span>/</span><a href="${enHref}" class="navbar__lang${locale === 'en' ? ' navbar__lang--active' : ''}">ENG</a></div>`;
  html = html.replace(/<div class="navbar__lang-switcher">[\s\S]*?<\/div>/, languageSwitcher);
  const activeIndex = ['history', 'team', 'deployments', 'gallery', 'contact'].indexOf(pageKey) + 1;
  html = html.replace(/<ul class="navbar__links">[\s\S]*?<\/ul>/, `<ul class="navbar__links">${renderNavigation(navigationLabels, locale, true, activeIndex)}</ul>`);
  if (pageKey === 'team') {
    const contactPage = locale === 'en' ? 'contact.html' : 'kontakt.html';
    const contactLabel = locale === 'en' ? 'Contact' : 'Skontaktuj się z';
    const teamCards = data.team.map((member) => `<a href="./${contactPage}" class="team-card team-card--link" aria-label="${contactLabel} ${member.name}"><img src="../public/team_photos/${member.photo}" alt="${member.name}" class="team-card__avatar" /><div class="team-card__info"><h3 class="team-card__name">${member.name}</h3><p class="team-card__role">${member.role}</p><p class="team-card__bio">${member.bio}</p></div></a>`).join('');
    html = html.replace('{{teamCards}}', teamCards);
  }
  return html;
}

for (const [pageKey, pageNames] of Object.entries(polishPages)) {
  for (const [locale, pageName] of [['pl', pageNames[0]], ['en', pageNames[1]]]) {
    fs.writeFileSync(path.join(root, locale, pageName), renderPage(locale, pageKey, `${pageKey}.html`));
  }
}

const stakeholders = JSON.parse(fs.readFileSync(path.join(root, 'src/content/stakeholders.json'), 'utf8'));
const stakeholderTemplate = fs.readFileSync(path.join(root, 'src/templates/stakeholder.html'), 'utf8');
for (const locale of ['pl', 'en']) {
  const data = JSON.parse(fs.readFileSync(path.join(root, `src/content/${locale}.json`), 'utf8'));
  for (const audience of ['investor', 'client']) {
    const page = stakeholders[locale][audience];
    const cards = page.cards.map((card) => `<div class="info-column"><h2 class="section-title--small">${card.title}</h2><p class="lead">${card.text}</p></div>`).join('');
    const values = {
      ...page,
      language: locale,
      base: '../',
      siteName: locale === 'en' ? 'Project Gizmo' : 'Projekt Gizmo',
      contactTitle: data.contactTitle,
      contactUrl: locale === 'en' ? './contact.html' : './kontakt.html',
      menuOpen: locale === 'en' ? 'Open menu' : 'Otwórz menu',
      navigation: renderNavigation(data.navigation, locale, true, audience === 'investor' ? 6 : 7),
      plUrl: `../pl/${audience}.html`,
      enUrl: `../en/${audience}.html`,
      plActive: locale === 'pl' ? 'navbar__lang--active' : '',
      enActive: locale === 'en' ? 'navbar__lang--active' : '',
      mockLabel: stakeholders[locale].mockLabel,
      sectionTitle: stakeholders[locale].sectionTitle,
      cards,
      ctaText: page.ctaText,
      backLabel: locale === 'en' ? 'Back to contact' : 'Wróć do kontaktu'
    };
    const html = stakeholderTemplate.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
    fs.writeFileSync(path.join(root, locale, `${audience}.html`), html);
  }
}
console.log('Generated Polish and English pages.');
