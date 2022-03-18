import React, {useState, useRef, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map as olMap,Feature as olFeature, Collection as olCollection} from 'ol';
import {Vector as olVectorLayer} from 'ol/layer';
import {Style as olStyle} from 'ol/style';
import {Vector as olVectorSource} from 'ol/source'
import {equivalent as olProjEquivalent, transform as olProjTransform} from 'ol/proj';
import {transformExtent as olProjTransformExtent} from 'ol/proj';
import {Point as olGeomPoint, Polygon as olGeomPolygon} from 'ol/geom'
import {Translate as olInteractionTranslate} from 'ol/interaction';
import {getCenter as olExtentGetCenter} from 'ol/extent';

/**
 * <p>The Overview Map Control.</p>
 * <p>
 * 	This control has a view in a large area of the map,
 * 	allowing a better map navigation,
 * 	The box present in the overview map represents the area of the parent view.
 * 	This control has the following properties:
 * </p>
 * <ol>
 * <li>If the user pan the overview map, the parent map will also be re-centered accordinlgy.</li>
 * <li>If the user pan the parent the map, the overview map will be re-centered accordingly.</li>
 * <li>If the user click a point in the overview map:</li>
 * <ul>
 *    <li>The overview map will be re-centered in the clicked point</li>
 *    <li>The parent map will be re-centered accordingly</li>
 * </ul>
 * </ol>
 * 
 * @visibleName Map Overview
 */
