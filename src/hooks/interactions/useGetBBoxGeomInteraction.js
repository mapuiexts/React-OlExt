import {useCallback, useState, useEffect} from 'react';
import {platformModifierKeyOnly} from 'ol/events/condition';
import OlOverlay from 'ol/Overlay';
import OlSourceVector from 'ol/source/Vector';
import DragBox from 'ol/interaction/DragBox';
import './interactions.css';

/**
 * Hook to retrieve the BBox geometry by allowing the
 * user to draw a vector box by clicking and dragging on the map
 * @param {*} map 
 * @param {*} msg 
 */
const useGetBBoxGeomInteraction = (
    map, 
    msg = 'Ctrl + Pick and drag to draw BBox or &lt;esc&gt; to Cancel'
    
) => {

    /**
     * The ol.geometry to be shown during the operation and
     * to be returned to caller.
     */
    const [geometry, setGeometry] = useState(null);

    const boxStartHandler = useCallback((evt) => {
        //console.log('boxstart fired', evt);
    }, []);

    const boxDragHandler = useCallback((evt) => {
        //console.log('boxdrag fired', evt);
    }, []);

    const boxCancelHandler = useCallback((evt) => {
        //console.log('boxcancel fired', evt);
    }, []);

    /**
     * Method to create BBox Interaction.
     * The interaction will start once it is added
     * to the map. Once the interaction is started,
     * a temporary feature will be shown
     * 
     * @param {} map 
     * @param {*} source 
     */
    const createInteraction = useCallback((map, source) => {
        //create drag box interaction
        const dragBox = new DragBox({
            condition: platformModifierKeyOnly
        });
        //register interaction
        dragBox.on('boxstart', boxStartHandler);
        dragBox.on('boxdrag', boxDragHandler);
        //register 'boxend' event
        dragBox.on('boxend', (evt) => {
            setGeometry(dragBox.getGeometry());
            setIsRunning(false);
        });
        dragBox.on('boxcancel', boxCancelHandler);
        //activate interaction
        dragBox.setActive(false);

        return dragBox;
    },[boxStartHandler, boxDragHandler, boxCancelHandler]);

    /**
     * Method to create the tooltip.
     * 
     */
    const createTooltip = useCallback(() => {
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip-hidden';
        //create overlay tooltip
        const tooltip = new OlOverlay({
            element: tooltipEl,
            offset: [15, 0],
            positioning: 'center-left'
        });
        return tooltip;
    }, []);

    /**
     * Overlay to show the tooltip messages.
     *  @type {ol.Overlay}
     */
    //const [tooltip, setTooltip] = useState(createTooltip(map));
    const tooltip = useState(createTooltip())[0];
    
     /**
     * State to indicate if the interaction is running
     */
    const [isRunning, setIsRunning] = useState(false);

     /**
     * The DragBox Interaction created initially
     * @type {ol.interaction.DragBox}
     */
    const interaction = useState(createInteraction(map, new OlSourceVector()))[0];

     /**
     * Handler to handle the event 'mouseout' for the 
     * ol.Viewport. This event is fired once the mouse
     * is outside the viewport area.
     * This method will hide the tooltip once the mouse
     * is outside the viewport area.
     */
    const mouseOutHandler = useCallback(() => {
        if(tooltip && tooltip.getElement()) {
           tooltip.getElement().innerHTML = "";
           tooltip.getElement().className = 'tooltip-hidden'
       }
   }, [tooltip]);


   /**
     * Handler to handle the event 'pointermove' fired
     * by ol.Map.
     * Triggered when a pointer is moved. Note that on touch devices 
     * this is triggered when the map is panned, so is not the same as 
     * mousemove.
     * This handler will reposition the tooltip in the current mouse
     * position
     */
    const pointerMoveHandler = useCallback((evt) => {
        if (evt.dragging) {
            return;
        }

        if(tooltip && tooltip.getElement()) {
            tooltip.getElement().innerHTML = msg;
            tooltip.getElement().className = 'tooltip';
        }
        
        if(tooltip) tooltip.setPosition(evt.coordinate);

    },[tooltip, msg]);


    /**
     * Callback to start the interaction
     */
    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    /**
     * Callback to stop the interaction
     */
    const stop = useCallback(() => {
        setIsRunning(false);
    }, []);

    /**
     * Method to clear the retrieved geometry data
     */
    const clear = useCallback(() => {
        setGeometry(null);
    }, []);

    /**
     * Event handler to cancel the interaction 
     * if the user press the <esc> key
     */
    const escKeyHandler = useCallback((evt) => {
        if(evt.keyCode === 27) {
            stop();
        }
    }, [stop]);

    /**
     * Method to clean-up
     */
    const cleanup = useCallback(() => {
        document.removeEventListener('keydown', escKeyHandler);
        interaction.setActive(false);
        map.removeOverlay(tooltip);
        map.getViewport().removeEventListener('mouseout', mouseOutHandler);
        map.un('pointermove', pointerMoveHandler);
        mouseOutHandler();
    }, [interaction, map, tooltip, escKeyHandler, mouseOutHandler, pointerMoveHandler])

    /**
     * Effect to start/stop the interaction based
     * on the 'isRunning' state
     */
    useEffect(() => {
        if(isRunning) {
            document.addEventListener('keydown', escKeyHandler);
            interaction.setActive(true);
            map.addOverlay(tooltip);
            map.getViewport().addEventListener('mouseout', mouseOutHandler);
            map.on('pointermove', pointerMoveHandler);
        }
        else {
            cleanup();
        }
        return () => {
            cleanup();
        }
    }, [isRunning, interaction, map, tooltip, cleanup, pointerMoveHandler, mouseOutHandler, escKeyHandler]);

    /**
     * Effect to add/remove the interaction from the map
     */
    useEffect(() => {
        map.addInteraction(interaction);
        return () => {
            map.removeInteraction(interaction);
        }
    }, [createInteraction, interaction, map]);

    return {start, stop, clear, geometry, isRunning};
};

export default useGetBBoxGeomInteraction;