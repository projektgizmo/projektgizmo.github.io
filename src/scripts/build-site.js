const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const template = fs.readFileSync(path.join(root, 'src/templates/home.html'), 'utf8');
const links = {
  pl: ['index.html', 'desktop2.html', 'zespol.html', 'wdrozenia.html', 'galeria.html', 'kontakt.html', 'investor.html', 'client.html', 'jak-dziala.html'],
  en: ['index.html', 'history.html', 'team.html', 'deployments.html', 'gallery.html', 'contact.html', 'investor.html', 'client.html', 'how-it-works.html']
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
  const slides = data.useCases.map((useCase) => `<article class="photo-carousel__slide"><div class="photo-carousel__image"><img src="${base}public/renders/${useCase.image}" alt="${useCase.category}" /></div><div class="photo-carousel__content"><p class="photo-carousel__category">${useCase.category}</p><h3>${useCase.title}</h3><p class="photo-carousel__copy">${useCase.copy}</p></div></article>`).join('');
  const checklist = data.checklist.map((item) => `<li>${item}</li>`).join('');
  const valueChallenges = data.valueChallenges.map((challenge, index) => `<article class="value-challenge"><span class="value-challenge__number">${String(index + 1).padStart(2, '0')}</span><h3>${challenge.title}</h3><p>${challenge.text}</p></article>`).join('');
  const socialCards = socials.map(([icon, name, handle, href]) => `<a class="social-updates__card" href="${href}" target="_blank" rel="noopener noreferrer"><img src="${base}public/external/${icon}" alt="" aria-hidden="true"><span class="social-updates__name">${name}</span><span class="social-updates__handle">${handle}</span><span class="social-updates__action">${data.socialAction} <span aria-hidden="true">↗</span></span></a>`).join('');
  const founders = data.founders.map((founder, index) => `<article class="founder-card founder-card--${index === 0 ? 'purple' : 'lime'}"><div class="founder-card__portrait"><div class="founder-card__portrait-crop"><img class="founder-card__portrait-image${founder.photo === 'bfeliks.png' ? ' founder-card__portrait-image--feliks' : ''}" src="${base}public/team_photos/${founder.photo}" alt="${founder.name}" /></div></div><div class="founder-card__content"><span class="founder-card__role">${founder.role}</span><h3>${founder.name}</h3><p>${founder.bio}</p></div></article>`).join('');
  const teamCarouselMembers = data.team;
  const teamDetails = teamCarouselMembers.map((member, index) => `<div id="team-detail-${index}" class="team-carousel__detail${index === 0 ? ' team-carousel__detail--active' : ''}" data-team-detail="${index}" ${index === 0 ? '' : 'hidden'}><p>${member.bio}</p></div>`).join('');
  const teamMembers = teamCarouselMembers.map((member, index) => `<button class="team-carousel__member${index === 0 ? ' team-carousel__member--active' : ''}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="team-detail-${index}" data-team-member="${index}" data-team-name="${member.name}" data-team-role="${member.role}" tabindex="${index === 0 ? '0' : '-1'}"><span class="team-carousel__member-ring"><img src="${base}public/team_photos/${member.photo}" alt="${member.name}" /></span></button>`).join('');
  const values = { ...data, base, founders, firstTeamName: teamCarouselMembers[0].name, firstTeamRole: teamCarouselMembers[0].role, homeUrl: localized ? './index.html' : 'index.html', contactUrl: localized ? `./${links[locale][5]}` : '#contact', historyUrl: pageUrl(links[locale][1], 1), investorUrl: pageUrl(links[locale][6], 6), clientUrl: pageUrl(links[locale][7], 7), menuOpen: locale === 'en' ? 'Open menu' : 'Otwórz menu', plUrl: url('pl'), enUrl: url('en'), plActive: locale === 'pl' ? 'navbar__lang--active' : '', enActive: locale === 'en' ? 'navbar__lang--active' : '', navigation, slides, checklist, valueChallenges, socialCards, teamMembers, teamDetails };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}

function renderNavigation(labels, locale, localized, activeIndex) {
  return [0, 1, 2, 8, 5, 6, 7].filter((index) => labels[index]).map((index) => {
    const label = labels[index];
    const page = links[locale][index];
    const href = localized ? `./${page}` : index === 0 ? 'index.html' : index === 5 ? '#contact' : `pl/${page}`;
    return `<li><a href="${href}" class="navbar__link${index === activeIndex ? ' navbar__link--active' : ''}">${label}</a></li>`;
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
  'how-it-works': ['jak-dziala.html', 'how-it-works.html'],
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
    .replaceAll('public/own/', '../public/own/')
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
    ['jak-dziala.html', links[locale][8]],
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
  const activeIndex = ({ history: 1, team: 2, 'how-it-works': 8, deployments: 3, gallery: 4, contact: 5 })[pageKey] ?? 0;
  html = html.replace(/<ul class="navbar__links">[\s\S]*?<\/ul>/, `<ul class="navbar__links">${renderNavigation(navigationLabels, locale, true, activeIndex)}</ul>`);
  if (pageKey === 'team') {
    const contactPage = locale === 'en' ? 'contact.html' : 'kontakt.html';
    const contactLabel = locale === 'en' ? 'Contact' : 'Skontaktuj się z';
    const teamMembers = [...data.founders, ...data.team];
    const teamCards = teamMembers.map((member) => `<a href="./${contactPage}" class="team-card team-card--link" aria-label="${contactLabel} ${member.name}"><img src="../public/team_photos/${member.photo}" alt="${member.name}" class="team-card__avatar" /><div class="team-card__info"><h3 class="team-card__name">${member.name}</h3><p class="team-card__role">${member.role}</p><p class="team-card__bio">${member.bio}</p></div></a>`).join('');
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
