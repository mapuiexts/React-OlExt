
import {useCallback, useState, useRef} from 'react';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import {getLength} from 'ol/sphere';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import defined from '../../../core/defined';
import {createTooltip, createMeasureTooltip, mouseOut, pointerMove} from '../../../core/interaction';


/**
 * Hook responsible to retrieve the distance provided by the user input.
 * 
 * @param {ol/Map} map The map where the retrieved features will be added
 * @param {ol/source/Vector} vectorSource The vector source where the line distance will be stored. If null a temporary layer will be created
 * @param {String} startMsg The message tooltip show before the user selects the first point
 * @param {String} continueMsg The message tooltip show after the user selects the first point.
 * @param {String} drawOptions The options to draw the distance line. 
 * Check the options parameter in <a href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-Draw.html">documentation</a>.
 * @param {Object} snapOptions The snap options. 
 * Check the options parameter in <a href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Snap-Snap.html">documentation</a>.
 * @returns  {start, clear, feature, distance, getOlInteraction}
 */
 const useGetDistanceInteraction = (
    map, 
    vectorSource = null,
    startMsg = 'Click to start the measure', 
    continueMsg = 'Click to continue the measure or dbl-click to stop',
    drawOptions = {
        source: vectorSource,
        type: 'LineString',
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.8)'
            }),
            stroke: new Stroke({
                color: 'rgba(255, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new Circle({
                radius: 5,
                stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                color: 'rgba(255, 0, 0, 0.8)'
                })
            })
        })
    },
    snapOptions = null
    
    ) => {

    const interactionRef = useRef(null);
    const snapRef = useRef(null);
    const tooltipRef = useRef(null);
    const measureTooltipRef = useRef(null);
    //const measureTooltipRef = useRef(null);
    const sketchRef = useRef(null);
    const vectorLayerRef = useRef(null);
    const [feature, setFeature] = useState(null);
    const [distance, setDistance] = useState(null);

    let escKeyHandler = null;

    const createVectorLayer = () => {
        const source = new VectorSource();
        const vector = new VectorLayer({source: source});

        return vector;
    };

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
        if(!defined(sketchRef.current)) {
            pointerMove(evt, tooltipRef.current, startMsg);
        }
        else {
            pointerMove(evt, tooltipRef.current, continueMsg);
        }
    }, [startMsg, continueMsg ]);

    /**
     * Callback to stop the interaction
     */
     const stop = useCallback(() => {
        
        //Remove interaction
        if(interactionRef.current) {
            interactionRef.current.setActive(false);
            map.removeInteraction(interactionRef.current);
            interactionRef.current = null;
        }
         //remove snap
         if(defined(snapRef.current)) {
            map.removeInteraction(snapRef.current);
            snapRef.current = null;
         }
        //Remove <esc> handler to cancel command
        document.removeEventListener('keydown', escKeyHandler);
        //Remove tooltip and unregister handlesr to show/hide tooltip
        map.removeOverlay(tooltipRef.current);
        map.getViewport().removeEventListener('mouseout', mouseOutHandler);
        map.un('pointermove', pointerMoveHandler);

        //remove measure tooltip
        map.removeOverlay(measureTooltipRef.current);

        //remove temporary layer
        if(vectorLayerRef) {
            map.removeLayer(vectorLayerRef.current);
            vectorLayerRef.current = null;
        }

    }, [map, escKeyHandler, mouseOutHandler, pointerMoveHandler]);

    /**
     * Event handler to cancel the interaction 
     * if the user press the <esc> key
     */
     escKeyHandler = useCallback((evt) => {
        if(evt.keyCode === 27) {
            stop();
            console.log('command cancelled');
            setFeature(undefined);
            setDistance(undefined);
            sketchRef.current = null;
        }
    }, [stop]);

    const formatLength  = (linestring, projection) => {
        const length = getLength(linestring) * projection.getMetersPerUnit();
        let output;
        if (length > 100) {
            output = `${Math.round(length / 1000 * 100) / 100} km`;
        } else {
            output = `${Math.round(length * 100) / 100} m`;
        }
        return output;
    };

    const onChangeGeometryHandler = useCallback((evt) => {
        const geom = evt.target;
        const output = formatLength(geom, map.getView().getProjection());
        let tooltipCoord = geom.getLastCoordinate();
        if(defined(measureTooltipRef.current)) {
            measureTooltipRef.current.setPosition(tooltipCoord);
            measureTooltipRef.current.getElement().innerHTML = output;
        }
    }, [map]);

    const drawStartHandler = useCallback((evt) => {
        console.log(evt);
        sketchRef.current = evt.feature;
        evt.feature.getGeometry().on('change', onChangeGeometryHandler);
    }, [onChangeGeometryHandler]);

    const drawEndHandler = useCallback((evt) => {
        console.log(evt);
        evt.feature.getGeometry().un('change', onChangeGeometryHandler);
        stop();
        setFeature(evt.feature);
        setDistance(getLength(evt.feature.getGeometry()));
        sketchRef.current = null;
    }, [stop, onChangeGeometryHandler]);


    const createInteraction = useCallback(() => {
        const type = 'LineString';
        const draw = new Draw({
            ...drawOptions,
            type: type,
        });
        //register event handlers for the start and end of translation
        draw.on('drawstart', drawStartHandler);
        draw.on('drawend', drawEndHandler);

        return draw;
    }, [drawStartHandler, drawEndHandler, drawOptions]);

    const start = useCallback(() => {
        
        //create temporary layer
        if(!defined(vectorSource)) {
            const vector = createVectorLayer();
            vectorLayerRef.current = vector;
            map.addLayer(vector);

        }
        //create interaction
        const draw = createInteraction();
        interactionRef.current = draw;
        map.addInteraction(draw);
        draw.setActive(true); 

        //add snap interaction
        if(defined(snapOptions)) {
            const snap = new Snap(snapOptions);
            map.addInteraction(snap);
            snapRef.current = snap;
        }


        //Add <esc> handler to cancel command
        document.addEventListener('keydown', escKeyHandler);

        //Add tooltip and register handlesr to show/hide tooltip
        tooltipRef.current = createTooltip();
        map.addOverlay(tooltipRef.current);
        map.getViewport().addEventListener('mouseout', mouseOutHandler);
        map.on('pointermove', pointerMoveHandler);

        //add measure tooltip
        measureTooltipRef.current = createMeasureTooltip();
        map.addOverlay(measureTooltipRef.current);
    }, [createInteraction, escKeyHandler, map, mouseOutHandler, pointerMoveHandler, vectorSource, snapOptions]);

    const clear = useCallback(() => {
        setFeature(null);
        setDistance(null);
    }, []);
    

    return {start, clear, feature, distance, getOlInteraction: () => interactionRef.current};

}

export default useGetDistanceInteraction;