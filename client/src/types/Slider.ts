


export interface Slider {
    image: string;
    link: string;
    image_url: string;
}

export interface SliderState {
    sliders: Slider[] | null;
    getSliders: () => Promise<void>;
}