const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '../content/articles');

async function syncArticles() {
  try {
    console.log("Starting articles synchronization pipeline...");

    // Create base output directory if it doesn't exist
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    // Read all JSON configuration files in the articles folder
    const files = fs.readdirSync(articlesDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log("No article JSON configurations found in content/articles.");
      console.log("Sync pipeline completed successfully!");
      return;
    }

    for (const jsonFile of jsonFiles) {
      const configPath = path.join(articlesDir, jsonFile);
      const article = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      console.log(`Processing article: ${article.title || article.slug}...`);

      if (article.type === 'local') {
        // Local files are expected to be written manually (like skywalker-qa.md)
        console.log(`- Local article verified: ${article.slug}.md`);
        continue;
      }

      if (article.type === 'remote') {
        const { owner, repo, branch, slug, mainPath, title, date, summary, tags, author, subPages } = article;
        const mainUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch || 'main'}/${mainPath}`;

        // 1. Fetch main article
        console.log(`- Fetching main article from: ${mainUrl}`);
        const response = await fetch(mainUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch main article ${slug}: ${response.statusText}`);
        }
        let rawContent = await response.text();

        // Clean up markdown headers from the beginning if present
        if (rawContent.startsWith('# ') || rawContent.includes('# 🧠')) {
          const lines = rawContent.split('\n');
          const headerIdx = lines.findIndex(line => line.startsWith('# ') || line.startsWith('# 🧠'));
          if (headerIdx !== -1) {
            lines.splice(headerIdx, 1);
          }
          rawContent = lines.join('\n');
        }

        // Prep YAML Frontmatter
        const frontmatter = `---
title: "${title}"
date: "${date}"
summary: "${summary}"
tags: ${JSON.stringify(tags)}
author: "${author}"
---

`;

        const mainOutputFilePath = path.join(articlesDir, `${slug}.md`);
        fs.writeFileSync(mainOutputFilePath, frontmatter + rawContent.trim(), 'utf-8');
        console.log(`- Main article saved to: ${slug}.md`);

        // 2. Fetch sub pages if any
        if (subPages && subPages.length > 0) {
          const subPagesDir = path.join(articlesDir, slug);
          if (!fs.existsSync(subPagesDir)) {
            fs.mkdirSync(subPagesDir, { recursive: true });
          }

          for (const subPage of subPages) {
            const subPageUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch || 'main'}/${subPage.path}`;
            console.log(`  - Fetching subpage [${subPage.title}] from: ${subPageUrl}`);
            
            const subRes = await fetch(subPageUrl);
            if (!subRes.ok) {
              console.warn(`  [WARNING] Failed to fetch subpage: ${subPage.title}. Skipping.`);
              continue;
            }
            let subContent = await subRes.text();

            // Clean up headers
            if (subContent.startsWith('# ') || subContent.startsWith('## ')) {
              const lines = subContent.split('\n');
              lines.shift();
              subContent = lines.join('\n');
            }

            const subFrontmatter = `---
title: "${subPage.title}"
parentSlug: "${slug}"
---

`;

            // Slug array path creation
            const nestedPath = path.join(subPagesDir, ...subPage.slug);
            const nestedDir = path.dirname(nestedPath);
            
            if (!fs.existsSync(nestedDir)) {
              fs.mkdirSync(nestedDir, { recursive: true });
            }

            fs.writeFileSync(`${nestedPath}.md`, subFrontmatter + subContent.trim(), 'utf-8');
            console.log(`  - Saved subpage to: ${path.join(slug, ...subPage.slug)}.md`);
          }
        }
      }
    }

    console.log("Sync pipeline completed successfully!");
  } catch (error) {
    console.error("Error in sync pipeline:", error);
    process.exit(1);
  }
}

syncArticles();
