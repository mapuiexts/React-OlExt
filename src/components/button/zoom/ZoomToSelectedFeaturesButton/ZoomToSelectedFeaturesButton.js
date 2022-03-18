import React, {useCallback} from 'react';
import {Map} from 'ol';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import {ZoomToFeatures} from '../../../../util/map';


/**
 * <p>Button will allow to zoom to selected feature(s) from a vector layer present in the Grid.</p>
 * <p>Remark:This component is present in the <i>WfsFeatureGrid</i> component.</p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * @visibleName Zoom to Selected Features Button
 */
const ZoomToSelectedFeaturesButton = (props) => {

    const {map, gridApi, ...otherProps} = props;

    const onClickHandler = useCallback((event) => {
        if(map && gridApi) {
            const selectedRows = gridApi.getSelectedRows();
            const features = selectedRows.map(row => row.__feature);
            ZoomToFeatures(map, features);
        }
    }, [gridApi, map]);

    return(
        <Button {...otherProps} onClick={onClickHandler}>
            {props.children}
        </Button>
    );

};

ZoomToSelectedFeaturesButton.propTypes = {

    /**
     * The OpenLayers ol/Map to zoom
     */
    map: PropTypes.instanceOf(Map).isRequired,


    /**
     * The Grid Api for <a href="https://www.ag-grid.com/react-grid/grid-api/">Ag-Grid</a>.
     */
    gridApi: PropTypes.any,

    /**
     * The child node for the button
     */
    children: PropTypes.node
};

export default ZoomToSelectedFeaturesButton;