const MapOverviewWidget = (
    {
        map,
        parentMap,
        anchorStyle = null,
        boxStyle = null,
        magnification = 5,
        height="100%", 
        width="100%"
    }) => {
    //const parentMap = useContext(MapContext).map;
    const childMapRef = useRef();
    const childMap = useState(map)[0];
    const boxFeature = useState(new olFeature())[0];
    const anchorFeature = useState(new olFeature())[0];
    const extentLayer = useState(new olVectorLayer({
        source: new olVectorSource()
    }))[0];
    const [dragInteraction, setDragInteraction] = useState(null);


    /**
     * Set an OverviewMap property (center or resolution).
     * 
     * @param {String} key The name of the property, either 'center' or 'resolution'
     */
    const setOverviewMapProperty = useCallback((key) => {
        if(! childMap) return;
        const parentView = parentMap.getView();
        const parentProjection = parentView.getProjection();
        const overviewView = childMap.getView();
        const overviewProjection = overviewView.getProjection();
        let overviewCenter = parentView.getCenter();

        if (key === 'center') {
            // transform if necessary
            if (!olProjEquivalent(parentProjection, overviewProjection)) {
                overviewCenter = olProjTransform(overviewCenter,
                    parentProjection, overviewProjection);
            }
            overviewView.set('center', overviewCenter);
        }
        if (key === 'resolution') {
            if (olProjEquivalent(parentProjection, overviewProjection)) {
                overviewView.set('resolution',
                    magnification * parentView.getResolution());
            } else {
                const parentExtent = parentView.calculateExtent(
                    parentMap.getSize());
                const parentExtentProjected = olProjTransformExtent(
                    parentExtent, parentProjection, overviewProjection);
                overviewView.fit(
                    parentExtentProjected,
                    {constrainResolution: false}
                );
               
                overviewView.set(
                    'resolution',
                    magnification() * overviewView.getResolution()
                );
            }
            // Do nothing when parent and overview projections are not
            // equivalent as me.getMap().getSize()
            // would not be reliable here.
        }
    }, [childMap, parentMap, magnification]);
   
    /**
     * Called when a property of the parent map view Changes
     */
    const onParentViewPropChange =  useCallback((evt) => {
        if (evt.key === 'center' || evt.key === 'resolution') {
            setOverviewMapProperty(evt.key);
        }
    }, [setOverviewMapProperty]);


    const updateBox = useCallback(() => {
        if(! childMap) return;
        const extentGeometries = getVisibleExtentGeometries(parentMap);
        if (!extentGeometries) {
            return;
        }
        const geom = extentGeometries.extent;
        const anchor = extentGeometries.topLeft;

        const parentMapProjection = parentMap.getView().getProjection();
        const overviewProjection = childMap.getView().getProjection();

        // transform if necessary
        if (!olProjEquivalent(parentMapProjection, overviewProjection)) {
            geom.transform(parentMapProjection, overviewProjection);
            anchor.transform(parentMapProjection, overviewProjection);
        }

        boxFeature.setGeometry(geom);
        anchorFeature.setGeometry(anchor);
    }, [childMap, parentMap, boxFeature, anchorFeature]);

    /**
     * Enables the update of the box by biding the updateBox function
     * to the postrender event of the parent map
     */
    const enableBoxUpdate = useCallback(() => {
        if (parentMap) {
            parentMap.on('postrender', updateBox);
        }
    }, [parentMap, updateBox]);

    const disableBoxUpdate = useCallback(() => {
        if (parentMap) {
            parentMap.un('postrender', updateBox);
        }
    }, [parentMap, updateBox]);

    /**
     * Repositions the #anchorFeature during dragging sequences of the box.
     * Called while the #boxFeature is being dragged.
     */
    const repositionAnchorFeature = useCallback(() => {
        const boxCoords = boxFeature.getGeometry().getCoordinates();
        const topLeftCoord = boxCoords[0][0];
        const newAnchorGeom = new olGeomPoint(topLeftCoord);
        anchorFeature.setGeometry(newAnchorGeom);
    }, [anchorFeature, boxFeature]);

    /**
     * Recenters the #parentMap to the center of the extent of the #boxFeature.
     * Called when dragging of the #boxFeature ends.
     */
    const recenterParentFromBox = useCallback(() => {
        if(! childMap) return;
        const parentView = parentMap.getView();
        const parentProjection = parentView.getProjection();

        const overviewView = childMap.getView();
        const overviewProjection = overviewView.getProjection();

        //const currentMapCenter = parentView.getCenter();
        const boxExtent = boxFeature.getGeometry().getExtent();
        let boxCenter = olExtentGetCenter(boxExtent);

        // transform if necessary
        if (!olProjEquivalent(parentProjection, overviewProjection)) {
            boxCenter = olProjTransform(boxCenter, overviewProjection,
                parentProjection);
        }

        parentView.animate({
            center: boxCenter
        });
        

    }, [parentMap, childMap, boxFeature]);

    /**
     * Enable everything we need to be able to drag the extent box on the
     * overview map, and to properly handle drag events (e.g. recenter on
     * finished dragging).
     */
    const setupDragBehaviour = useCallback(() => {
        if(! childMap) return;
        if(!dragInteraction) {
            const newDragInteraction = new olInteractionTranslate({
                features: new olCollection([boxFeature])
            });
            childMap.addInteraction(newDragInteraction);
            newDragInteraction.setActive(true);
            // disable the box update during the translation
            // because it interferes when dragging the feature
            newDragInteraction.on('translatestart', disableBoxUpdate);
            newDragInteraction.on('translating', repositionAnchorFeature);
            newDragInteraction.on('translateend', recenterParentFromBox);
            newDragInteraction.on('translateend', enableBoxUpdate);
            setDragInteraction(newDragInteraction);
        }
    }, [boxFeature, childMap, enableBoxUpdate, dragInteraction,
        disableBoxUpdate, repositionAnchorFeature, recenterParentFromBox
    ]);

    /**
     * Disable / destroy everything we need to be able to drag the extent box on
     * the overview map. Unregisters any events we might have added and removes
     * the `ol.interaction.Translate`.
     */
    const destroyDragBehaviour = useCallback(() => {
        if(! childMap) return;
        if (!dragInteraction) {
            return;
        }
        dragInteraction.setActive(false);
        childMap.removeInteraction(dragInteraction);
        dragInteraction.un('translatestart', disableBoxUpdate);
        dragInteraction.un('translating', repositionAnchorFeature);
        dragInteraction.un('translateend', recenterParentFromBox);
        dragInteraction.un('translateend', enableBoxUpdate);
        setDragInteraction(null);
    }, [
        dragInteraction, childMap, disableBoxUpdate, repositionAnchorFeature,
        recenterParentFromBox, enableBoxUpdate
    ]);

    /**
     * Handler for the click event of the overview map. Recenters the parent
     * map to the clicked location.
     *
     * @param {ol.MapBrowserEvent} evt The click event on the map.
     * @private
     */
    const overviewMapClicked = useCallback((evt) => {
        if(! childMap) return;
        const parentView = parentMap.getView();
        const parentProjection = parentView.getProjection();
        //const currentMapCenter = parentView.getCenter();
        const overviewView = childMap.getView();
        const overviewProjection = overviewView.getProjection();
        let newCenter = evt.coordinate;

        // transform if necessary
        if (!olProjEquivalent(parentProjection, overviewProjection)) {
            newCenter = olProjTransform(newCenter,
                overviewProjection, parentProjection);
        }

        parentView.animate({
            center: newCenter
        });
    }, [childMap, parentMap]);


    /**
     * Handler to update center/zoom of the overview map if the size of
     * the window is changed.
     */
    const resizeWindowHandler = useCallback((e) => {
        if(! childMap) return;
        childMap.updateSize();
        setOverviewMapProperty('resolution');
        setOverviewMapProperty('center');
    }, [setOverviewMapProperty, childMap]);


    /**
     * Initialize the child overview map
     */
    useEffect(() => {
        if(! childMap) return;
        childMap.addLayer(extentLayer);
        childMap.setTarget(childMapRef.current);
        setOverviewMapProperty('resolution');
        window.addEventListener("resize", resizeWindowHandler)

        return () => {
            if(childMap) {
                childMap.removeLayer(extentLayer);
                childMap.setTarget(undefined);
                window.removeEventListener("resize", resizeWindowHandler);
            }
        }

    }, [childMap, extentLayer, setOverviewMapProperty, resizeWindowHandler]);

    /**
     * Set Event Handler to change the center or resolution of the child overview map
     * if the center or resolution in parent map changes
     */
    useEffect(() => {
        parentMap.getView().on('propertychange', onParentViewPropChange);

        return () => {
            parentMap.getView().un('propertychange', onParentViewPropChange);
        }

    }, [parentMap, onParentViewPropChange]);

    /**
     * Set 'postrender' event handler update the box/anchor in the child overview map 
     * after rendering a new frame of the parent map
     */
    useEffect(() => {
        enableBoxUpdate();
        //return cleanup function
        return () => disableBoxUpdate();

    }, [enableBoxUpdate, disableBoxUpdate]);

    /**
     * Initially set the center and resolution of the overview map
     */
    useEffect(() => {
        setOverviewMapProperty('center');
        setOverviewMapProperty('resolution');

    }, [setOverviewMapProperty]);

    /**
     * Add the box and anchor features into the extent layer of the 
     * child overview map
     */
    useEffect(() => {
        extentLayer.getSource().addFeatures([
            boxFeature,
            anchorFeature
        ]);
        if(anchorStyle) {
            anchorFeature.setStyle(anchorStyle);
        }
        if(boxStyle) {
            boxFeature.setStyle(boxStyle);
        }
    }, [extentLayer, anchorFeature, boxFeature, boxStyle, anchorStyle]);

    /**
     * Enable everything we need to be able to drag the extent box on the
     * overview map, and to properly handle drag events (e.g. recenter on
     * finished dragging).
     */
    useEffect(() => {
        setupDragBehaviour();

        return () => destroyDragBehaviour();

    }, [setupDragBehaviour, destroyDragBehaviour]);

    /**
     * Set the event handler to recenter the overview map if the user clicks on it
     */
    useEffect(() => {
        if(! childMap) return;
        childMap.on('click', overviewMapClicked);
        
        return () => childMap.un('click', overviewMapClicked);
    }, [childMap, overviewMapClicked]);

    return(
        <div ref={childMapRef} style={{height: height, width: width}}></div>
    );

};

