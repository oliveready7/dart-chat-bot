const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            minWidth: {
                64: '16rem'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}
