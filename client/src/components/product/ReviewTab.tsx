"use client";

import React, { useState } from "react";
import {Rating, Star,} from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

const ReviewTab = () => {
    const [rating, setRating] = useState(5);

    // Demo Data matching "review 1.PNG"
    const demoReviews = [
        {
            id: 1,
            name: "Ariful Islam",
            date: "October 24, 2025",
            rating: 5,
            comment: "পণ্যের মান অসাধারণ! কাপড়ের কোয়ালিটি এবং ফিনিশিং আমার প্রত্যাশার চেয়েও ভালো ছিল। ডেলিভারিও খুব দ্রুত পেয়েছি। ধন্যবাদ রাঙালয়!"
        },
        {
            id: 2,
            name: "Nusrat Jahan",
            date: "December 12, 2025",
            rating: 4,
            comment: "ডিজাইনটা খুব সুন্দর, একদম ছবির মতোই দেখতে। সাইজ চার্ট দেখে অর্ডার করেছিলাম, ফিটিং পারফেক্ট হয়েছে। তবে ডেলিভারি চার্জটা একটু বেশি মনে হয়েছে।"
        },
        {
            id: 3,
            name: "Sabbir Ahmed",
            date: "January 05, 2026",
            rating: 5,
            comment: "অল্প দামে প্রিমিয়াম কোয়ালিটি। বিশেষ করে কালারটা ধোয়ার পরেও একদম ঠিক আছে। আমি অবশ্যই আবার অর্ডার করবো।"
        }
    ];


    return (
        <div className="animate-in fade-in duration-500">
            {/* Customer Reviews Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Customer Reviews</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <Rating value={5} readOnly style={{ maxWidth: 100 }} />
                        <span className="text-sm text-primary font-medium">Based on {demoReviews.length} reviews</span>
                    </div>
                </div>
                {/*<button className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-semibold hover:bg-black transition-all">*/}
                {/*    Write A Review*/}
                {/*</button>*/}
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Reviews List */}
            <div className="space-y-10 mb-16">
                {demoReviews.map((review) => (
                    <div key={review.id} className="flex gap-6 border-b border-gray-100 pb-8 lg:p-5 last:border-0 bg-white">
                        {/* Placeholder Avatar */}
                        <div className="shrink-0">
                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                                120X120
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-lg text-primary">{review.name}</h4>
                                    <div className="my-1">
                                        <Rating value={review.rating} readOnly style={{ maxWidth: 80 }} />
                                    </div>
                                </div>
                                <span className="text-sm border border-gray-200 px-3 py-1 text-gray-500">
                                    {review.date}
                                </span>
                            </div>
                            <p className="text-secondary mt-3 leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white lg:p-5 rounded-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Add a review</h3>
                <div className="mb-6">
                    <Rating
                        value={rating}
                        onChange={setRating}
                        style={{ maxWidth: 120 }}
                        itemStyles={{
                            itemShapes: Star, // Change from undefined to Star
                            activeFillColor: '#ffb400',
                            inactiveFillColor: '#e5e7eb'
                        }}
                    />
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <Textarea
                        rows={6}
                        placeholder="Your Comments...."
                        className="w-full border border-gray-200 p-4 rounded-sm focus:outline-none focus:border-primary transition-colors resize-none bg-white focus-visible:ring-0"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="text"
                            placeholder="Your Name...."
                            className="w-full border border-gray-200 px-4 py-5 rounded-sm focus:outline-none focus:border-primary transition-colors bg-white"
                        />
                        <Input
                            type="email"
                            placeholder="Your Email...."
                            className="w-full border border-gray-200 px-4 py-5 rounded-sm focus:outline-none focus:border-primary transition-colors bg-white"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-black text-white px-10 py-3 uppercase font-bold text-sm tracking-widest transition-all duration-300 rounded-sm"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewTab;