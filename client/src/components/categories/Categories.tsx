import {Category} from "@/types/category";
import CategoryCard from "@/components/categories/CategoryCard";

const Categories = ({categories}: {categories: Category[]}) => {


    return (
        <div className="container mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    categories?.map((category: Category) => {
                        const cat = category.slug;
                        return (
                            <div key={category?.id}>
                                <CategoryCard category={category} parent_category={cat} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Categories;