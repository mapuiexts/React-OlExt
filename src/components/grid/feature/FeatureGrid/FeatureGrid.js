import React, {useState, useCallback, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import olMap from 'ol/Map';
import olVectorLayer from 'ol/layer/Vector';
import OlStyle from 'ol/style/Style';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleStroke from 'ol/style/Stroke';
import OlGeomGeometry from 'ol/geom/Geometry';
import {zoomToLayer as zoomToLyr} from '../../../../util/map';
import { AgGridReact } from 'ag-grid-react';
import FeatureGridMenuBar from '../../../menuBar/feature/FeatureGridMenuBar/FeatureGridMenuBar';
import usePrevious from '../../../../hooks/common/usePrevious';
import defined from '../../../../core/defined';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const defaultKeyFunction = (feature) => feature.ol_uid;


/**
 * <p>Component to load the the openlayers features in the grid:</p>
 * <ol>
 *  <li>All the features in the vector layer <i>vectorLayer</i> 
 *      will be loaded in the grid.
 *  </li>
 *  <li>
 *      The <strong>unselected</strong> feature(s) in the row grid will be rendered
 *      using the style defined in <i>featureStyle</i>.
 *  </li>
 *  <li>
 *      The <strong>selected</strong> feature(s) in the row grid will be rendered
 *      using the style defined in <i>selectedFeatureStyle</i>.
 *  </li>
 *  <li>
 *      Addional properties not listed below can be passed. See
 *      <a href="https://www.ag-grid.com/react-grid/grid-properties/">documentation</a> 
 *      for more details.
 *  </li>
 * </ol>
 * 
 * @visibleName Feature Grid
 */
const FeatureGrid = (
{
    map,
    vectorLayer,
    zoomToLayer = true,
    columnDefs = null,
    rowSelection= 'multiple', //'single',
    featureStyle =  new OlStyle({
        stroke: new OlStyleStroke({
            //color: 'rgba(204, 0, 204, 1.0)',
            color: 'rgba(0, 0, 255, 0.4)',
			width: 2
		}),
		fill: new OlStyleFill({
            //color: 'rgba(255, 179, 255, 0.4)'
            color: 'rgba(97, 218, 251, 0.4)'
        }),
        image: new OlStyleCircle({
			radius: 8,
			fill: new OlStyleFill({
				color: 'rgba(97, 218, 251, 1.0)',
			}),
			stroke: new OlStyleStroke({
				color: '#000',
				width: 2
			})
		})
    } ),
    selectedFeatureStyle =  new OlStyle({
        stroke: new OlStyleStroke({
            //color: 'rgba(204, 0, 204, 1.0)',
            color: 'rgba(0, 0, 0, 1.0)',
			width: 3
		}),
		fill: new OlStyleFill({
            color: 'rgba(0, 0, 255, 0.5)' 
            
        }),
        image: new OlStyleCircle({
			radius: 10,
			fill: new OlStyleFill({
				color: 'rgba(0, 0, 255, 1.0)', //dark magenta (40%)
			}),
			stroke: new OlStyleStroke({
				color: '#000',
				width: 2
			}),
			
		}),
		zIndex: 100
    }),
    keyFunc= defaultKeyFunction,
    className='ag-theme-balham',
    onGridReady,
    onRowClicked,
    onSelectionChanged,
    ...otherProps
} ) => {

    const [currentColumnDefs, setCurrentColumnDefs] = useState(columnDefs);
    const [_rowData, setRowData] = useState([]);
    const [_selectedFeatures, setSelectedFeatures] = useState([]);
    const [_gridApi, setGridApi] = useState(null);
    const [, setGridColumnApi] = useState();

    const previousColumnDefs = usePrevious(columnDefs);
    if(columnDefs !== previousColumnDefs && columnDefs !== currentColumnDefs) {
        setCurrentColumnDefs(columnDefs);
    }


    /**
     * callback used to pass as attribute for ag-grid
     * to retrieve the row based on a defined id
     * 
     * Usage: const rowNode = gridOptions.api.getRowNode(key);
     */
    const getRowId =  useCallback((params) => {
        return params.data.key;
        //usage: var rowNode = gridOptions.api.getRowNode('aa');
    }, []);


    /**
     * Generate the grid row data in json format from
     * all the features present in the array
     * 
     * @param {ol.Feature[]} features The array of features to 
     *                                generate row data drom.
     * @return {Object[]} The array containing the row data
     */

    const buildRowDataFromFeatures = useCallback((features) => {
        const data = [];
        features.forEach(feature => {
            const properties = feature.getProperties();
            const filtered = Object.keys(properties)
              //filter out the properties having geometry type
              .filter(key => !(properties[key] instanceof OlGeomGeometry))
              .reduce((obj, key) => {
                obj[key] = properties[key];
                return obj;
              }, {});
      
            data.push({
              key: keyFunc(feature),
              __feature:feature,
              ...filtered
            });
        });
        return data;
    }, [keyFunc]);

     /**
     * Generata the grid row data in json format from
     * all the features present in the vector layer
     * 
     * @param {ol.layer.Vector} layer The vector layer
     * @return {Object[]} The array containing the row data
     */
    const buildRowDataFromLayer = useCallback((layer) => {
        if(! layer) return [];
        const features = layer.getSource().getFeatures();
        const data = buildRowDataFromFeatures(features);
        return data;
    }, [buildRowDataFromFeatures]);


    /**
     * Event handler to 'propertychange' events of the underlying `ol.Feature`. 
     * All changes on the object will be reflected in the row grid.
     * See: https://www.ag-grid.com/documentation/react/data-update-single-row-cell/
     * 
     * @param {ol.ObjectEvent} evt evt The `ol.ObjectEvent` we receive as handler.
     */

    const onFeaturePropertyChangeHandler = useCallback((evt) => {
        //retrieve the changed feature
        const changedFeature = evt.target;
        const propertyName = evt.key;
        const propertyValue = changedFeature.get(propertyName);
        const row = _gridApi.getRowNode(keyFunc(changedFeature));

        if(row) {
            //change the data for the grid row
            if(propertyName in row.data)
                row.setDataValue(propertyName, propertyValue);
        }
    }, [_gridApi, keyFunc]);

    /**
     * Method to register the feature 'propertychange' event handler in all
     * the features in the array.
     * 
     * @param {ol.Feature[]} features Array of features on which the handler
     *                                will be registered
     */

    const registerFeaturePropertyChange = useCallback((features) => {
        features.forEach(feature => {
            feature.on('propertychange', onFeaturePropertyChangeHandler)
        });
    }, [onFeaturePropertyChangeHandler]);

    /**
     * Method to unregister the feature 'propertychange' event handler in all
     * the features in the array.
     * 
     * @param {ol.Feature[]} features Array of features on which the handler
     *                                will be unregistered
     */
    
    const unRegisterFeaturePropertyChange = useCallback((features) => {
        features.forEach(feature => {
            feature.un('propertychange', onFeaturePropertyChangeHandler)
        });
    }, [onFeaturePropertyChangeHandler]);


    
    /**
     * Event Handler for the event 'add' fired when a feature is
     * added in the layer.
     * This method will:
     * (a) Add a new row in the data grid
     * (b) register in the added feature the event handler 'propertychange'
     * @param {ol.CollectionEvent} evt The event fired by the layer
     */
    const onFeatureAddHandler = useCallback((evt) => {
    //const onFeatureAddHandler = useDynamicCallback((evt) => {
        //retrives the feature and layer on which feature was removed
        const feature = evt.feature;
        //register 'propertychange' in the added feature
        feature.on('propertychange', onFeaturePropertyChangeHandler)
        //replace the row data to rebuild the data to refresh the grid.
        //TODO: to check the asyn method for performance:
        //https://www.ag-grid.com/javascript-grid-data-update-high-frequency/
        // _gridApi.updateRowData({add: data});
        const data = buildRowDataFromFeatures([feature]);
        _gridApi.applyTransaction({add: data});
        //refresh the row model
        _gridApi.refreshClientSideRowModel('filter')
    }, [buildRowDataFromFeatures, _gridApi, onFeaturePropertyChangeHandler]);
    //});

    /**
     * Event Handler for the event 'remove' fired when a feature is
     * removed from the layer.
     * This method will:
     * (a) remove row in the data grid
     * (b) unregister in the removed feature the event handler 'propertychange'
     * @param {ol.CollectionEvent} evt The event fired by the layer
     */
    const onFeatureRemoveHandler = useCallback((evt) => {
        //retrives the feature and layer on which feature was removed
        const removedFeature = evt.feature;
        //unregister 'propertychange' in the added feature
        removedFeature.un('propertychange', onFeaturePropertyChangeHandler);
        
        //replace the row data to rebuild the data to refresh the grid.
        //TODO: to check the asyn method for better performance:
        //https://www.ag-grid.com/javascript-grid-data-update-high-frequency/
        
        //remove the row from the grid
        const row = _gridApi.getRowNode(keyFunc(removedFeature));
        if(!row) return;
        _gridApi.applyTransaction({remove: [row.data]});
    }, [_gridApi, keyFunc, onFeaturePropertyChangeHandler]);



    /**
     * Event Handler for the event 'clear' fired when the clear is
     * called from the layer source.
     * This method will:
     * (a) remove row in the data grid
     * (b) unregister in the removed feature the event handler 'propertychange'
     * @param {ol.CollectionEvent} evt The event fired by the layer
     */
    const onFeatureSourceClearHandler = useCallback((evt) => {

        //replace the row data to rebuild the data to refresh the grid.
        //TODO: to check the asyn method for better performance:
        //https://www.ag-grid.com/javascript-grid-data-update-high-frequency/
        
        //remove the row from the grid
        //_gridApi.applyTransaction({remove: _rowData});
        _gridApi.setRowData([]);
    }, [_gridApi]);

    /**
     * Method to register the event handlers 'addfeature'
     * and 'removefeature' to handle the cases on which the 
     * feature is added or removed from the layer.
     * @param {ol.layer.Base} layer The layer
     */
    const registerLayerEventHandlers = useCallback((layer) => {
        if(layer) {
            //layer.getSource().on('changefeature', onFeatureChangeHandler);
            layer.getSource().on('addfeature', onFeatureAddHandler);
            layer.getSource().on('removefeature', onFeatureRemoveHandler);
            layer.getSource().on('clear', onFeatureSourceClearHandler)
        }
    }, [onFeatureAddHandler, onFeatureRemoveHandler, onFeatureSourceClearHandler]);


    /**
     * Method to unregister the event handlers 'addfeature' 
     * and 'removefeature' to handle the cases on which the 
     * feature is added or removed from the layer.
     * @param {ol.layer.Base} layer The layer.
     */
    const unRegisterLayerEventHandlers = useCallback((layer) => {
        if(layer) {
            //layer.getSource().un('changefeature', onFeatureChangeHandler);
            layer.getSource().un('addfeature', onFeatureAddHandler);
            layer.getSource().un('removefeature', onFeatureRemoveHandler);
            layer.getSource().un('clear', onFeatureSourceClearHandler)
        }
    }, [onFeatureAddHandler, onFeatureRemoveHandler, onFeatureSourceClearHandler]);

    

   
    /**
     * If the attribute "columnDefs" is not provided for this component,
     * buid the columnDefs based on the properties of the feature
     * in the vector layer
     */

    const buildColumnDefs = useCallback((vectorLayer) => {
        if((!defined(currentColumnDefs) || currentColumnDefs.length === 0)
            && defined(vectorLayer) && vectorLayer.getSource().getFeatures().length > 0) {
        // if((columnDefs.length === 0) && vectorLayer 
        //     && vectorLayer.getSource().getFeatures().length > 0) {
            const features = vectorLayer.getSource().getFeatures();
            if(features && features.length > 0) {
                //retrieve the first feature and its properties
                const feature = features[0];
                const properties = feature.getProperties();
                const geometryName = feature.getGeometryName();
                const gridColumnDefs = [];
                //build grid properties ignoring geometry property
                for (const field in properties) {
                    if(field !== geometryName) {
                        gridColumnDefs.push({
                            field: field,
                            sortable:true,
                            filter:true,
                            resizable:true
                        });
                    }
                }
                setCurrentColumnDefs(gridColumnDefs);
            }
        }
    }, [currentColumnDefs]);

    /**
     * Event Handler fired when the grid is ready.
     * This handler will initialize the grid api 
     * in the state
     */
    const onInternalGridReady = useCallback((params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
        onGridReady && onGridReady(params);
    }, [onGridReady]);
   

    /**
     * Event handler called when the selection has been changed.
     * This handler will highlight in the map the selected 
     * feature and un-highlight the unselected ones.
     * 
     * @param {*} evt The SelectionChangedEvent
     */
    const onInternalSelectionChanged = useCallback((evt) => {
        //retrieve the selected features
        let newSelectedRows = null;
        if(!_gridApi) {
            newSelectedRows = evt.api.getSelectedRows();
        }
        else {
            newSelectedRows = _gridApi.getSelectedRows();
        }
        const newSelectedFeatures = newSelectedRows.map(row=>row.__feature);
        //unhighlight the previous features
        _selectedFeatures.forEach(feature => {
            if(!newSelectedFeatures.includes(feature)) {
                feature.setStyle(null);
            }
        });
        //highlight the new features
        newSelectedFeatures.forEach(feature => {
            if(!_selectedFeatures.includes(feature)) {
                feature.setStyle(selectedFeatureStyle);
                //feature.set('GEN', feature.get('GEN') + 'A');
                //vectorLayer.getSource().removeFeature(feature);
            }
        });
        //update state
        setSelectedFeatures(newSelectedFeatures);

        //fire event
        onSelectionChanged && onSelectionChanged(evt);

    }, [_selectedFeatures, selectedFeatureStyle, _gridApi, onSelectionChanged]);


    /**
     * To Zoom to the Layer during the initialization
     */
    useEffect(() => {
        if(zoomToLayer && vectorLayer && vectorLayer.getSource().getFeatures().length > 0) {
            zoomToLyr(map, vectorLayer);
        }
    },[map, zoomToLayer, vectorLayer]);
    

    /**
     * Set the initial style for the layer
     * (or change to set for the feature ??)
     */
    useEffect(() => {
        if(vectorLayer && featureStyle) {
            vectorLayer.setStyle(featureStyle);
        }

    }, [featureStyle, vectorLayer]);

    /**
     * Build the column definitions and the row data based on
     * the features present in the vector layer and its properties
     */
    useEffect(() => {
        buildColumnDefs(vectorLayer);
        const data = buildRowDataFromLayer(vectorLayer);
        setRowData(data);
    }, [buildColumnDefs, buildRowDataFromLayer, vectorLayer]);


    /**
     * Register the event handlers for the ol objects:
     * (a) Register 'propertychange' for all the features in the layer
     */

    useEffect(() => {
        if(vectorLayer) {
            registerFeaturePropertyChange(vectorLayer.getSource().getFeatures());
        }
        return () => {
            if(vectorLayer) {
                unRegisterFeaturePropertyChange(vectorLayer.getSource().getFeatures());
            }
        }
    }, [registerFeaturePropertyChange, unRegisterFeaturePropertyChange, vectorLayer]);

    /**
     * Register/Unregister the event handlers for the collection of features in the layer:
     * (a) Register 'add', 'remove' and 'clear' event handlers  for the 
     * collection of features in the layer
     */
    useEffect(() => {
        if(vectorLayer) {
            registerLayerEventHandlers(vectorLayer);
        }
        return () => {
            if(vectorLayer) {
                unRegisterLayerEventHandlers(vectorLayer);
            }
        }
    }, [registerLayerEventHandlers, unRegisterLayerEventHandlers, vectorLayer]);

    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            resizable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
            headerComponentParams: {
                menuIcon: 'fa-bars'
            }
        };
      }, []);

    return(
        <AgGridReact
            {...otherProps}
            className={className}
            onGridReady={onInternalGridReady}
            onSelectionChanged={onInternalSelectionChanged}
            onRowClicked={onRowClicked}
            rowSelection={rowSelection}
            enableCellTextSelection
            getRowId={getRowId}
            columnDefs={currentColumnDefs}
            defaultColDef={defaultColDef}
            rowData={_rowData}
            
        />
    );
};

