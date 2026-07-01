import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import { Calendar, ArrowRight } from 'lucide-react';

interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

export default async function ArticlesPage() {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  
  let articles: ArticleMeta[] = [];
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir);
    articles = files
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const slug = file.replace('.md', '');
        const filePath = path.join(articlesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        
        return {
          slug,
          title: data.title || slug,
          date: data.date || '',
          summary: data.summary || '',
          tags: data.tags || [],
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return (
    <main className="relative min-h-screen">
      <Background />
      <Navbar />
      
      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16 animate-reveal">
            <h1 className="font-headline font-bold text-4xl md:text-5xl mb-4 tracking-tight">
              Technical <span className="text-primary">Articles</span> & Insights
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Deep dives into MLOps infrastructure, automatic QA systems, and model governance engineering.
            </p>
          </div>

          {/* Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <article 
                  key={article.slug}
                  className="glass-card p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-[0_0_30px_rgba(125,249,255,0.1)] hover:-translate-y-1"
                >
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/articles/${article.slug}`}>
                      <h2 className="font-headline font-bold text-xl text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>

                    {/* Summary */}
                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-white/5 text-slate-300 rounded-full border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card rounded-2xl border border-white/5 max-w-md mx-auto">
              <p className="text-slate-400">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
