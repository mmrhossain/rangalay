import React from "react";
import {blogList} from "@/dummyData/blogList";
import BlogDetails from "@/components/blog/BlogDetails";



export default async function BlogDetailsPage({params}: {params: Promise<{ id: number }>}) {
    const {id} = await params;

    const blog = blogList.find((b) => b.id === Number(id));
    if (!blog) return null;

    return (
        <BlogDetails blog={blog} />
    );
}