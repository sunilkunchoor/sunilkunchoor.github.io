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

  // Convert markdown to HTML with auto-generated heading IDs for table of contents
  const renderer = new marked.Renderer();
  renderer.heading = function (text: string, level: number, raw: string) {
    const id = raw
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };

  const htmlContent = await marked.parse(content, { renderer });

  // Fetch articles.json configuration to get the hierarchy
  const articlesConfigPath = path.join(process.cwd(), 'content/articles.json');
  let subPages: any[] = [];
  let mainTitle = '';

  if (fs.existsSync(articlesConfigPath)) {
    const articlesConfig = JSON.parse(fs.readFileSync(articlesConfigPath, 'utf-8'));
    const config = articlesConfig.find((a: any) => a.slug === mainSlug);
    if (config) {
      subPages = config.subPages || [];
      mainTitle = config.title;
    }
  }

  const isSubPage = slug.length > 1;
  const hasSidebar = subPages.length > 0;

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
              <aside className="lg:col-span-1 border-r border-white/5 pr-6 h-fit sticky top-28 hidden lg:block">
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

                <nav className="space-y-1">
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

                  {/* Sub-pages list */}
                  {subPages.map((sub: any) => {
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
