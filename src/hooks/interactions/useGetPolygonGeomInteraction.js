import {useCallback, useState, useEffect} from 'react';
import OlOverlay from 'ol/Overlay';
import OlInteractionDraw from 'ol/interaction/Draw';
import OlInteractionSnap from 'ol/interaction/Snap';
import OlStyleStyle from 'ol/style/Style';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import olStyleStroke from 'ol/style/Stroke';
import OlSourceVector from 'ol/source/Vector';
import './interactions.css';


const defaultStyle = new OlStyleStyle({
    fill: new OlStyleFill({
        color: 'rgba(255, 0, 0, 0.4)'
    }),
    stroke: new olStyleStroke({
        color: '#ff0000',
        width: 3
    }),
    image: new OlStyleCircle({
        radius: 7,
        fill: new OlStyleFill({
        color: '#ff0000'
      })
    })
  });

const useGetPolygonGeomInteraction = (
    map, 
    msg = 'Pick Points to Draw Polygon or &lt;esc&gt; to Cancel',
    style = defaultStyle,
    
) => {

     /**
     * The ol.geometry to be shown during the operation and
     * to be returned to caller.
     */
    const [geometry, setGeometry] = useState(null);

    const drawStartHandler = useCallback((evt) => {
        //console.log('drawStartHandler');
    }, []);

    const drawEndHandler = useCallback((evt) => {
        if(evt.feature && evt.feature.getGeometry() !== geometry) {
            setGeometry(evt.feature.getGeometry());
        }
        setIsRunning(false);
    }, [geometry]);

    const drawAbortHandler = useCallback(() => {
        //console.log('drawAbortHandler');
    }, []);

    /**
     * Method to create Drawing Interaction
     * The interaction will start once it is added
     * to the map. Once the interaction is started,
     * a temporary feature will be shown
     * 
     * @param {} map 
     * @param {*} source 
     */
    const createInteraction = useCallback((map, source) => {
		const newInteraction = new OlInteractionDraw(
			{
				source: source,
				type: 'Polygon',
				style: style
			}
        );
        //register handler for 'drawend' event in the interaction
        newInteraction.on('drawend', drawEndHandler);
        //register handler for 'drawstart' handler
        newInteraction.on('drawstart', drawStartHandler);
        //register handler for 'drawabort' handler
        newInteraction.on('drawabort', drawAbortHandler);

        newInteraction.setActive(false);
        //map.addInteraction(newInteraction);

        return newInteraction;
    }, [drawEndHandler, drawStartHandler, drawAbortHandler, style]);


    const createSnap = useCallback((map, source) => {
        const newSnap = new OlInteractionSnap({source: source})
        newSnap.setActive(false);

        return newSnap;
    }, []);


    /**
     * The Draw Interaction created initially
     * @type {ol.interaction.Draw}
     */
    const interaction = useState(createInteraction(map, new OlSourceVector()))[0];

    /**
     * The Snap Interaction created initially
     * @type {ol.interaction.Snap}
     */
    const snap = useState(createSnap(map, new OlSourceVector()))[0];

     /**
     * State to indicate if the interaction is running
     */
    const [isRunning, setIsRunning] = useState(false);

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
     * Event handler to cancel the interaction 
     * if the user press the <esc> key
     */
    const escKeyHandler = useCallback((evt) => {
        if(evt.keyCode === 27) {
            stop();
        }
    }, [stop]);

    const clear = useCallback(() => {
        setGeometry(null);
    }, []);

    const cleanup = useCallback(() => {
        document.removeEventListener('keydown', escKeyHandler);
        interaction.setActive(false);
        snap.setActive(false);
        map.removeOverlay(tooltip);
        map.getViewport().removeEventListener('mouseout', mouseOutHandler);
        map.un('pointermove', pointerMoveHandler);
        mouseOutHandler();
    }, [interaction, map, tooltip, snap, pointerMoveHandler, mouseOutHandler, escKeyHandler])
  
    /**
     * Effect to start/stop the interaction based
     * on the 'isRunning' state
     */
    useEffect(() => {
        if(isRunning) {
            document.addEventListener('keydown', escKeyHandler);
            interaction.setActive(true);
            snap.setActive(true);
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
    }, [isRunning, interaction, map, tooltip, snap, cleanup, pointerMoveHandler, mouseOutHandler, escKeyHandler]);
 
    /**
     * Effect to add/remove the interaction from the map
     */
    useEffect(() => {
        map.addInteraction(interaction);
        map.addInteraction(snap);
        return () => {
            map.removeInteraction(interaction);
            map.removeInteraction(snap);
        }
    }, [createInteraction, interaction, snap, map]);

    return {start, stop, clear, geometry, isRunning};


};

export default useGetPolygonGeomInteraction;

