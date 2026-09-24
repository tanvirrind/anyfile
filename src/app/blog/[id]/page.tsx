import type { Metadata } from 'next';
import { BlogRouteClient } from '@/components/routes/LegacyRouteClients';
import { BLOG_POSTS } from '@/data/guidesData';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return BLOG_POSTS.map((post) => ({ id: post.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const post = BLOG_POSTS.find((item) => item.id.toLowerCase() === id.toLowerCase()); return post ? { title: `${post.title} – AnyFileX`, description: post.summary, alternates: { canonical: `https://anyfilex.com/blog/${post.id}` } } : { title: 'Blog Post Not Found', robots: { index: false, follow: false } }; }
export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const post = BLOG_POSTS.find((item) => item.id.toLowerCase() === id.toLowerCase()); if (!post) notFound(); return <BlogRouteClient postId={post.id} />; }
