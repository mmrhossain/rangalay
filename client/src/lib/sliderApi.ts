// get sliders
import {ApiResponse} from "@/types/api";
import {Slider} from "@/types/Slider";
import {getData} from "@/lib/api";

export default async function getSliders(): Promise<ApiResponse<Slider[]> | null> {
    try {
        const result = await getData<ApiResponse<Slider[]>>("/banners/active", {
            next: { revalidate: 60 },
        });

        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}
