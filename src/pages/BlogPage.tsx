import React from 'react';
import { Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/guidesData';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';

interface BlogPageProps {
  onNavigate: (route: AppRoute) => void;
  selectedPostId?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, selectedPostId }) => {
  if (selectedPostId) {
    const post = BLOG_POSTS.find((b) => b.id === selectedPostId) || BLOG_POSTS[0];

    return (
      <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
        <SEOHead
          title={`${post.title} – Engineering Blog`}
          description={post.summary}
          canonicalPath={`/blog/${post.id}`}
          ogType="article"
          schemaData={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.summary,
            datePublished: post.date,
            author: {
              '@type': 'Person',
              name: post.author.name
            }
          }}
        />
        <Breadcrumb
          items={[
            { label: 'Engineering Blog', route: { view: 'blog' } },
            { label: post.title },
          ]}
          onNavigate={onNavigate}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="emerald">{post.category}</Badge>
            <span className="text-xs text-slate-400">{post.readTime}</span>
            <span className="text-xs text-slate-400">• {post.date}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{post.author.name}</div>
              <div className="text-xs text-slate-500">{post.author.role}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {post.content}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title="Engineering & Security Blog – WebAssembly & File Codecs"
        description="Engineering deep dives into WebAssembly binary parsing, client-side cryptographic hashing, HEIC image decoders, and data privacy."
        canonicalPath="/blog"
      />
      <Breadcrumb items={[{ label: 'Engineering Blog' }]} onNavigate={onNavigate} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="emerald" size="md">Engineering & Security Blog</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AnyFileX Product Engineering
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Insights on WebAssembly binary parsing, image compression codecs, security sandboxing, and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate({ view: 'blog-post', id: item.id })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
            id={`blog-card-${item.id}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="emerald">{item.category}</Badge>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
