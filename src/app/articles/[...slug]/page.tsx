import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Mermaid from '@/components/Mermaid';
import { Calendar, ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';

import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  if (!fs.existsSync(articlesDir)) return [];

  const paths: { slug: string[] }[] = [];

  function walk(dir: string, currentSlug: string[] = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath, [...currentSlug, file]);
      } else if (file.endsWith('.md')) {
        const fileSlug = file.replace('.md', '');
        paths.push({
          slug: [...currentSlug, fileSlug],
        });
      }
    }
  }

  walk(articlesDir);
  return paths;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug || slug.length === 0) {
    notFound();
  }

  const mainSlug = slug[0];
  const relativeFilePath = slug.join('/') + '.md';
  const filePath = path.join(process.cwd(), 'content/articles', relativeFilePath);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Load article markdown
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Calculate reading time
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const isSubPage = slug.length > 1;

  // Fetch specific article configuration to get the hierarchy and metadata for remote links/images
  const articleConfigPath = path.join(process.cwd(), 'content/articles', `${mainSlug}.json`);
  let subPages: any[] = [];
  let mainTitle = '';
  let isRemote = false;
  let owner = '';
  let repo = '';
  let branch = 'main';
  let remoteFilePath = '';

  if (fs.existsSync(articleConfigPath)) {
    const config = JSON.parse(fs.readFileSync(articleConfigPath, 'utf-8'));
    subPages = config.subPages || [];
    mainTitle = config.title;
    if (config.type === 'remote') {
      isRemote = true;
      owner = config.owner;
      repo = config.repo;
      branch = config.branch || 'main';
      if (!isSubPage) {
        remoteFilePath = config.mainPath;
      } else {
        const subSlugPath = slug.slice(1).join('/');
        const subPage = subPages.find((sub: any) => sub.slug.join('/') === subSlugPath);
        if (subPage) {
          remoteFilePath = subPage.path;
        }
      }
    }
  }

  // Convert markdown to HTML with custom renderer
  const renderer = new marked.Renderer();
  
  // Custom heading renderer to generate IDs for table of contents
  renderer.heading = function (text: string, level: number, raw: string) {
    const id = raw
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };

  // Custom link renderer to rewrite relative Markdown hyperlinks to slug paths
  renderer.link = function (href: string, title: string | null | undefined, text: string) {
    if (!href) {
      return `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`;
    }
    
    let resolvedHref = href;
    // Check if relative link (not absolute, not an email, not anchor)
    if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('/') && !href.startsWith('#')) {
      const hashIndex = href.indexOf('#');
      const hash = hashIndex !== -1 ? href.substring(hashIndex) : '';
      let pathOnly = hashIndex !== -1 ? href.substring(0, hashIndex) : href;

      // Strip .md extension
      if (pathOnly.endsWith('.md')) {
        pathOnly = pathOnly.slice(0, -3);
      }
      // Remove README.md or README
      if (pathOnly === 'README' || pathOnly === 'README.md') {
        pathOnly = '';
      } else if (pathOnly.endsWith('/README')) {
        pathOnly = pathOnly.slice(0, -7);
      }

      const baseDir = slug.length > 1 ? slug.slice(1, -1) : [];
      const hrefParts = pathOnly.split('/');
      const resolvedParts = [...baseDir];

      for (const part of hrefParts) {
        if (part === '.' || part === '' || part === 'docs') {
          continue;
        }
        if (part === '..') {
          resolvedParts.pop();
        } else {
          resolvedParts.push(part);
        }
      }

      resolvedHref = `/articles/${mainSlug}${resolvedParts.length > 0 ? '/' + resolvedParts.join('/') : ''}${hash}`;
    }

    return `<a href="${resolvedHref}"${title ? ` title="${title}"` : ''}>${text}</a>`;
  };

  // Custom image renderer to rewrite relative images to absolute GitHub raw URLs
  renderer.image = function (href: string, title: string | null, text: string) {
    if (!href) return '';
    
    let resolvedHref = href;
    if (isRemote && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('data:') && !href.startsWith('/')) {
      // Resolve relative path against the remote file directory
      const remoteDirParts = remoteFilePath.split('/').slice(0, -1);
      
      const hrefParts = href.split('/');
      const resolvedParts = [...remoteDirParts];
      
      for (const part of hrefParts) {
        if (part === '.' || part === '') {
          continue;
        }
        if (part === '..') {
          resolvedParts.pop();
        } else {
          resolvedParts.push(part);
        }
      }
      
      resolvedHref = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolvedParts.join('/')}`;
    }
    
    return `<img src="${resolvedHref}" alt="${text || ''}"${title ? ` title="${title}"` : ''} />`;
  };

  // Custom code block renderer to highlight code with Prism based on language
  renderer.code = function (code: string, infostring: string | undefined, escaped: boolean) {
    const lang = (infostring || '').match(/^\S*/)?.[0] || 'text';
    
    let highlightedCode = code;
    if (Prism.languages[lang]) {
      try {
        highlightedCode = Prism.highlight(code, Prism.languages[lang], lang);
      } catch (err) {
        console.error(`Prism failed to highlight language ${lang}:`, err);
      }
    } else {
      // Escape HTML for plain/unrecognized code blocks
      highlightedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    
    return `<pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>\n`;
  };

  const htmlContent = await marked.parse(content, { renderer });

  const hasSidebar = subPages.length > 0;

  // Group sub-pages by category (first element of slug if length > 1)
  const groupedSubPages: { [key: string]: any[] } = {};
  const ungroupedSubPages: any[] = [];
  const groupIndexPages: { [key: string]: any } = {};

  // First, find all group keys from sub-pages that have depth > 1
  const groupKeys = new Set<string>();
  subPages.forEach((sub: any) => {
    if (sub.slug.length > 1) {
      groupKeys.add(sub.slug[0]);
    }
  });

  // Now partition the subPages
  subPages.forEach((sub: any) => {
    if (sub.slug.length > 1) {
      const groupKey = sub.slug[0];
      if (!groupedSubPages[groupKey]) {
        groupedSubPages[groupKey] = [];
      }
      groupedSubPages[groupKey].push(sub);
    } else if (sub.slug.length === 1 && groupKeys.has(sub.slug[0])) {
      // Index page for this group!
      groupIndexPages[sub.slug[0]] = sub;
    } else {
      ungroupedSubPages.push(sub);
    }
  });

  const sortedGroupKeys = Object.keys(groupedSubPages).sort();

  function formatGroupName(name: string) {
    const match = name.match(/^(\d+)-(.*)$/);
    if (match) {
      const num = match[1];
      const text = match[2];
      const formattedText = text
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return `${num} — ${formattedText}`;
    }
    return name
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <main className="relative min-h-screen">
      <Background />
      <Navbar />
      <Mermaid />

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Main Layout Grid */}
          <div className={`grid grid-cols-1 ${hasSidebar ? 'lg:grid-cols-4' : 'max-w-3xl mx-auto'} gap-12`}>
            
            {/* Left Sidebar (Desktop Navigation) */}
            {hasSidebar && (
              <aside className="lg:col-span-1 border-r border-white/5 pr-6 h-fit sticky top-28 hidden lg:block overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
                    Course / Project
                  </span>
                  <Link href={`/articles/${mainSlug}`}>
                    <h3 className="font-headline font-semibold text-lg text-white hover:text-primary transition-colors leading-snug">
                      {mainTitle}
                    </h3>
                  </Link>
                </div>

                <nav className="space-y-4">
                  {/* Introduction link */}
                  <Link 
                    href={`/articles/${mainSlug}`}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      !isSubPage 
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(125,249,255,0.05)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Introduction</span>
                  </Link>

                  {/* Ungrouped Sub-pages */}
                  {ungroupedSubPages.map((sub: any) => {
                    const subSlugPath = sub.slug.join('/');
                    const subHref = `/articles/${mainSlug}/${subSlugPath}`;
                    const isActive = isSubPage && slug.slice(1).join('/') === subSlugPath;

                    return (
                      <Link 
                        key={subSlugPath}
                        href={subHref}
                        className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(125,249,255,0.05)]' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{sub.title}</span>
                      </Link>
                    );
                  })}

                  {/* Grouped Sub-pages */}
                  {sortedGroupKeys.map((groupKey) => {
                    const indexPage = groupIndexPages[groupKey];
                    const groupHref = `/articles/${mainSlug}/${groupKey}`;
                    const groupFilePath = path.join(process.cwd(), 'content/articles', mainSlug, `${groupKey}.md`);
                    const hasIndexPage = indexPage || fs.existsSync(groupFilePath);
                    const groupTitle = indexPage ? indexPage.title : formatGroupName(groupKey);
                    const isGroupActive = isSubPage && slug.slice(1).join('/') === groupKey;

                    return (
                      <div key={groupKey} className="space-y-1.5 pt-2">
                        {hasIndexPage ? (
                          <Link 
                            href={groupHref}
                            className={`text-[10px] uppercase tracking-wider font-bold block px-3 mb-1.5 transition-colors ${
                              isGroupActive 
                                ? 'text-primary shadow-[0_0_10px_rgba(125,249,255,0.05)]' 
                                : 'text-slate-500 hover:text-white'
                            }`}
                          >
                            {groupTitle}
                          </Link>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block px-3 mb-1">
                            {groupTitle}
                          </span>
                        )}
                        <div className="space-y-1">
                        {groupedSubPages[groupKey].map((sub: any) => {
                          const subSlugPath = sub.slug.join('/');
                          const subHref = `/articles/${mainSlug}/${subSlugPath}`;
                          const isActive = isSubPage && slug.slice(1).join('/') === subSlugPath;

                          return (
                            <Link 
                              key={subSlugPath}
                              href={subHref}
                              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                                isActive 
                                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(125,249,255,0.05)]' 
                                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                              }`}
                            >
                              <ChevronRight className="w-3 h-3 flex-shrink-0 text-slate-600" />
                              <span className="line-clamp-1">{sub.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                </nav>
              </aside>
            )}

            {/* Main Content Area */}
            <div className={`${hasSidebar ? 'lg:col-span-3 max-w-4xl' : 'w-full'}`}>
              {/* Back to Blog Listing */}
              <div className="flex items-center space-x-4 mb-8">
                <Link 
                  href="/articles"
                  className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                  Back to Articles
                </Link>
                {isSubPage && (
                  <>
                    <span className="text-slate-600">/</span>
                    <Link 
                      href={`/articles/${mainSlug}`}
                      className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      {mainTitle}
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Navigation Dropdown (Only visible on Mobile when sub-pages exist) */}
              {hasSidebar && (
                <div className="lg:hidden glass-card p-4 rounded-xl border border-white/5 mb-8">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">
                    Sections
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      href={`/articles/${mainSlug}`}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        !isSubPage 
                          ? 'bg-primary/10 text-primary border-primary/20' 
                          : 'bg-white/5 border-transparent text-slate-400'
                      }`}
                    >
                      Introduction
                    </Link>
                    {subPages.map((sub: any) => {
                      const subSlugPath = sub.slug.join('/');
                      const isActive = isSubPage && slug.slice(1).join('/') === subSlugPath;
                      return (
                        <Link 
                          key={subSlugPath}
                          href={`/articles/${mainSlug}/${subSlugPath}`}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            isActive 
                              ? 'bg-primary/10 text-primary border-primary/20' 
                              : 'bg-white/5 border-transparent text-slate-400'
                          }`}
                        >
                          {sub.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Article Header */}
              <header className="mb-12 border-b border-white/10 pb-8">
                <h1 className="font-headline font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
                  {data.title || slug[slug.length - 1]}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  {data.date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(data.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {readingTime} min read
                  </span>
                  {data.author && (
                    <span className="text-slate-400">
                      By {data.author}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {data.tags && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {data.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-white/5 text-slate-300 rounded-full border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div 
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
