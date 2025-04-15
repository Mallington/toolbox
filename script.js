document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const roomPresetSelect = document.getElementById('room-preset');
    const roomWidthInput = document.getElementById('room-width');
    const roomLengthInput = document.getElementById('room-length');
    const flipRoomDimensionsCheckbox = document.getElementById('flip-room-dimensions');
    const plankWidthInput = document.getElementById('plank-width');
    const plankLengthInput = document.getElementById('plank-length');
    const flipDimensionsCheckbox = document.getElementById('flip-dimensions');
    const planksPerPackInput = document.getElementById('planks-per-pack');
    const pricePerPackInput = document.getElementById('price-per-pack');
    const startingCornerSelect = document.getElementById('starting-corner');
    const offsetSelect = document.getElementById('offset');
    const customOffsetGroup = document.getElementById('custom-offset-group');
    const customOffsetInput = document.getElementById('custom-offset');
    const calculateBtn = document.getElementById('calculate-btn');
    const roomVisualization = document.getElementById('room-visualization');
    const offcutsList = document.getElementById('offcuts-list');
    const totalPlanksSpan = document.getElementById('total-planks');
    const fullPlanksSpan = document.getElementById('full-planks');
    const cutPlanksSpan = document.getElementById('cut-planks');
    const packsRequiredSpan = document.getElementById('packs-required');
    const leftoverPlanksSpan = document.getElementById('leftover-planks');
    const totalCostSpan = document.getElementById('total-cost');

    // Room presets dimensions in meters
    const roomPresets = {
        entrance: { width: 3.10, length: 0.90 },
        lounge: { width: 5.10, length: 3.50 },
        kitchen: { width: 2.63, length: 4.60 },
        conservatory: { width: 3.03, length: 4.26 },
        bedroom1: { width: 3.83, length: 4.60 },
        bedroom2: { width: 2.70, length: 2.70 },
        bedroom3: { width: 2.70, length: 1.80 },
        shower: { width: 1.80, length: 1.70 }
    };

    // Event listeners
    roomPresetSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            // Do nothing, keep current values
        } else {
            // Set room dimensions from preset
            const preset = roomPresets[this.value];
            if (preset) {
                let width = preset.width;
                let length = preset.length;
                
                // Apply room flip if needed
                if (flipRoomDimensionsCheckbox.checked) {
                    roomWidthInput.value = length;
                    roomLengthInput.value = width;
                } else {
                    roomWidthInput.value = width;
                    roomLengthInput.value = length;
                }
                
                // Auto-visualize when preset is selected
                calculateAndVisualize();
            }
        }
    });

    // Handle flip room dimensions event
    flipRoomDimensionsCheckbox.addEventListener('change', function() {
        // Swap room width and length values
        const tempWidth = roomWidthInput.value;
        roomWidthInput.value = roomLengthInput.value;
        roomLengthInput.value = tempWidth;
        
        // Recalculate and visualize
        calculateAndVisualize();
    });

    offsetSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customOffsetGroup.style.display = 'flex';
        } else {
            customOffsetGroup.style.display = 'none';
        }
    });

    calculateBtn.addEventListener('click', calculateAndVisualize);
    
    // Also trigger calculation when inputs change
    roomWidthInput.addEventListener('change', calculateAndVisualize);
    roomLengthInput.addEventListener('change', calculateAndVisualize);
    flipDimensionsCheckbox.addEventListener('change', calculateAndVisualize);
    startingCornerSelect.addEventListener('change', calculateAndVisualize);
    planksPerPackInput.addEventListener('change', updateCostCalculations);
    pricePerPackInput.addEventListener('change', updateCostCalculations);

    // Add resize event listener with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(calculateAndVisualize, 250); // Debounce for 250ms
    });

    // Handle calculation and visualization
    function calculateAndVisualize() {
        // Get room dimensions in meters
        const roomWidth = parseFloat(roomWidthInput.value);
        const roomLength = parseFloat(roomLengthInput.value);
        
        // Get plank dimensions in centimeters and convert to meters
        const plankWidth = parseFloat(plankWidthInput.value) / 100;
        const plankLength = parseFloat(plankLengthInput.value) / 100;
        
        // Get flip dimensions setting and starting corner
        const flipDimensions = flipDimensionsCheckbox.checked;
        const startingCorner = startingCornerSelect.value;
        
        // Get offset
        let offsetRatio;
        if (offsetSelect.value === 'custom') {
            offsetRatio = parseFloat(customOffsetInput.value);
        } else {
            offsetRatio = parseFloat(offsetSelect.value);
        }
        
        // Calculate number of planks and visualize
        calculatePlanks(roomWidth, roomLength, plankWidth, plankLength, offsetRatio, flipDimensions, startingCorner);
    }
    
    function calculatePlanks(roomWidth, roomLength, plankWidth, plankLength, offsetRatio, flipDimensions, startingCorner) {
        // Clear previous visualization
        roomVisualization.innerHTML = '';
        offcutsList.innerHTML = '<div class="offcuts-title">Cutting List - Required Pieces</div>';
        
        // Set room dimensions for visualization
        const scale = calculateScale(roomWidth, roomLength);
        roomVisualization.style.width = (roomWidth * scale) + 'px';
        roomVisualization.style.height = (roomLength * scale) + 'px';
        
        // Add dimension indicators
        addDimensionIndicators(roomWidth, roomLength, scale);
        
        // Track statistics
        let totalPlanks = 0;
        let fullPlanks = 0;
        let cutPlanks = 0;
        let plankSequence = 1; // Counter for sequence numbers
        
        // Track cut pieces by dimensions
        let cutPieces = {};
        
        // Handle flipped dimensions
        let actualPlankWidth = plankWidth;
        let actualPlankLength = plankLength;
        if (flipDimensions) {
            actualPlankWidth = plankLength;
            actualPlankLength = plankWidth;
        }
        
        // Calculate number of rows based on plank width
        const numRows = Math.ceil(roomLength / actualPlankWidth);
        
        // Process starting corner
        const reverseX = startingCorner.includes('right');
        const reverseY = startingCorner.includes('bottom');
        
        // Generate planks for each row
        for (let row = 0; row < numRows; row++) {
            // Get current row position
            const rowPosition = reverseY ? (numRows - 1 - row) : row;
            const currentY = rowPosition * actualPlankWidth;
            
            // Calculate row offset based on the offsetRatio and alternating rows
            let rowOffset = 0;
            const isOffsetRow = reverseY ? (rowPosition % 2 === 0) : (rowPosition % 2 === 1);
            if (isOffsetRow) {
                rowOffset = actualPlankLength * offsetRatio;
            }
            
            // Set starting X position based on corner
            let currentX = reverseX ? roomWidth - (reverseX ? 0 : rowOffset) : -rowOffset;
            
            // Add planks until we cover the room width
            while ((reverseX ? currentX > 0 : currentX < roomWidth)) {
                // Calculate plank dimensions and position
                let usablePlankLength = actualPlankLength;
                let isCut = false;
                let actualX = currentX;
                
                if (reverseX) {
                    // Handle right-side starting point
                    // Check if plank extends beyond the left edge
                    if (currentX - actualPlankLength < 0) {
                        usablePlankLength = currentX;
                        isCut = true;
                    }
                    actualX = currentX - usablePlankLength;
                } else {
                    // Handle left-side starting point
                    // Check if plank extends beyond the right edge
                    if (currentX + actualPlankLength > roomWidth) {
                        usablePlankLength = roomWidth - currentX;
                        isCut = true;
                    }
                    
                    // Check if plank extends beyond the left edge
                    if (currentX < 0) {
                        usablePlankLength += currentX; // Reduce length by the amount it extends left
                        actualX = 0;
                        isCut = true;
                    }
                }
                
                // Only create valid planks that have some part inside the room
                if (usablePlankLength > 0 && 
                    (reverseX ? actualX >= 0 : actualX < roomWidth)) {
                    // Create plank element
                    const plank = document.createElement('div');
                    plank.className = 'plank' + (isCut ? ' cut' : '');
                    plank.style.left = (actualX * scale) + 'px';
                    plank.style.top = (currentY * scale) + 'px';
                    plank.style.width = (usablePlankLength * scale) + 'px';
                    plank.style.height = (actualPlankWidth * scale) + 'px';
                    
                    // Add sequence number to plank
                    const sequenceLabel = document.createElement('span');
                    sequenceLabel.className = 'plank-number';
                    sequenceLabel.textContent = plankSequence;
                    plank.appendChild(sequenceLabel);
                    
                    // Add plank to visualization
                    roomVisualization.appendChild(plank);
                    
                    // Update statistics
                    totalPlanks++;
                    plankSequence++;
                    
                    if (isCut) {
                        cutPlanks++;
                        
                        // Track cut piece dimensions
                        // Round to 2 decimal places for grouping similar cuts
                        const cutWidth = parseFloat(actualPlankWidth.toFixed(2));
                        const cutLength = parseFloat(usablePlankLength.toFixed(2));
                        const cutKey = `${cutWidth}x${cutLength}`;
                        
                        if (!cutPieces[cutKey]) {
                            cutPieces[cutKey] = {
                                width: cutWidth,
                                length: cutLength,
                                quantity: 0,
                                ratio: cutLength / actualPlankLength
                            };
                        }
                        
                        cutPieces[cutKey].quantity++;
                    } else {
                        fullPlanks++;
                    }
                }
                
                // Move to the next plank position
                currentX = reverseX ? (currentX - actualPlankLength) : (currentX + actualPlankLength);
            }
        }
        
        // Update statistics display
        totalPlanksSpan.textContent = totalPlanks;
        fullPlanksSpan.textContent = fullPlanks;
        cutPlanksSpan.textContent = cutPlanks;
        
        // Display offcuts list
        displayOffcutsList(cutPieces, actualPlankLength, actualPlankWidth, fullPlanks);
    }
    
    // Display the offcuts list with visualizations
    function displayOffcutsList(cutPieces, fullPlankLength, plankWidth, fullPlanksCount) {
        // Sort offcuts by length (descending)
        const sortedOffcuts = Object.values(cutPieces).sort((a, b) => b.length - a.length);
        
        // Create visual for each unique cut piece
        sortedOffcuts.forEach(cutPiece => {
            const offcutItem = document.createElement('div');
            offcutItem.className = 'offcut-item';
            
            // Calculate visual dimensions
            const maxVisualWidth = 180; // max width for the visual in the sidebar
            const scale = maxVisualWidth / fullPlankLength;
            const visualWidth = cutPiece.length * scale;
            const visualHeight = plankWidth * scale;
            
            // Create visual element
            const visual = document.createElement('div');
            visual.className = 'offcut-visual';
            visual.style.width = visualWidth + 'px';
            visual.style.height = visualHeight + 'px';
            
            // Create dimension label
            const dimensionLabel = document.createElement('div');
            dimensionLabel.className = 'offcut-dimensions';
            dimensionLabel.textContent = `${(cutPiece.length * 100).toFixed(1)} × ${(cutPiece.width * 100).toFixed(1)} cm`;
            
            // Create proportion label (e.g. "1/3 of full plank")
            const proportion = Math.round(cutPiece.ratio * 100);
            const proportionLabel = document.createElement('div');
            proportionLabel.className = 'offcut-label';
            proportionLabel.textContent = `${proportion}% of full plank`;
            
            // Create quantity indicator
            const quantityDiv = document.createElement('div');
            quantityDiv.className = 'offcut-quantity';
            
            const quantityLabel = document.createElement('span');
            quantityLabel.className = 'offcut-quantity-icon';
            quantityLabel.textContent = '×';
            
            const quantityValue = document.createElement('span');
            quantityValue.className = 'offcut-quantity-value';
            quantityValue.textContent = cutPiece.quantity;
            
            quantityDiv.appendChild(quantityLabel);
            quantityDiv.appendChild(quantityValue);
            
            // Assemble the item
            offcutItem.appendChild(visual);
            offcutItem.appendChild(dimensionLabel);
            offcutItem.appendChild(proportionLabel);
            offcutItem.appendChild(quantityDiv);
            
            // Add to offcuts list
            offcutsList.appendChild(offcutItem);
        });
        
        // Add full planks information
        const fullPlankItem = document.createElement('div');
        fullPlankItem.className = 'offcut-item full-planks-item';
        
        // Calculate visual dimensions for full plank
        const maxVisualWidth = 180;
        const scale = maxVisualWidth / fullPlankLength;
        const visualWidth = fullPlankLength * scale;
        const visualHeight = plankWidth * scale;
        
        // Create visual element
        const fullPlankVisual = document.createElement('div');
        fullPlankVisual.className = 'full-plank-visual';
        fullPlankVisual.style.width = visualWidth + 'px';
        fullPlankVisual.style.height = visualHeight + 'px';
        
        // Create dimension label
        const dimensionLabel = document.createElement('div');
        dimensionLabel.className = 'offcut-dimensions';
        dimensionLabel.textContent = `${(fullPlankLength * 100).toFixed(1)} × ${(plankWidth * 100).toFixed(1)} cm`;
        
        // Create proportion label
        const fullPlankLabel = document.createElement('div');
        fullPlankLabel.className = 'offcut-label';
        fullPlankLabel.textContent = 'Full Planks';
        
        // Create quantity indicator
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'offcut-quantity';
        
        const quantityLabel = document.createElement('span');
        quantityLabel.className = 'offcut-quantity-icon';
        quantityLabel.textContent = '×';
        
        const quantityValue = document.createElement('span');
        quantityValue.className = 'offcut-quantity-value';
        quantityValue.textContent = fullPlanksCount;
        
        quantityDiv.appendChild(quantityLabel);
        quantityDiv.appendChild(quantityValue);
        
        // Assemble the item
        fullPlankItem.appendChild(fullPlankVisual);
        fullPlankItem.appendChild(dimensionLabel);
        fullPlankItem.appendChild(fullPlankLabel);
        fullPlankItem.appendChild(quantityDiv);
        
        // Add to offcuts list
        offcutsList.appendChild(fullPlankItem);
        
        // Use optimized cost calculation that considers offcut reuse
        updateOptimizedCostCalculations(cutPieces, fullPlankLength, plankWidth);
    }
    
    // Add dimension indicators to the visualization
    function addDimensionIndicators(roomWidth, roomLength, scale) {
        // Create width dimension indicator
        const widthIndicator = document.createElement('div');
        widthIndicator.className = 'dimension-indicator width-indicator';
        widthIndicator.style.width = (roomWidth * scale) + 'px';
        widthIndicator.innerHTML = `<span class="dimension-label">${roomWidth.toFixed(2)}m</span>`;
        roomVisualization.appendChild(widthIndicator);
        
        // Create height dimension indicator
        const heightIndicator = document.createElement('div');
        heightIndicator.className = 'dimension-indicator height-indicator';
        heightIndicator.style.height = (roomLength * scale) + 'px';
        heightIndicator.innerHTML = `<span class="dimension-label">${roomLength.toFixed(2)}m</span>`;
        roomVisualization.appendChild(heightIndicator);
    }
    
    // Calculate cost and pack requirements
    function updateCostCalculations(totalPlanks) {
        // Use the value passed in, or get it from the span if not provided
        if (typeof totalPlanks !== 'number') {
            totalPlanks = parseInt(totalPlanksSpan.textContent) || 0;
        }
        
        // Get pack details
        const planksPerPack = parseInt(planksPerPackInput.value) || 1;
        const pricePerPack = parseFloat(pricePerPackInput.value) || 0;
        
        // Calculate packs required (round up to whole packs)
        const packsRequired = Math.ceil(totalPlanks / planksPerPack);
        
        // Calculate leftover planks
        const leftoverPlanks = (packsRequired * planksPerPack) - totalPlanks;
        
        // Calculate total cost
        const totalCost = packsRequired * pricePerPack;
        
        // Update display
        packsRequiredSpan.textContent = packsRequired;
        leftoverPlanksSpan.textContent = leftoverPlanks;
        totalCostSpan.textContent = totalCost.toFixed(2);
    }
    
    // Calculate optimized cost considering offcut reuse
    function updateOptimizedCostCalculations(cutPieces, fullPlankLength, actualPlankWidth) {
        // Get the number of full planks needed
        const fullPlanksNeeded = parseInt(fullPlanksSpan.textContent) || 0;
        
        // Get pack details
        const planksPerPack = parseInt(planksPerPackInput.value) || 1;
        const pricePerPack = parseFloat(pricePerPackInput.value) || 0;
        
        // Create a list of all cut pieces
        let allCutPieces = [];
        for (const key in cutPieces) {
            const piece = cutPieces[key];
            for (let i = 0; i < piece.quantity; i++) {
                allCutPieces.push({
                    width: piece.width,
                    length: piece.length,
                    ratio: piece.ratio
                });
            }
        }
        
        // Sort all cut pieces by length (descending)
        allCutPieces.sort((a, b) => b.length - a.length);
        
        // Initialize plank usage
        let planksUsed = fullPlanksNeeded;
        let currentOffcuts = [];
        
        // Process all cut pieces to see how many can fit in offcuts
        for (const piece of allCutPieces) {
            // Check if there's an existing offcut that can fit this piece
            let foundOffcut = false;
            
            for (let i = 0; i < currentOffcuts.length; i++) {
                const offcut = currentOffcuts[i];
                if (offcut.remainingLength >= piece.length) {
                    // We can fit this piece in this offcut
                    offcut.remainingLength -= piece.length;
                    foundOffcut = true;
                    break;
                }
            }
            
            if (!foundOffcut) {
                // Need to use a new plank
                planksUsed++;
                // Add the remaining part as an offcut
                const remainingLength = fullPlankLength - piece.length;
                if (remainingLength > 0) {
                    currentOffcuts.push({
                        width: actualPlankWidth,
                        remainingLength: remainingLength
                    });
                }
            }
        }
        
        // Sort offcuts by remaining length (ascending) for better display
        currentOffcuts.sort((a, b) => a.remainingLength - b.remainingLength);
        
        // Calculate packs required based on optimized plank usage
        const optimizedPacksRequired = Math.ceil(planksUsed / planksPerPack);
        
        // Calculate leftover planks
        const leftoverPlanks = (optimizedPacksRequired * planksPerPack) - planksUsed;
        
        // Calculate total cost
        const totalCost = optimizedPacksRequired * pricePerPack;
        
        // Update display
        packsRequiredSpan.textContent = optimizedPacksRequired;
        leftoverPlanksSpan.textContent = leftoverPlanks;
        totalCostSpan.textContent = totalCost.toFixed(2);
    }
    
    // Calculate appropriate scale based on room dimensions
    function calculateScale(roomWidth, roomLength) {
        const roomContainer = document.querySelector('.room-container');
        const roomVisualizationElement = document.getElementById('room-visualization');
        
        // Get dimensions of the container
        const containerWidth = roomContainer.clientWidth;
        const containerHeight = roomContainer.clientHeight;
        
        // Calculate scale factors to fit both dimensions
        const widthScale = (containerWidth - 20) / roomWidth;
        const heightScale = (containerHeight - 20) / roomLength;
        
        // Use the smaller scale to ensure room fits in the container
        return Math.min(widthScale, heightScale);
    }
    
    // Initialize with default values
    calculateAndVisualize();
}); 