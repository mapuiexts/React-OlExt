import {useCallback, useState, useRef} from 'react';
import {Translate} from 'ol/interaction';
import Collection from 'ol/Collection';
import {createTooltip, mouseOut, pointerMove} from '../../../core/interaction';

const useTranslateInteraction = (map, msg) => {

    const interactionRef = useRef(null);
    const tooltipRef = useRef(null);
    const [translatedFeatures, setTranslatedFeatures] = useState(null);
    const [isRunning, setIsRunning] = useState(false);


    let escKeyHandler = null;

    /**
     * Handler to handle the event 'mouseout' for the 
     * ol.Viewport. This event is fired once the mouse
     * is outside the viewport area.
     * This method will hide the tooltip once the mouse
     * is outside the viewport area.
     */
     const mouseOutHandler = useCallback(() => {
         mouseOut(tooltipRef.current);
     }, []);
    
     

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
        pointerMove(evt, tooltipRef.current, msg);
     }, [msg]);


    /**
     * Callback to stop the interaction
     */
     const stop = useCallback(() => {
        if(interactionRef.current) {
            interactionRef.current.setActive(false);
            map.removeInteraction(interactionRef.current);
            interactionRef.current = null;
        }

        document.removeEventListener('keydown', escKeyHandler);
        map.removeOverlay(tooltipRef.current);
        map.getViewport().removeEventListener('mouseout', mouseOutHandler);
        map.un('pointermove', pointerMoveHandler);
        setIsRunning(false);

    }, [map, escKeyHandler, mouseOutHandler, pointerMoveHandler]);

    /**
     * Event handler to cancel the interaction 
     * if the user press the <esc> key
     */
     escKeyHandler = useCallback((evt) => {
        if(evt.keyCode === 27) {
            stop();
            console.log('translate command cancelled');
            setTranslatedFeatures(new Collection());
        }
    }, [stop]);


    /**
     * Handler for the event triggered upon 
     * feature translation start.
     */
    const translateStartHandler = useCallback((evt) => {
        console.log('translate start event', evt);

        document.removeEventListener('keydown', escKeyHandler);
        map.removeOverlay(tooltipRef.current);
        map.getViewport().removeEventListener('mouseout', mouseOutHandler);
        map.un('pointermove', pointerMoveHandler);
        
    }, [escKeyHandler, map, mouseOutHandler, pointerMoveHandler]);

    /**
     * Handler for the event triggered upon 
     * feature translation end.
     */
     const translateEndHandler = useCallback((evt) => {
        console.log('translate end event', evt);
        stop();
        setTranslatedFeatures(evt.features);
        
    }, [stop]);

    /**
     * Method to create Drawing Interaction
     * The interaction will start once it is added
     * to the map.
     */
    const createInteraction = useCallback((options) => {
        const translate = new Translate(options);
        //register event handlers for the start and end of translation
        translate.on('translatestart', translateStartHandler);
        translate.on('translateend', translateEndHandler);
        //set initially the interaction as inactive
        translate.setActive(false);

        return translate;

    }, [translateEndHandler, translateStartHandler]);

     /**
     * Callback to start the interaction
     */
    const start = useCallback((options) => {
        setIsRunning(true);
        const translate = createInteraction(options);
        interactionRef.current = translate;
        map.addInteraction(translate);
        translate.setActive(true);  

        document.addEventListener('keydown', escKeyHandler);

        tooltipRef.current = createTooltip();
        map.addOverlay(tooltipRef.current);
        map.getViewport().addEventListener('mouseout', mouseOutHandler);
        map.on('pointermove', pointerMoveHandler);

    }, [createInteraction, map, escKeyHandler, mouseOutHandler, pointerMoveHandler]);

    /**
     * reset the interaction
     */
    const clear = useCallback(() => {
        setTranslatedFeatures(null);
        setIsRunning(false);
    }, []);


    return {start, clear, isRunning, translatedFeatures};
};



export default useTranslateInteraction;