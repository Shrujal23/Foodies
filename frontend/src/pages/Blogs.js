import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, ClockIcon, LightBulbIcon, PencilSquareIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const posts = [
  {
    category: 'Cooking basics',
    title: 'Start with confidence: five habits that make everyday cooking easier',
    excerpt: 'Small changes—reading the full recipe, preparing ingredients, tasting as you go, and keeping notes—can make a big difference.',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    category: 'Food stories',
    title: 'A recipe can be more than a meal',
    excerpt: 'Recipes carry family memories, local ingredients, and personal twists. Sharing the story behind a dish helps keep food traditions alive.',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  },
  {
    category: 'Community tips',
    title: 'How to share a recipe that another cook can follow',
    excerpt: 'Use clear quantities, simple steps, useful photos, and honest notes about substitutions so your recipe is helpful to more people.',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1498579397066-22750a3cb424?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Blogs() {
  return (
    <div className="min-h-screen bg-[#fffaf7] dark:bg-gray-950">
      <section className="border-b border-orange-100 bg-gradient-to-br from-orange-100 via-[#fff7ef] to-rose-100 dark:border-gray-800 dark:from-gray-900 dark:via-gray-950 dark:to-rose-950/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm dark:border-orange-800/60 dark:bg-gray-900/70 dark:text-orange-300">
                <BookOpenIcon className="h-4 w-4" /> Foodies Blog
              </div>
              <button
                type="button"
                onClick={() => toast('Blog submissions are coming soon')}
                className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                aria-label="Write a blog post"
                title="Write a blog post — coming soon"
              >
                <PencilSquareIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Food stories, kitchen skills, and ideas worth sharing.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">A simple space for useful cooking guides and the stories behind the food we make. Built for curious cooks at every stage.</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Start here</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Helpful reads for home cooks</h2>
          </div>
          <Link to="/recipes" className="text-sm font-semibold text-orange-600 transition hover:text-orange-700 dark:text-orange-400">Explore recipes →</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <img src={post.image} alt="" className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-6">
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">{post.category}</p>
                <h3 className="mt-2 text-xl font-bold leading-7 text-gray-900 dark:text-white">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                <div className="mt-5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><ClockIcon className="h-4 w-4" />{post.readTime}</div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14 grid gap-5 rounded-3xl border border-orange-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-2 sm:p-8">
          <div className="flex gap-4"><LightBulbIcon className="h-7 w-7 shrink-0 text-orange-500" /><div><h2 className="font-bold text-gray-900 dark:text-white">What belongs here?</h2><p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">Cooking techniques, ingredient guides, cultural food stories, budget-friendly ideas, and practical kitchen advice.</p></div></div>
          <div className="flex gap-4"><UserGroupIcon className="h-7 w-7 shrink-0 text-orange-500" /><div><h2 className="font-bold text-gray-900 dark:text-white">A community feature, grown carefully</h2><p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">Community-submitted blog posts are a future step. First, Foodies will focus on clear quality guidelines and respectful moderation.</p></div></div>
        </section>
      </main>
    </div>
  );
}
