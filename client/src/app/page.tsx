import ProductSlider from "@/components/product/ProductSlider";
import Features from "@/components/shared/Features";
import getSliders from "@/lib/sliderApi";
import { Category } from "@/types/category";
import { getCategories } from "@/lib/categoriesApi";
import { Slider } from "@/types/Slider";
import ProductListByRemark from "@/components/product/ProductListByRemark";
import DealOfferBanner from "@/components/shared/DealOfferBanner";
import BlogList from "@/components/blog/BlogList";
import Banner from "@/components/product/Banner";
import SliderSkeleton from "@/skeleton/SliderSkeleton";
import BannerSkeleton from "@/skeleton/BannerSkeleton";

export default async function Home() {
    let sliders: Slider[] = [];
    let categories: Category[] = [];


    const [slidersResult, categoriesResult] = await Promise.all([
        getSliders(),
        getCategories(),
    ]);

    sliders = slidersResult?.data || [];
    categories = categoriesResult?.data?.slice(0, 4) || [];

    return (
        <div>
            {/* 🔹 Slider Section */}
            <section>
                {sliders.length > 0 ? (
                    <ProductSlider sliders={sliders} />
                ) : (
                    <SliderSkeleton />
                )}
            </section>

            {/* 🔹 Banner Section */}
            <section>
                {categories.length > 0 ? (
                    <Banner categories={categories} />
                ) : (
                    <BannerSkeleton />
                )}
            </section>

            {/* 🔹 Other Sections (always render) */}
            <ProductListByRemark />
            <DealOfferBanner />
            <BlogList />
            <Features />

        </div>
    );
}