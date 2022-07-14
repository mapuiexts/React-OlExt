import OlOverlay from 'ol/Overlay';

/**
 * Method to create the tooltip.
 * 
 */
 export const createTooltip = () => {
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltip-hidden';
    //create overlay tooltip
    const tooltip = new OlOverlay({
        element: tooltipEl,
        offset: [15, 0],
        positioning: 'center-left'
    });
    return tooltip;
};

/**
 * Method to create the measure tooltip.
 * 
 */
 export const createMeasureTooltip = () => {
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltip tooltip-measure';
    //create overlay tooltip
    const tooltip = new OlOverlay({
        element: tooltipEl,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    return tooltip;
};


/**
 * Handler to handle the event 'mouseout' for the 
 * ol.Viewport. This event is fired once the mouse
 * is outside the viewport area.
 * This method will hide the tooltip once the mouse
 * is outside the viewport area.
 */
export const mouseOut = (tooltip) => {
    if(tooltip && tooltip.getElement()) {
        tooltip.getElement().innerHTML = "";
        tooltip.getElement().className = 'tooltip-hidden'
    }
};

/**
 * Handler to handle the event 'pointermove' fired
 * by ol.Map.
 * Triggered when a pointer is moved. Note that on touch devices 
 * this is triggered when the map is panned, so is not the same as 
 * mousemove.
 * This handler will reposition the tooltip in the current mouse
 * position
 */
export const pointerMove = (evt, tooltip, msg) => {
    if (evt.dragging) {
        return;
    }

    if(tooltip && tooltip.getElement()) {
        tooltip.getElement().innerHTML = msg;
        tooltip.getElement().className = 'tooltip';
    }
    
    if(tooltip) tooltip.setPosition(evt.coordinate);

};;