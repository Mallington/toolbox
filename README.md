# Laminate Flooring Calculator

A simple, responsive web application that helps you visualize and calculate how many pieces of laminate flooring you'll need for a rectangular room.

## Features

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
2. Either:
   - Select a preset room from the dropdown menu, or
   - Enter your custom room dimensions (width and length in meters)
   - Use "Flip Room Width/Length" to swap dimensions if needed
3. Specify the plank dimensions (width and length in centimeters)
4. Enter pack details:
   - Number of planks per pack
   - Price per pack
5. Choose layout options:
   - Flip Plank Width/Length: Toggle to swap plank dimensions
   - Starting Corner: Top Left (default), Top Right, Bottom Left, or Bottom Right
   - Offset Ratio: No offset, 50% (Half), 33% (Third), 25% (Quarter), or Custom
6. Click "Calculate & Visualize" to see the results

The results will show:
- Visualization: Full planks in darker orange, cut planks in lighter orange
- Plank statistics: Total, full, and cut planks
- Cost calculations: Number of packs required, leftover planks, and total cost

## Room Presets

The application includes presets for the following rooms:

**Ground Floor:**
- Entrance Hall (3.10m x 0.90m)
- Lounge (5.10m x 3.50m)
- Kitchen/Diner (2.63m x 4.60m)
- Conservatory (3.03m x 4.26m)

**1st Floor:**
- Bedroom 1 (3.83m x 4.60m)
- Bedroom 2 (Ioana's Office) (2.70m x 2.70m)
- Bedroom 3 (Mat's Office) (2.70m x 1.80m)
- Shower Room (1.80m x 1.70m)

## Default Values

- Default plank size: 128.5 × 19.2cm (common laminate flooring dimension)
- Default pack size: 6 planks per pack
- Default price: £22.65 per pack

## Technical Details

This application is built with:
- HTML5
- CSS3 (with a responsive design)
- Vanilla JavaScript (no frameworks required)

## Running the Application

Simply open the `index.html` file in a web browser. No server or installation is required. 