FeatureGrid.propTypes = {
    /**
     * The OpenLayers map <i>ol/Map</i> where the features will be rendered.
     */
    map: PropTypes.instanceOf(olMap).isRequired,

    /**
     * The OpenLayers vector layer <i>ol/layer/Vector</i> 
     * where the feature will be rendered.
     */
    vectorLayer: PropTypes.instanceOf(olVectorLayer).isRequired,

    /**
     * The class name to provide different themes.
     * Check the  <a href="https://www.ag-grid.com/react-grid/themes-provided/">available themes.</a>
     * details about available themes.
     */
    className: PropTypes.string,

     /**
     * <p>Array of <a href="https://www.ag-grid.com/react-grid/grid-properties">Column Definitions.</a></p>
     * <p>
     *  If it is a empty array, all the property names will be shown
     *  in the grid.
     * </p>
     */
    columnDefs: PropTypes.array,

    /**
     * The openLayers style <i>ol/Style</i> used to render the
     * <u>unselected</u> feature(s) in the row grid.
     */
    featureStyle: PropTypes.instanceOf(OlStyle),

    /**
     * The openLayers style <i>ol/Style</i> used to render the
     * <u>selected</u> feature(s) in the row grid.
     */
    selectedFeatureStyle: PropTypes.instanceOf(OlStyle),

    /**
     * If true, the map will we zoomed to the features in the 
     * layer <i>vectorLayer</i> during the initialization;
     */
    zoomToLayer: PropTypes.bool,

    /**
     * Function to provide a unique identifer for the feature in the map.
     * The default function returns your internal unique identifier (uid).
     */
    keyFunc: PropTypes.func,

    /**
     * Allow a single or multiple row selection in the grid.
     */
    rowSelection: PropTypes.oneOf(['single', 'multiple']),

    /**
     * Event Handler for the event fired once the grid was
     * initialised.
     */
    onGridReady: PropTypes.func,

    /**
     * Event Handler for the event fired once the user selects 
     * one or more rows in the grid. See example below to check
     * how it works.
     */
    onSelectionChanged: PropTypes.func,

    /**
     * Event Handler for the event fired once a row in the
     * grid is selected.
     */
    onRowClicked: PropTypes.func,


};



FeatureGrid.MenuBar = FeatureGridMenuBar;


export default FeatureGrid;