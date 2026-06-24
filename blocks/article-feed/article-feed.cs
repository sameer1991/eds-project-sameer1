/* Grid layout (default) */
.article-feed.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

/* List layout */
.article-feed.layout-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Loading state */
.article-feed .loading {
  color: #888;
  font-style: italic;
}

/* Article card */
.article-feed .article-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.article-feed .article-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-feed .article-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.article-feed .article-card-body {
  padding: 1rem;
}

.article-feed .article-card-body h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.article-feed .article-card-body p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}