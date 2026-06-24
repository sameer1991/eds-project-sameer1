/**
 * Reads the key-value block and returns a plain config object.
 * e.g. { source: '/content/site/articles.json', limit: '6', ... }
 */
function readConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const [keyCell, valueCell] = row.children;
    if (!keyCell || !valueCell) return;

    const key = keyCell.textContent.trim();
    // Grab href if it's a link, otherwise plain text
    const value = valueCell.querySelector('a')?.href
      || valueCell.textContent.trim();

    config[key] = value;
  });
  return config;
}

/**
 * Fetches articles from the JSON source and returns an array.
 */
async function fetchArticles(source, limit, keywords) {
  const url = new URL(source, window.location.origin);
  const resp = await fetch(url);
  if (!resp.ok) return [];

  const json = await resp.json();
  let articles = json.data || [];

  // Filter by keywords if provided
  if (keywords) {
    const kws = keywords.toLowerCase().split(',').map((k) => k.trim());
    articles = articles.filter((a) =>
      kws.some((kw) => a.tags?.toLowerCase().includes(kw))
    );
  }

  return articles.slice(0, parseInt(limit, 10) || 6);
}

/**
 * Builds a single article card element.
 */
function buildArticleCard(article) {
  const card = document.createElement('div');
  card.classList.add('article-card');
  card.innerHTML = `
    <a href="${article.path}">
      ${article.image ? `<img src="${article.image}" alt="${article.title}" loading="lazy">` : ''}
      <div class="article-card-body">
        <h3>${article.title}</h3>
        <p>${article.description || ''}</p>
      </div>
    </a>
  `;
  return card;
}

export default async function decorate(block) {
  // 1. Read the config from the key-value rows
  const config = readConfig(block);
  const { source, limit = '6', keywords = '', layout = 'grid' } = config;

  // 2. Clear the raw key-value HTML
  block.innerHTML = '';
  block.classList.add(`layout-${layout}`);

  if (!source) {
    block.textContent = 'No source configured.';
    return;
  }

  // 3. Show a loading state
  block.innerHTML = '<p class="loading">Loading articles...</p>';

  // 4. Fetch articles using the config values
  const articles = await fetchArticles(source, limit, keywords);

  // 5. Clear loading and render articles
  block.innerHTML = '';

  if (!articles.length) {
    block.textContent = 'No articles found.';
    return;
  }

  articles.forEach((article) => {
    block.append(buildArticleCard(article));
  });
}