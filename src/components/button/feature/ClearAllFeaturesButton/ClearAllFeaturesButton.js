import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import VectorLayer from 'ol/layer/Vector';
import { Button } from 'antd';

/**
 * <p>
 *  Button to clear all the features in a <i>ol/layer/Vector</i> 
 *  vector layer.
 * </p>
 * <p>Remark:This component is present in the <i>WfsFeatureGrid</i> component.</p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * 
 * @visibleName Clear All Features Button 
 */
const ClearAllFeaturesButton = (props) => {
    const {vectorLayer, children, ...otherProps} = props;
    const onClickHandler = useCallback((event) => {
        if(vectorLayer) {
           vectorLayer.getSource().clear();
        }
    }, [vectorLayer]);

    return(
        <Button {...otherProps} onClick={onClickHandler}>
            {children}
        </Button>
    );
};

ClearAllFeaturesButton.propTypes = {
    /**
     * The <i>ol/layer/Vector</i> layer from where all the features will
     * be cleared. 
     */
    vectorlayer: PropTypes.instanceOf(VectorLayer),

    /**
     * The child node for the button
     */
    children: PropTypes.node

}

export default ClearAllFeaturesButton;