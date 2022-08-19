import {useCallback, useState, useRef} from 'react';
import Draw from 'ol/interaction/Draw';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import OlSourceVector from 'ol/source/Vector';
import RegularShape from 'ol/style/RegularShape';
import {buffer, getHeight} from 'ol/extent';
import {createTooltip, mouseOut, pointerMove} from '../../../core/interaction';
import '../interactions.css';


/**
 * Method to return a box selection that can be used as a filter to
 * retrieve objects through the wfs GetFeature request
 * 
 * @param {*} map The map where box selection will be shown
 * @param {*} msg The message selection
 * @param {*} size The box size in pixels
 * @param {*} source The vector source where the box will be shown
 * @returns {start, clear, bbox, isRunning}
 */
const useGetBoxSelectionGeomInteraction = (
    map, 
    msg = 'Select object or &lt;esc&gt; to Cancel',
    size = 10,
    source = null
) => {
    
    /**
     * refs to store the tooltip and the interaction
     */
    const interactionRef = useRef(null);
    const tooltipRef = useRef(null);

    /**
     * States to indicate if the interaction is running
     * and the retrieved bbox
     */
    const [isRunning, setIsRunning] = useState(false);
    const [bbox, setBbox] = useState(null);

    let escKeyHandler = null;

    /**
     * method to draw the selection box style
     */
    const createBBoxStyle = (size) => {
        const style = new Style({
            image: new RegularShape({
                points: 4,
                radius: size,
                angle: Math.PI / 4,
                fill: new Fill({
                    color: 'rgba(125, 125, 125, 0.5)'
                }),
                stroke: new Stroke({color: 'black', width: 2})
            })
        });
        return style;
    }

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
     * Callback to stop/remove the interaction.
     * This method will be called if the user
     * cancel the operation with <esc> or if
     * the user ends the operation by picking
     * a selection point in the screen
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

    }, [map, escKeyHandler, mouseOutHandler, pointerMoveHandler]);

    /**
     * Event handler to cancel the interaction 
     * if the user press the <esc> key
     */
    escKeyHandler = useCallback((evt) => {
        if(evt.keyCode === 27) {
            console.log('BBox command cancelled');
            stop();
            setIsRunning(false);
            setBbox(undefined);
        }
    }, [stop]);

    /**
     * Event handler fired once the drawing is started.
     * The drawing is started when the interaction is 
     * added in the map.
     */
    const drawStartHandler = useCallback((evt) => {
        console.log('draw start event', evt);
        setIsRunning(true);
        setBbox(null);
    }, []);

    const drawEndHandler = useCallback((evt) => {
        console.log('draw end event', evt);
        //retrieve the resolution (view units/pixel)
        const resolution = map.getView().getResolution();
        //calculate normalized size in view units
        const bufferSize = (resolution * size);
        //calculate bbox
        const pt = evt.feature.getGeometry().getCoordinates();
        const extent = buffer([pt[0], pt[1], pt[0], pt[1]], bufferSize);
        console.log('extent', extent);
        console.log('extent height', getHeight(extent));

        stop();
        setIsRunning(false);
        setBbox(extent);
    }, [stop, map, size]);

    const drawAbortHandler = useCallback(() => {
        //console.log('drawAbortHandler');
    }, []);


    /**
     * Method to create Drawing Interaction and 
     * register its related event handlers.
     * The interaction will start once it is added
     * to the map. Once the interaction is started,
     * a temporary feature will be shown
     */
    const createInteraction = useCallback((drawOptions) => {
        const newInteraction = new Draw(drawOptions);
        //register handler for 'drawend' event in the interaction
        newInteraction.on('drawend', drawEndHandler);
        //register handler for 'drawstart' handler
        newInteraction.on('drawstart', drawStartHandler);
        //register handler for 'drawabort' handler
        newInteraction.on('drawabort', drawAbortHandler);
        //set as inactive and it will imediatelly start once added to the map and activated
        newInteraction.setActive(false);

        return newInteraction;
    }, [drawEndHandler, drawStartHandler, drawAbortHandler]);

    /**
     * Callback to start the interaction
     */
     const start = useCallback(() => {
        const drawOptions = {
            source: source ? source : new OlSourceVector(),
            type: 'Point',
            style: createBBoxStyle(size)
        };
        //create and activate interaction with registered event handlers
        setIsRunning(true);
        const draw = createInteraction(drawOptions);
        interactionRef.current = draw;
        map.addInteraction(draw);
        draw.setActive(true);  
        //add <esc> event hanler to cancel operation
        document.addEventListener('keydown', escKeyHandler);
        //create tooltip overlay and add it to the map
        tooltipRef.current = createTooltip();
        map.addOverlay(tooltipRef.current);
        //register 'mouseout' event handler to handle tooltip if mouse outside viewport
        map.getViewport().addEventListener('mouseout', mouseOutHandler);
        //register 'pointermove' event handler to show tooltip in located in the mouse location
        map.on('pointermove', pointerMoveHandler);

    }, [createInteraction, map, escKeyHandler, mouseOutHandler, pointerMoveHandler, size, source]);


    const clear = useCallback(() => {
        setBbox(null);
        setIsRunning(false);
        interactionRef.current = null;
        tooltipRef.current = null;
    }, []);


    return {start, clear, bbox, isRunning};

};

export default useGetBoxSelectionGeomInteraction;