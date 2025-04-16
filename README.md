# Toolbox

A collection of useful web-based tools and calculators. Each tool works standalone in your browser without requiring any server-side components.

## Structure

The Toolbox is designed as a collection of separate apps with a central launcher. Each app is self-contained in its own directory.

- `/index.html` - Main app launcher
- `/css/` - Contains shared and app-launcher CSS
- `/js/` - Contains shared JavaScript files
- `/images/` - Shared images
- `/apps/` - Contains all the individual apps

## Current Apps

### Laminate Flooring Calculator

A simple, responsive web application that helps you visualize and calculate how many pieces of laminate flooring you'll need for a rectangular room.

#### Features

- Select from predefined room presets based on floor plans or use custom dimensions
- Input the dimensions of your rectangular room
- Flip room width and length with a single click
- Specify the size of the flooring planks
- Flip plank width and length with a single click
- Select which corner to start the layout from (top-left, top-right, bottom-left, or bottom-right)
- Adjust the offset pattern of how planks are stacked
- Calculate total, full, and cut planks needed
- Calculate cost and material requirements based on pack size and price
- View leftover materials to minimize waste
- Visualize the layout of planks in your room

## How to Use

1. Open `index.html` in any modern web browser
2. Select the app you want to use from the launcher
3. Each app has its own instructions and functionality

## Adding New Apps

The Toolbox is designed to easily add new apps:

1. Create a new directory under `/apps/`
2. Implement your app using the shared CSS framework for consistent styling
3. Add your app to the launcher by updating the main `index.html`

## Technical Details

- The Toolbox is built with:
  - HTML5
  - CSS3 (with responsive design)
  - Vanilla JavaScript (no frameworks required)
- Each app follows a modular structure to prevent style conflicts
- Dark mode support via CSS variables and `prefers-color-scheme`

## Running the Application

Simply open the `index.html` file in a web browser. No server or installation is required. 