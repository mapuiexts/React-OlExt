import React, {useCallback, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Collection from 'ol/Collection';
import Layer from 'ol/layer/Layer';
import VectorLayer from 'ol/layer/Vector';
import { Button, Modal } from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import defined from '../../../../core/defined';
import {refreshWmsLayer} from '../../../../../core/map';
import useWriteWfsTransaction from '../../../../../hooks/wfst/useWriteWfsTransaction';

/**
 * Button to delete the selected features in the grid
 * @visibleName WFST Delete Selected Features
 */
const WfstDeleteSelectedFeaturesButton = ({
    url,
    wmsLayer,
    vectorLayer,
    wfsOptions,
    gridApi, 
    children, 
    ...otherProps
}
) => {

    const [selectedFeatures, setSelectedFeatures] = useState(null);
    const [sendRequest, clearRequest, isLoading, data, error] = useWriteWfsTransaction();

    /**
     * Show the confirm dialog box requesting if the user 
     * really wants to delete the feature
     */
    const showConfirmDialog = useCallback(() => {
        Modal.confirm({
            title: 'Delete Feature(s)',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete the selected features(s)',
            //Handler called once the user clicks the OK button.
            //This handler will send the wfst request to update the pole
            onOk: () => {
                const selectedRows = gridApi.getSelectedRows();
                const features = selectedRows.map(row => row.__feature);
                if(defined(features) && features.length > 0) {
                    const deletedFeatures = new Collection();
                    features.forEach((feature) => {
                        deletedFeatures.push(feature);
                    });
                    sendRequest(url, null, null, deletedFeatures, wfsOptions);
                    setSelectedFeatures(features);
                }
            },
            // Handler called once the user click the close 
            // button in the "Update Pole" dialog box.
            // The window will be closed
            onCancel: () => {
                setSelectedFeatures(null);
            },
        })
    }, [gridApi, sendRequest, url, wfsOptions]);

    /**
     * Handler called once the user clicks the button.
     * The confirm dialog will be shown.
     */
    const onClickHandler = useCallback((event) => {
        if(defined(gridApi)) {
            showConfirmDialog();
        }
    }, [gridApi, showConfirmDialog]);

     /**
     * Method returned once the feature is deleted in the database
     * The wms layer is refreshed to remove the deleted feature
     * from the wms latyer
     */
    useEffect(() => {
        //response from transaction is returned
        if(!isLoading && defined(data) ) {
            console.log('transaction finished', data);
            clearRequest();
            defined(wmsLayer) && refreshWmsLayer(wmsLayer);
            selectedFeatures.forEach((feature) => {
                vectorLayer.getSource().removeFeature(feature);
            });
            setSelectedFeatures(null);
        }

    }, [clearRequest, data, isLoading, wmsLayer, selectedFeatures, vectorLayer]);

    /**
     * method returned if a error is reported during
     * the delete operation in the database
     */
    useEffect(() => {
        //response error from transaction is returned
        if(!isLoading && defined(error) ) {
            console.log('transaction failed', error);
            clearRequest();
            setSelectedFeatures(null);
        }

    }, [isLoading, error, clearRequest]);


    return (
        <React.Fragment>
            <Button {...otherProps} onClick={onClickHandler}>
                {children}
            </Button>
        </React.Fragment>
    );

};

WfstDeleteSelectedFeaturesButton.propTypes = {
    /**
     * The url used for the WFS request
     */
     url: PropTypes.string.isRequired,

    /**
      * The wms layer for the deleted feature.
      * If provided, the map will be refreshed to 
      * reflect the deleted features in the map.
      */
     wmsLayer: PropTypes.instanceOf(Layer),

    /**
      * The vector Layer on where the deleted features are stored.
      * After the deletion in the database, these features will
      * be removed from the vector layer
      */
     vectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,

    /**
     * The WFS options for the WFST WriteTransaction request.
     * This object has the same format as used in the OpenLayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html#writeTransaction">
     * ol/format/WFS.writeTransaction</a> method.
     */
    wfsOptions: PropTypes.object.isRequired,

    /**
     * The Grid Api for <a href="https://www.ag-grid.com/react-grid/grid-api/">Ag-Grid</a>.
     */
     gridApi: PropTypes.any,

    /**
     * The child node for the button
     */
    children: PropTypes.node
}

export default WfstDeleteSelectedFeaturesButton;