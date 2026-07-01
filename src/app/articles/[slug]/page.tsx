import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import Mermaid from '@/components/Mermaid';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      slug: file.replace('.md', ''),
    }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/articles', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Calculate reading time (avg 200 words per minute)
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Convert markdown to HTML
  const htmlContent = await marked.parse(content);

  return (
    <main className="relative min-h-screen">
      <Background />
      <Navbar />
      <Mermaid />

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Back button */}
          <Link
            href="/articles"
            className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="font-headline font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
              {data.title || slug}
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

      <Footer />
    </main>
  );
}
