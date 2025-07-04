# Touchscreen Web Testing Application

A web application for testing various HTML input elements and touch interactions. Built with Next.js, TypeScript, and Tailwind CSS.

## Prerequisites

- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) - For managing Node.js versions

## Getting Started

Follow these steps to set up and run the project:

1. **Install the correct Node.js version**
   ```bash
   nvm install    # Installs Node.js version from .nvmrc
   nvm use       # Switches to the project's Node.js version
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Features

The application includes testing capabilities for:

- Text Input
- Number Input
- Range Slider
- Checkbox
- Radio Buttons
- Select/Dropdown Menu
- Textarea
- Date Picker
- Color Picker
- File Upload
- Vertical Scrolling
- Horizontal Scrolling

## Testing Process

1. Interact with each input element to test its functionality
2. The status of each element will update from "Not Tested" to "Tested" after interaction
3. Click "Submit Form and View Report" to see a detailed test report
4. Use the "Start New Test" button on the report page to begin a new testing session

## Project Structure

```
touchscreen-web/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/         # API routes
│   │   ├── page.tsx     # Main page
│   │   └── report/      # Report page
│   └── components/      # React components
├── .nvmrc               # Node.js version specification
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## Troubleshooting

If you encounter any issues:

1. **Node.js version mismatch**
   ```bash
   nvm install
   nvm use
   npm install
   ```

2. **Port already in use**
   ```bash
   # Kill the process using port 3000 and try again
   npm run dev
   ```

3. **Dependencies issues**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

The application is tested and supported on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with touch support
