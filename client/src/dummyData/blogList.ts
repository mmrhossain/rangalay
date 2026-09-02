import { BlogDetails } from "@/types/blog";

export const blogList: BlogDetails[] = [
    {
        id: 1,
        title: "Top 10 Summer Fashion Trends 2025",
        date: "September 25, 2025",
        image: "/images/blog/about-thumb1.webp",
        author: "Admin",
        description: "Explore the vibrant colors and lightweight fabrics defining the upcoming summer season. From linen suits to neon accents, we cover the essential styles for 2025.",
        tags: ["Summer", "Trends", "Popular"],
        categories: ["Fashion", "Lifestyle"],
        socialLinks: [
            { platform: "facebook", url: "https://facebook.com" },
            { platform: "instagram", url: "https://instagram.com" }
        ],
        relatedPosts: [
            { id: "4", title: "How to Style Casual Outfits", date: "Sept 10, 2025", images: "/images/blog/about-thumb1.webp" },
            { id: "5", title: "Must-Have Accessories", date: "Sept 05, 2025", images: "/images/blog/about-thumb2.webp" }
        ],
        comments: [
            { id: "c1", name: "Jakes on", email: "j@test.com", text: "Excellent insights on the fabric choices!", replies: [] }
        ]
    },
    {
        id: 2,
        title: "Best Skincare Products for Glowing Skin",
        date: "September 20, 2025",
        image: "/images/blog/about-thumb2.webp",
        author: "Sarah J.",
        description: "Achieving a natural glow starts with the right ingredients. We review the top-rated serums and moisturizers that are changing the game this year.",
        tags: ["Beauty", "Skincare"],
        categories: ["Wellness", "Beauty"],
        socialLinks: [
            { platform: "twitter", url: "https://twitter.com" },
            { platform: "linkedin", url: "https://linkedin.com" }
        ],
        relatedPosts: [
            { id: "7", title: "5 Easy Skincare Routines", date: "Aug 25, 2025", images: "/images/blog/about-thumb1.webp" }
        ],
        comments: [
            { id: "c2", name: "Emma Watson", email: "emma@example.com", text: "I tried the serum you mentioned, it's amazing!", replies: [] }
        ]
    },
    {
        id: 3,
        title: "Why Sustainable Fashion is the Future",
        date: "September 15, 2025",
        image: "/images/blog/about-thumb1.webp",
        author: "Admin",
        description: "Sustainability is no longer a choice but a necessity. Discover how brands are pivoting towards ethical production and why you should care.",
        tags: ["Eco-Friendly", "Future"],
        categories: ["Industry", "Sustainability"],
        socialLinks: [
            { platform: "facebook", url: "https://facebook.com" },
            { platform: "linkedin", url: "https://linkedin.com" }
        ],
        relatedPosts: [
            { id: "1", title: "Summer Fashion Trends", date: "Sept 25, 2025", images: "/images/blog/about-thumb1.webp" }
        ],
        comments: []
    },
    {
        id: 4,
        title: "How to Style Casual Outfits Like a Pro",
        date: "September 10, 2025",
        image: "/images/blog/about-thumb2.webp",
        author: "Mike Ross",
        description: "Master the art of looking effortless. We share professional tips on layering, accessorizing, and choosing the right footwear for daily comfort.",
        tags: ["Style", "Guide"],
        categories: ["Fashion"],
        socialLinks: [
            { platform: "instagram", url: "https://instagram.com" },
            { platform: "twitter", url: "https://twitter.com" }
        ],
        relatedPosts: [
            { id: "6", title: "The Rise of Athleisure", date: "Aug 30, 2025", images: "/images/blog/about-thumb1.webp" }
        ],
        comments: []
    },
    {
        id: 5,
        title: "Must-Have Accessories for Every Wardrobe",
        date: "September 05, 2025",
        image: "/images/blog/about-thumb1.webp",
        author: "Style Editor",
        description: "The right accessory can transform an entire look. Discover the timeless pieces every wardrobe needs—from statement belts to classic gold hoops.",
        tags: ["Accessories", "Fashion"],
        categories: ["Shopping", "Trends"],
        socialLinks: [
            { platform: "facebook", url: "https://facebook.com" },
            { platform: "instagram", url: "https://instagram.com" }
        ],
        relatedPosts: [
            { id: "1", title: "Summer Fashion Trends", date: "Sept 25, 2025", images: "/images/blog/about-thumb1.webp" }
        ],
        comments: [
            { id: "c3", name: "Liam G.", email: "liam@test.com", text: "That silk scarf tip was brilliant.", replies: [] }
        ]
    },
    {
        id: 6,
        title: "The Rise of Athleisure in Modern Fashion",
        date: "August 30, 2025",
        image: "/images/blog/about-thumb2.webp",
        author: "Admin",
        description: "Gym wear isn't just for the gym anymore. We dive into how high-performance gear became a staple of high-street fashion.",
        tags: ["Athleisure", "Activewear"],
        categories: ["Fashion", "Lifestyle"],
        socialLinks: [
            { platform: "twitter", url: "https://twitter.com" },
            { platform: "facebook", url: "https://facebook.com" }
        ],
        relatedPosts: [
            { id: "4", title: "Styling Casual Outfits", date: "Sept 10, 2025", images: "/images/blog/about-thumb1.webp" }
        ],
        comments: []
    },
    {
        id: 7,
        title: "5 Easy Skincare Routines for Busy People",
        date: "August 25, 2025",
        image: "/images/blog/about-thumb1.webp",
        author: "Dr. Elena",
        description: "Don't have an hour for your face? These 5-minute routines provide maximum protection and hydration for those always on the move.",
        tags: ["Skincare", "Health"],
        categories: ["Beauty", "Wellness"],
        socialLinks: [
            { platform: "instagram", url: "https://instagram.com" },
            { platform: "linkedin", url: "https://linkedin.com" }
        ],
        relatedPosts: [
            { id: "2", title: "Best Skincare Products", date: "Sept 20, 2025", images: "/images/blog/about-thumb1.webp" }
        ],
        comments: []
    },
    {
        id: 8,
        title: "Wedding Season Trends You Can’t Miss",
        date: "August 20, 2025",
        image: "/images/blog/about-thumb2.webp",
        author: "Admin",
        description: "From pastel suits to floral maxis, we break down the guest-list dress codes for the 2025 wedding season.",
        tags: ["Wedding", "Events"],
        categories: ["Fashion", "Events"],
        socialLinks: [
            { platform: "facebook", url: "https://facebook.com" },
            { platform: "twitter", url: "https://twitter.com" },
            { platform: "instagram", url: "https://instagram.com" }
        ],
        relatedPosts: [
            { id: "1", title: "Summer Fashion Trends", date: "Sept 25, 2025", images: "/images/blog/about-thumb1.webp" }
        ],
        comments: []
    }
];