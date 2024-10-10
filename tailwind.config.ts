import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        'chat-layout': 'auto 1fr',
      },
      colors: {
        'background-gray': '#202223',
        'bg-gray-light': '#26292a',
        'border-gray': '#2d3031',
        'hover-gray': '#2e3132',
        'primary-text': '#fbfbfb',
        'secondary-text': '#71787b',
        'tertiary-text': '#4f5456',
      },
    },
  },
  plugins: [],
};
export default config;
