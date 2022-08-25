import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {Projection} from 'ol/proj';
import {Button} from 'antd';
import ZoomCenterWnd from '../../../window/zoom/ZoomCenterWnd/ZoomCenterWnd';

/**
 * Button to Zoom the map having the center and scale provided by the user
 * in thw window.
 * 
 * @visibleName Zoom Center Button
 */
const ZoomCenterButton = (
    {
        map,
        projs,
        wndStyle, 
        children,
        ...otherProps
    }) => {

        const [visibleWnd, setVisibleWnd] = useState(false);
        

        const onClickHandler = (event) => {
            setVisibleWnd(true);
        };

        const onClose = () => {
            setVisibleWnd(false);
        };
    
        return(
            <React.Fragment>
                <Button {...otherProps} onClick={onClickHandler} 
                    disabled={visibleWnd}
                >
                    {children}
                </Button>
                {
                    visibleWnd &&
                    <ZoomCenterWnd 
                        title={children}
                        onClose={onClose} 
                        visible={visibleWnd}
                        map={map}
                        projs={projs}
                        style={wndStyle}
                    />
                }
            </React.Fragment>
        );
};

ZoomCenterButton.propTypes = {
    /**
     * The OpenLayers ol/Map to zoom
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Array of ol/Projection to be available
     * in a combo box in the window. So, the user will be able
     * to enter a coordinate in a selected 
     * projection, other than the map projection.
     */
    projs: PropTypes.arrayOf(PropTypes.instanceOf(Projection)),

    /**
     * A CSS Style to render the style for the Window
     */
    wndStyle:PropTypes.object,

    /**
     * The child node for the Button and Window Title:
     */
    children: PropTypes.node
};

export default ZoomCenterButton;