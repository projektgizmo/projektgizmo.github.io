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

const pages = { pl: 'index.html' };
const links = {
  pl: ['index.html', 'desktop2.html', 'zespol.html', 'wdrozenia.html', 'galeria.html', 'index.html#contact'],
  en: ['index_eng.html', 'detskop2_eng.html', 'team.html', 'wdrozenia_eng.html', 'gallery.html', 'index_eng.html#contact']
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
  const pageUrl = (page, i) => localized
    ? locale === 'en' && i === 0
      ? './index.html'
      : locale === 'en' && i === 5
        ? './index.html#contact'
        : `${base}${page}`
    : i === 0
      ? 'index.html'
      : i === 5
        ? '#contact'
      : `pl/${page}`;
  const navigation = data.navigation.map((label, i) => `<li><a href="${pageUrl(links[locale][i], i)}" class="navbar__link${i === 0 ? ' navbar__link--active' : ''}">${label}</a></li>`).join('');
  const slides = images.map(([file, plCategory, enCategory, plTitle, enTitle, plCopy, enCopy]) => `<article class="photo-carousel__slide"><div class="photo-carousel__image"><img src="${base}public/${file === 'homepage_render.png' ? 'renders/' : 'external/'}${file}" alt="${locale === 'en' ? enCategory : plCategory}" /></div><div class="photo-carousel__content"><p class="photo-carousel__category">${locale === 'en' ? enCategory : plCategory}</p><h3>${locale === 'en' ? enTitle : plTitle}</h3><p class="photo-carousel__copy">${locale === 'en' ? enCopy : plCopy}</p></div></article>`).join('');
  const stats = data.stats.map(([value, label]) => `<div class="stat-card"><span class="stat-card__value">${value}</span><span class="stat-card__label">${label}</span></div>`).join('');
  const checklist = data.checklist.map((item) => `<li>${item}</li>`).join('');
  const socialCards = socials.map(([icon, name, handle, href]) => `<a class="social-updates__card" href="${href}" target="_blank" rel="noopener noreferrer"><img src="${base}public/external/${icon}" alt="" aria-hidden="true"><span class="social-updates__name">${name}</span><span class="social-updates__handle">${handle}</span><span class="social-updates__action">${data.socialAction} <span aria-hidden="true">↗</span></span></a>`).join('');
  const founders = data.founders.map((founder, index) => `<article class="founder-card founder-card--${index === 0 ? 'purple' : 'lime'}"><div class="founder-card__portrait"><img src="${base}public/external/avatar.svg" alt="${founder.name}" /></div><div class="founder-card__content"><span class="founder-card__role">${founder.role}</span><h3>${founder.name}</h3><p>${founder.bio}</p></div></article>`).join('');
  const teamDetails = data.team.map((member, index) => `<div id="team-detail-${index}" class="team-carousel__detail${index === 0 ? ' team-carousel__detail--active' : ''}" data-team-detail="${index}" ${index === 0 ? '' : 'hidden'}><p>${member.bio}</p></div>`).join('');
  const teamMembers = data.team.map((member, index) => `<button class="team-carousel__member${index === 0 ? ' team-carousel__member--active' : ''}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="team-detail-${index}" data-team-member="${index}" data-team-name="${member.name}" data-team-role="${member.role}" tabindex="${index === 0 ? '0' : '-1'}"><span class="team-carousel__member-ring"><img src="${base}public/external/avatar.svg" alt="${member.name}" /></span></button>`).join('');
  const values = { ...data, base, founders, firstTeamName: data.team[0].name, firstTeamRole: data.team[0].role, homeUrl: localized ? './index.html' : pages[locale], contactUrl: localized ? './index.html#contact' : '#contact', deploymentsUrl: pageUrl(links[locale][3], 3), menuOpen: locale === 'en' ? 'Open menu' : 'Otwórz menu', plUrl: url('pl'), enUrl: url('en'), plActive: locale === 'pl' ? 'navbar__lang--active' : '', enActive: locale === 'en' ? 'navbar__lang--active' : '', navigation, slides, stats, checklist, socialCards, teamMembers, teamDetails };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}

for (const locale of ['pl', 'en']) {
  const localizedDir = path.join(root, locale);
  fs.mkdirSync(localizedDir, { recursive: true });
  fs.writeFileSync(path.join(localizedDir, 'index.html'), render(locale, true));
  if (locale === 'pl') {
    fs.writeFileSync(path.join(root, pages.pl), render(locale, false));
  }
}

const polishPages = {
  history: ['desktop2.html', 'desktop2.html'],
  team: ['zespol.html', 'zespol.html'],
  deployments: ['wdrozenia.html', 'wdrozenia.html'],
  gallery: ['galeria.html', 'galeria.html'],
  contact: ['kontakt.html', 'kontakt.html']
};

function renderPolishPage(sourceName, localized) {
  let html = fs.readFileSync(path.join(root, 'src/templates/pl', sourceName), 'utf8');
  const assetBase = localized ? '../' : './';
  html = html
    .replaceAll('./src/styles/site.css', `${assetBase}src/styles/site.css`)
    .replaceAll('./src/scripts/navigation.js', `${assetBase}src/scripts/navigation.js`)
    .replaceAll('public/external/', `${assetBase}public/external/`)
    .replaceAll('public\\external\\', `${assetBase}public/external/`);
  if (localized) {
    for (const page of ['index_eng.html', 'detskop2_eng.html', 'team.html', 'wdrozenia_eng.html', 'gallery.html']) {
      html = html.replaceAll(`href="${page}`, `href="../${page}`);
    }
    html = html.replace(/\.\.\/(?:index_eng|detskop2_eng|team|wdrozenia_eng|gallery)\.html(?:#\w+)?/g, '../en/index.html');
  }
  return html;
}

for (const [sourceName, [rootName, localizedName]] of Object.entries(polishPages)) {
  fs.writeFileSync(path.join(root, 'pl', localizedName), renderPolishPage(`${sourceName}.html`, true));
}
console.log('Generated Polish and English pages.');
