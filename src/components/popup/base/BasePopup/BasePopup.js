import {useEffect, useRef, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import Overlay from 'ol/Overlay';
import './BasePopup.css';

/**
 * Component to allow to show a window popup in the ol/Map.
 * It is a window-like version of the component 
 * <i>Base Popup</i> on which the title is available and
 * the user can hide/unhide the contents.
 * 
 * @visibleName Base Popup 
 */
const BasePopup = ({
    map,
    position,
    onClose,
    children,
    ...otherProps
}) => {

    const popupRef = useRef();
    const popupCloserRef = useRef();
    const [overlay, setOverlay] = useState(null);


    // const previousExpanded = usePrevious(expanded);
    // if(expanded !== previousExpanded && expanded !== internalExpanded) {
    //     setInternalExpanded(expanded);
    // }


    const onClickCloser = useCallback(() => {
        overlay && overlay.setPosition(undefined)
        popupCloserRef.current && popupCloserRef.current.blur();
        onClose && onClose();
    }, [overlay, onClose]);

     /**
     * Effect to add overlay in the map
     */
    useEffect(() => {
        if(popupRef.current && !overlay) {
            const newOverlay = new Overlay({
                element: popupRef.current,
                //positioning: 'bottom-center',
                //stopEvent: false,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250,
                }
            });
            setOverlay(newOverlay);
            map.addOverlay(newOverlay);
        }

        return () => {
            map.removeOverlay(overlay);
        }

    }, [overlay, map]);

    /**
     * Effect to add position to overlay
     */
    useEffect(() => {
        if(position && overlay && position !== overlay.getPosition()) {
            overlay.setPosition(position);
        }
    }, [overlay, position]);


    return(
        <div {...otherProps}>
            <div ref={popupRef} className="rolext-popup">
                <div ref={popupCloserRef} onClick={onClickCloser} className="rolext-popup-closer"/>
                {/* {content} */}
                {children}
            </div>
        </div>
    );

};

BasePopup.propTypes = {

    /**
     * The OpenLayers ol/Map on where the popup will be rendered.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * [x,y] representing the position on the 
     * map where the popup will be shown
     */
    position: PropTypes.arrayOf(PropTypes.number),

    /**
     * The content of the popup
     */
    children: PropTypes.node,

    /**
     * Event handler called once the user
     * closes the popup
     */
    onClose: PropTypes.func
    
};

export default BasePopup;