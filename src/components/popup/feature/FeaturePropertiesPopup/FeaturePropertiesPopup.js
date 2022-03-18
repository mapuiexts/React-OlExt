import React, {useRef, useState, useEffect, useCallback} from 'react';
import {Popover} from 'antd';
import Overlay from 'ol/Overlay';

const FeaturePropertiesPopup = ({
    map
}) => {

    const popupRef = useRef();
    const [popup, setPopup] = useState(null);
    const [visible, setVisible] = useState(false);
    const [features, setFeatures] = useState([]);
    /**
     * Event handler fired once the mouse is clicked in the map. 
     * This handler will show a popup  if the
     * mouse is clicked over a feature.
     */
    const onClickFeatureOnMap = useCallback((evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        if (feature) {
            popup.setPosition(evt.coordinate);
            setVisible(true);
            setFeatures([feature]);
            // popupRef.current.popover({
            //     placement: 'top',
            //     html: true,
            //     content: feature.get('display_name'),
            // });
            // popupRef.current.popover('show');
        }
        else {
            //popupRef.current.popover('dispose');
            setVisible(false);
        }
    }, [map, popup]);


    /**
     * Event handler fired once the mouse pointer is 
     * moved on the map.
     * This handler will change the pointer if the
     * mouse is over a feature.
     */
    const onPointerMoveOnMap = useCallback((evt) => {
        const pixel = map.getEventPixel(evt.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
    }, [map]);

    /**
     * Event handler fired once the map is moved.
     * This handler will dispose the popup.
     */
    const onMoveStartOnMap = useCallback((evt) => {
        //popupRef.current.popover('dispose');
        setVisible(false);
    }, []);


    /**
     * Effect to add overlay in the map
     */
    useEffect(() => {
        let overlay = null;
        if(popupRef.current && !popup) {
           overlay = new Overlay({
                element: popupRef.current,
                positioning: 'bottom-center',
                stopEvent: false
            });
            setPopup(overlay);
            map.addOverlay(overlay);
        }

        return () => {
            map.removeOverlay(popup);
        }

    }, [popup, map]);




    // useEffect(() => {
    //     if(!popup) {
    //         const overlay = new Overlay({
    //             element: popupRef.current,
    //             positioning: 'bottom-center',
    //             stopEvent: false
    //         });
    //         setPopup(overlay);
    //         map.addOverlay(overlay);
    //     }

    //     return () => {
    //         map.removeOverlay(popup);
    //     }

    // }, [map, popup]);

    // useEffect(() => {
    //     if(popupRef.current && popup && !popup.getElement()) {
    //         popup.setElement(popupRef.current );
    //     }

    // }, [popup]);


    /**
     * Effect to register 'click' event in the map
     */
    useEffect(() => {
        map.on('click', onClickFeatureOnMap);

        return () => map.un('click', onClickFeatureOnMap);

    }, [map, onClickFeatureOnMap]);

    /**
     * Effect to register 'pointermove' event in the map
     */
    useEffect(() => {
        map.on('pointermove', onPointerMoveOnMap);

        return () => map.un('pointermove', onPointerMoveOnMap);

    }, [map, onPointerMoveOnMap]);

    /**
     * Effect to register 'movestart' event in the map
     */
    useEffect(() => {
        map.on('movestart', onMoveStartOnMap);

        return () => map.un('movestart', onMoveStartOnMap);

    }, [map, onMoveStartOnMap]);
    

    return(
        <div>
            <Popover
                title={<div style={{background:"blue", color:"white", border:5}}>Properties</div>}
                trigger="click"
                placement="top"
                //content={features.length > 0 ? <div>{features[0].get('display_name')}</div> : null}
                content={features.length > 0 ? <div>{JSON.stringify(features[0].getProperties(), null, '\t')}</div> : null}
                visible={visible && features.length > 0}
            >
                <div ref={popupRef} />
            </Popover>
        </div>
    );
};

export default FeaturePropertiesPopup;