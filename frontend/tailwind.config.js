/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B2545',
          deep: '#071A30',
          slate: '#1E293B',
          muted: '#64748B',
          border: '#CBD5E1',
          bg: '#F4F6F9',
          white: '#FFFFFF',
        },
        saffron: {
          DEFAULT: '#D97706',
          light: '#FFF8E7',
          hover: '#B45309',
        },
        indiaGreen: {
          DEFAULT: '#15803D',
          light: '#ECFDF5',
          hover: '#166534',
        },
        status: {
          submitted: '#0284C7',
          pending: '#D97706',
          verified: '#15803D',
          approval: '#4F46E5',
          approved: '#15803D',
          disbursed: '#15803D',
          rejected: '#DC2626',
          ineligible: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(23, 50, 77, 0.06)',
        'card-hover': '0 6px 16px rgba(23, 50, 77, 0.12)',
        modal: '0 20px 40px rgba(14, 36, 56, 0.2)',
      }
    },
  },
  plugins: [],
}
