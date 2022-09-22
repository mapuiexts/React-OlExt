import {useEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import Overlay from 'ol/Overlay';
import './BasePopup.css';
import defined from '../../../../core/defined';

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
    overlayProps,
    ...otherProps
}) => {

    const popupRef = useRef();
    const popupCloserRef = useRef();
    //const [overlay, setOverlay] = useState(null);
    const overlayRef = useRef();


    // const previousExpanded = usePrevious(expanded);
    // if(expanded !== previousExpanded && expanded !== internalExpanded) {
    //     setInternalExpanded(expanded);
    // }


    const onClickCloser = useCallback(() => {
        overlayRef.current && overlayRef.current.setPosition(undefined)
        popupCloserRef.current && popupCloserRef.current.blur();
        onClose && onClose();
        return false;
    }, [onClose]);

     /**
     * Effect to add overlay in the map
     */
    useEffect(() => {
        if(defined(popupRef.current) && !defined(overlayRef.current)) {
            const newOverlay = new Overlay({
                element: popupRef.current,
                //positioning: 'bottom-center',
                stopEvent: true,
                insertFirst: true,
                // autoPan: true,
                // autoPanAnimation: {
                //     duration: 250,
                // }
                ...overlayProps
            });
            //setOverlay(newOverlay);
            overlayRef.current = newOverlay;
            map.addOverlay(newOverlay);
        }

        return () => {
            map.removeOverlay(overlayRef.current);
        }

    }, [map, overlayProps]);

    /**
     * Effect to add position to overlay
     */
    useEffect(() => {
        if(defined(position) && defined(overlayRef.current) && position !== overlayRef.current.getPosition()) {
            overlayRef.current.setPosition(position);
        }
    }, [position]);


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
     * The properties for the openlayers popup overlay
     * See: <a href="https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html">Overlay</a>
     */
    overlayProps: PropTypes.object,

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