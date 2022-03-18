import {useEffect, useRef, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import Overlay from 'ol/Overlay';
import Header from '../../../panel/Panel/Header/Header';
import Expander from '../../../panel/Panel/Expander/Expander';
import usePrevious from '../../../../hooks/common/usePrevious';
import '../BasePopup/BasePopup.css';
import '../../../panel/Panel/Panel.css';

/**
 * Component to allow to show a window popup in the ol/Map
 * 
 * @visibleName Window Popup 
 */
const WindowPopup = ({
    map,
    position,
    onClose,
    expanded=true,
    collapsible=true,
    title,
    children,
    onExpand,
    ...otherProps
}) => {

    const popupRef = useRef();
    const popupCloserRef = useRef();
    const [overlay, setOverlay] = useState(null);

    const [internalExpanded, setInternalExpanded] = useState(expanded);

    const previousExpanded = usePrevious(expanded);
    if(expanded !== previousExpanded && expanded !== internalExpanded) {
        setInternalExpanded(expanded);
    }

    const toggleCollapse = useCallback(() => {
        setInternalExpanded(prevInternalExpanded => {
            onExpand && onExpand(!prevInternalExpanded);
            return !prevInternalExpanded;
        });
    },[onExpand]);

    const className = `rolext-panel${internalExpanded ? ' rolext-panel-expanded' : ''}`;

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
        <div {...otherProps} >
            <div ref={popupRef} className="rolext-popup" >
                <div className={className} /*style={{width:"500px", height:"300px"}}*/>
                    <Header 
                        title={title} 
                        onClose={onClickCloser}  
                        toggleCollapse={toggleCollapse} 
                        collapsible={collapsible} 
                        style={{borderRadius:"5px 5px 0 0"}}
                    />
                    <Expander expanded={internalExpanded}>
                        <div className="rolext-panel-body-el">
                            {children}
                        </div>
                    </Expander>
                   
                </div>
            </div>
        </div>
    );

};

WindowPopup.propTypes = {

    /**
     * The OpenLayers ol/Map on where the popup will be rendered.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * [x,y] representing the position on the 
     * map where the popup will be shown. 
     * The popup will be invisible until a 
     * position is provided.
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
    onClose: PropTypes.func,

    /**
     * If true, the popup will be shown
     * expanded.
     */
    expanded: PropTypes.bool,

    /**
     * If true, the user can collapse the
     * popup. To collapse it, you have
     * to click in the collapse button 
     * availabe in the title bar near
     * the close button.
     */
    collapsible: PropTypes.bool,

    /**
     * The title to be shown in the
     * title bar
     */
    title: PropTypes.node,

    /**
     * Event handler called once
     * the user expand or collapse
     * the popup. The parameter is 
     * a boolean and it will be true
     * if the popup was expanded and
     * false otherwise.
     */
    onExpand: PropTypes.func

    
};

export default WindowPopup;