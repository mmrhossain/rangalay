/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container :{
            center: true,
            padding: {
                DEFAULT: "1rem", // ~16px padding on all sides
                sm: "1rem",
                md: "1.5rem",
                lg: "2rem",
                xl: "2rem",
                "2xl": "1rem",
            },
            screens: {
                xs: "480px",
                sm: "640px",   // ✅ Small tablets
                md: "768px",   // ✅ Tablets
                lg: "1024px",  // ✅ Laptops
                xl: "1280px",  // ✅ Desktops
                "2xl": "1536px", // ✅ Large desktops
            }
        },
        extend: {
            colors: {
                "primary": "#771A09",
                "btn-hover": "#771A09",
                "secondary": "#202020",
                "dark-color": "#242424",
                "light-color": "#fcfcfc",
                "light-color2": "#aaaaaa",
                "sky-color" : "#647589",
                "border-dark": "#383434",
                "border-color": "#e7e7e7",
                "danger": "#F44336",
                "bg-primary":  "#F9F9F9",
            }
        },
    },
    plugins: [

    ],
}