const getVisibleExtentGeometries = (map) => {
    const mapSize = map && map.getSize();
    const w = mapSize && mapSize[0];
    const h = mapSize && mapSize[1];
    if (!mapSize || isNaN(w) || isNaN(h)) {
        return;
    }
    const pixels = [
        [0, 0], [w, 0], [w, h], [0, h], [0, 0]
    ];
    const extentCoords = [];
    pixels.forEach((pixel) => {
        const coord = map.getCoordinateFromPixel(pixel);
        if (coord === null) {
            return false;
        }
        extentCoords.push(coord);
    });
    if (extentCoords.length !== 5) {
        return;
    }
    var geom = new olGeomPolygon([extentCoords]);
    var anchor = new olGeomPoint(extentCoords[0]);
    return {
        extent: geom,
        topLeft: anchor
    };
};

MapOverviewWidget.propTypes = {
    /**
     * The OpenLayers ol/Map
     */
    map: PropTypes.instanceOf(olMap).isRequired,
    /**
     * The height of the map.
     */
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * The width of the map.
     */
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    /**
     * The ol/style/Style for the anchor feature which indicates the upper-left
     * corner of the overview rectangle.
     */
    anchorStyle: PropTypes.instanceOf(olStyle),

    /**
     * The ol/style/Style for the overview rectangle.
     */
    boxStyle: PropTypes.instanceOf(olStyle),

    /**
     * The magnification of the overview map.
     * The maginification represent how many times
     * the scale of the parent map is bigger than the
     * the scale of the overview map.
     */
    magnification: PropTypes.number
};



export default MapOverviewWidget;
