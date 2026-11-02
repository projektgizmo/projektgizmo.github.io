const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const template = fs.readFileSync(path.join(root, 'src/templates/home.html'), 'utf8');
const images = [
  ['gizmo_tasma.png', 'Gizmo na taśmie produkcyjnej', 'Gizmo on a production line'],
  ['kula_gizmula.png', 'Struktura złożona z modułów Gizmo', 'Structure made of Gizmo modules'],
  ['blizniak.png', 'Wydrukowane roboty Gizmo', 'Printed Gizmo robots'],
  ['model4.png', 'Model 4 robota Gizmo', 'Gizmo robot model 4'],
  ['wizualizacja-pomidory.png', 'Wizualizacja koncepcyjna: Gizmo przy zbiorze pomidorów w szklarni', 'Concept visualisation: Gizmo harvesting tomatoes in a greenhouse']
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
  const url = (lang) => localized ? `../${lang}/index.html` : lang === 'pl' ? 'index.html' : 'index_eng.html';
  const navigation = data.navigation.map((label, i) => `<li><a href="${base}${links[locale][i]}" class="navbar__link${i === 0 ? ' navbar__link--active' : ''}">${label}</a></li>`).join('');
  const slides = images.map(([file, plAlt, enAlt], i) => `<div class="photo-carousel__slide${i === images.length - 1 ? ' photo-carousel__slide--tagged' : ''}"><img src="${base}public/external/${file}" alt="${locale === 'en' ? enAlt : plAlt}" />${i === images.length - 1 ? `<span class="photo-carousel__tag">${locale === 'en' ? 'Concept visualisation' : 'Wizualizacja koncepcyjna'}</span>` : ''}</div>`).join('');
  const stats = data.stats.map(([value, label]) => `<div class="stat-card"><span class="stat-card__value">${value}</span><span class="stat-card__label">${label}</span></div>`).join('');
  const checklist = data.checklist.map((item) => `<li>${item}</li>`).join('');
  const socialCards = socials.map(([icon, name, handle, href]) => `<a class="social-updates__card" href="${href}" target="_blank" rel="noopener noreferrer"><img src="${base}public/external/${icon}" alt="" aria-hidden="true"><span class="social-updates__name">${name}</span><span class="social-updates__handle">${handle}</span><span class="social-updates__action">${data.socialAction} <span aria-hidden="true">↗</span></span></a>`).join('');
  const values = { ...data, base, homeUrl: localized ? './index.html' : pages[locale], contactUrl: localized ? './index.html#contact' : `${pages[locale]}#contact`, deploymentsUrl: `${base}${links[locale][3]}`, menuOpen: locale === 'en' ? 'Open menu' : 'Otwórz menu', plUrl: url('pl'), enUrl: url('en'), plActive: locale === 'pl' ? 'navbar__lang--active' : '', enActive: locale === 'en' ? 'navbar__lang--active' : '', navigation, slides, stats, checklist, socialCards };
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
