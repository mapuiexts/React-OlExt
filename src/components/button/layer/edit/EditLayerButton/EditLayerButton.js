import React, {useState} from 'react';
import PropTypes from 'prop-types';
import BaseLayer from 'ol/layer/Base';
import {Button} from 'antd';
import LayerWnd from '../../../../window/layer/LayerWnd/LayerWnd';

/**
 * <p>
 *  Button to edit the Layer.
 *  Once the user clicks the button, a window will be
 *  shown with the current properties of the layer and 
 *  the user can modify them.
 * </p>
  * <p>
 *  Remark: this component also is present in the menu context 
 *  for <i>Layer Tree</i> component.
 * </p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * 
 * @visibleName Edit Layer Button 
 */
const EditLayerButton = ({
    layer,
    wndStyle, 
    children,
    ...otherProps
}) => {

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

    return (
        <React.Fragment>
            <Button onClick={onShowWindow} {...otherProps}>{children}</Button>
            {
                visibleWnd &&
                <LayerWnd 
                    onOk={onCloseWindow}
                    onClose={onCloseWindow} 
                    layer={layer} 
                    style={wndStyle} 
                    visible={visibleWnd}
                />
            }
        </React.Fragment>
    );
};

EditLayerButton.propTypes = {
    /**
     * The OpenLayers Layer to be edited.
     */
    layer: PropTypes.instanceOf(BaseLayer).isRequired,

    /**
     * The CSS style to be provided to the window
     */
    wndStyle:PropTypes.object,

    /**
     * The child node for the Button
     */
    children: PropTypes.node
};

export default EditLayerButton;