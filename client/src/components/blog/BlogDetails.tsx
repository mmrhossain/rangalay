import React from 'react';
import Image from "next/image";
import SocialShare from "@/components/shared/SocialShare";
import Link from "next/link";
import ReplyButton from "@/components/comment/ReplyButton";
import { BlogDetails as BlogDetailsType } from "@/types/blog";

const BlogDetails = ({ blog }: { blog: BlogDetailsType }) => {
    return (
        <div className="bg-white pb-20 md:pb-24 mt-6 md:mt-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* PARENT CONTAINER:
                  'items-start' is essential for sticky to work.
                  It allows the sidebar to be shorter than the main content.
                */}
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-12">

                    {/* --- MAIN CONTENT AREA --- */}
                    <div className="w-full lg:w-2/3">
                        <header className="mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                {blog.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-500 border-b pb-6">
                                <p><span className="font-semibold text-slate-800 uppercase tracking-wider">Posted By:</span> {blog.author}</p>
                                <span className="hidden md:inline text-gray-300">/</span>
                                <p><span className="font-semibold text-slate-800 uppercase tracking-wider">Date:</span> {blog.date}</p>
                                <span className="hidden md:inline text-gray-300">/</span>
                                <p>
                                    <span className="font-semibold text-slate-800 uppercase tracking-wider">In:</span>
                                    <span className="text-primary ml-1 font-medium">{blog.categories.join(", ")}</span>
                                </p>
                            </div>
                        </header>

                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-sm">
                            <Image src={blog.image} alt={blog.title} fill className="object-cover" priority />
                        </div>

                        <article className="max-w-none text-gray-700 leading-relaxed space-y-6 text-base md:text-lg">
                            <p className="text-lg md:text-2xl font-medium text-slate-900 border-l-4 border-primary pl-4 md:pl-6 py-2">
                                {blog.description}
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus non sint saepe rem eveniet sit ea esse praesentium! Expedita in recusandae sit officia ipsa, natus ad voluptatem doloribus dolorum placeat.
                            </p>
                            <div className="py-4">
                                {/* Extra content to ensure scroll depth */}
                                <p className="mb-4">
                                    Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </div>
                        </article>

                        {/* --- TAGS & SOCIAL SHARE --- */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-t border-b border-gray-100 gap-6 my-12">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="font-bold text-slate-900">Related Tags:</span>
                                {blog.tags.map((tag) => (
                                    <span key={tag} className="px-4 py-1.5 border border-gray-200 text-sm hover:border-primary hover:text-primary transition-all cursor-pointer rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <SocialShare links={blog.socialLinks} />
                        </div>

                        {/* --- COMMENTS SECTION --- */}
                        <section className="mt-10 md:mt-12">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 md:mb-10 border-b pb-4">
                                Recent Comments ({blog.comments.length})
                            </h2>
                            <div className="space-y-8">
                                {blog.comments.map((comment) => (
                                    <div key={comment.id} className="flex flex-col sm:flex-row gap-4 md:gap-6 pb-8 border-b border-gray-100 last:border-0">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 text-pink-600 flex items-center justify-center rounded-full font-bold text-lg md:text-xl shrink-0 uppercase">
                                            {comment.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-slate-900 text-base md:text-lg">{comment.name}</h4>
                                                <ReplyButton />
                                            </div>
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* --- SIDEBAR (STICKY) --- */}
                    {blog.relatedPosts.length > 0 && (
                        <aside className="w-full lg:w-1/3 mt-10 lg:mt-0">
                            <div className="lg:sticky lg:top-24 space-y-8">
                                <div className="border border-gray-100 rounded-2xl p-6 shadow-sm bg-bg-dark">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b pb-4">
                                        Related Articles
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                                        {blog.relatedPosts.map((post) => (
                                            <Link href={`/blogs/${post.id}`} key={post.id} className="group block">
                                                <div className="aspect-[16/10] relative rounded-xl overflow-hidden mb-4 bg-gray-200">
                                                    <Image
                                                        src={post.images}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <h3 className="text-md font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-400 text-xs mt-2 font-medium">{post.date}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Optional: Newsletter or Ad space can go here and will also be sticky */}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
