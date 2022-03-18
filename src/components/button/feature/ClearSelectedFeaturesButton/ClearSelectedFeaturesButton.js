import React, {useCallback} from 'react';
import VectorLayer from 'ol/layer/Vector';
import PropTypes from 'prop-types';
import { Button } from 'antd';


/**
 * <p>Button will allow to clear selected feature(s) from a vector layer present in the Grid.</p>
 * <p>Remark:This component is present in the <i>WfsFeatureGrid</i> component.</p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * @visibleName Clear Selected Features Button
 */
const ClearSelectedFeaturesButton = (props) => {

    const {vectorLayer, gridApi, children, ...otherProps} = props;


    const onClickHandler = useCallback((event) => {
        if(gridApi && vectorLayer) {
            const selectedRows = gridApi.getSelectedRows();
            const features = selectedRows.map(row => row.__feature);
            features.forEach((feature) => {
                vectorLayer.getSource().removeFeature(feature);
            });
            
        }
    }, [gridApi, vectorLayer]);

    return(
        <Button {...otherProps} onClick={onClickHandler}>
            {children}
        </Button>
    );

};

ClearSelectedFeaturesButton.propTypes = {
    /**
     * The <i>ol/layer/Vector</i> layer from where the features will
     * be cleared. 
     */
    vectorlayer: PropTypes.instanceOf(VectorLayer),

    /**
     * The Grid Api for <a href="https://www.ag-grid.com/react-grid/grid-api/">Ag-Grid</a>.
     */
    gridApi: PropTypes.any,

    /**
     * The child node for the button
     */
    children: PropTypes.node
};

export default ClearSelectedFeaturesButton;