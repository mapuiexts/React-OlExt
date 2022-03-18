import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import GroupLayer from 'ol/layer/Group';
import {Button} from 'antd';
import Window from '../../../../window/base/Window/Window';
import NewGroupLayerForm from '../../../../form/layer/new/NewGroupLayerForm/NewGroupLayerForm';

/**
 * <p>Button to create a new <i>ol/layer/Group</i> in the map.</p>
 * <p>
 *  Remark: this component also is present in the menu context 
 *  for <i>Layer Tree</i> component.
 * </p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * 
 * @visibleName New Layer Group Button 
 */
const NewGroupLayerButton = ({
    map,
    parentLayerGroup = map.getLayerGroup(),
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
                    <NewGroupLayerForm 
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

NewGroupLayerButton.propTypes = {
    /**
     * The OpenLayers ol/Map where the new Layer Group will be added.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * Layer Group where the new Layer Group will be added.
     * If not provided, the map layer group will be used.
     */
    parentLayerGroup: PropTypes.instanceOf(GroupLayer),

    /**
     * The default options to be shown in the window for the creation of the Layer Group.
     * It is the same used as parameter in the constructor of
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_layer_Group-LayerGroup.html">
     *  ol/layer/Group
     * </a>
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

export default NewGroupLayerButton;