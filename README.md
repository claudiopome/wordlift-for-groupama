

## Prerequisites

- Node.js and npm installed on your machine.

## Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/claudiopome/wordlift-for-groupama.git
   
   cd wordlift-for-groupama
   ```

2. **Install Dependencies**

   ```
   npm install
    ```
3. **Start Development Server**

   ```
   npm run dev
   ```

## Usage

In `src/components/DunamicTooltip.js` you can control the number of characters displayed in the tooltip based on the screen size. This is achieved using the `useMediaQuery` hook from Material-UI.

**Example**:

```
const isMobile = useMediaQuery("(max-width:600px)"); // Adjust screen size here.

const charLimit = isMobile ? 100 : 200; // Adjust character limit for mobile and desktop here.
```

## SCSS Styling

The project uses Sass (SCSS) as CSS Preprocessor. You can find the styles in `src/index.scss` .

## Production Build

To create a production build run 

```
npm run build
```
This command will generate a `dist` directory containing the optimized and minified for production.