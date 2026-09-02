import { create } from "zustand";
import {getData} from "@/lib/api";
import {Slider, SliderState} from "@/types/Slider";
import {ApiResponse} from "@/types/api";



export const useSliderStore = create<SliderState>((set) => ({

    sliders: null,

    getSliders: async () => {
        try {
            const res = await getData<ApiResponse<Slider[]>>("/banners/active");
            const data = res?.data;
            set({sliders: data})
        } catch (error: unknown) {
            console.warn("Failed to load categories. Falling back to coming-soon placeholder.", error);
        }
    }

}));
