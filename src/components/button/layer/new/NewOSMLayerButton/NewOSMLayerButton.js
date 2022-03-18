import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import GroupLayer from 'ol/layer/Group';
import {Button} from 'antd';
import Window from '../../../../window/base/Window/Window';
import NewOSMLayerForm from '../../../../form/layer/new/NewOSMLayerForm/NewOSMLayerForm';

/**
 * <p>Button to create a new <i>OpenStreetMap (OSM)</i> layer in the map.</p>
 * <p>
 *  Remark: this component also is present in the menu context 
 *  for <i>Layer Tree</i> component.
 * </p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * 
 * @visibleName New OSM Layer Button 
 */
const NewOSMLayerButton = ({
    map,
    parentLayerGroup = undefined,
    layerOpts = undefined,
    wndStyle, 
    children,
    ...otherProps
}) => {

    //Initialize Image Layer
    const [visibleWnd, setVisibleWnd] = useState(false);

    /**
     * Handler to close the Window once the OK button
     * on this window is clicked
     */
    const onCloseWindow = () => {
        setVisibleWnd(false);
    };

    /**
     * Handler to show the Window once the button is Clicked
     */
    const onShowWindow = () => {
        setVisibleWnd(true);
    };

    const onFinish = useCallback((values) => {
        setVisibleWnd(false);
    }, []);

    
    return (
        <React.Fragment>
            <Button onClick={onShowWindow} {...otherProps}>{children}</Button>
            {
                visibleWnd &&
                <Window
                    title={children}
                    collapsible
                    onClose={onCloseWindow} 
                    visible={visibleWnd}
                    style={wndStyle} 
                >
                    <NewOSMLayerForm 
                        map={map}
                        parentLayerGroup={parentLayerGroup}
                        layerOpts={layerOpts} 
                        onFinish={onFinish}
                    />
                </Window>
            }
        </React.Fragment>
    );
};

NewOSMLayerButton.propTypes = {
    /**
     * The OpenLayers ol/Map where the new OSM Layer will be created.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Layer Group where the new OSM Layer will be added.
     * If not provided, the map layer group will be used.
     */
    parentLayerGroup: PropTypes.instanceOf(GroupLayer),

    /**
     * <p>The default options to be shown in the window for the creation of the OSM Layer.</p>
     * <p>
     *  It is the same used as parameter in the constructor of
     *  <a href="https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html">
     *      ol/layer/Tile
     *  </a> 
     *  but the <strong>source</strong> key will have the options to create the OSM source, as defined 
     *  in the constructor of 
     *  <a href="https://openlayers.org/en/latest/apidoc/module-ol_source_OSM-OSM.html">
     *      ol/source/OSM
     *  </a>.
     * </p>
     * <p>If not provided, a default options will be provided by the application.</p>
     * 
     */
    layerOpts: PropTypes.object,

    /**
     * The CSS style to be provided to the window
     */
    wndStyle:PropTypes.object,

    /**
     * The child node for the Button
     */
    children: PropTypes.node
};

export default NewOSMLayerButton;