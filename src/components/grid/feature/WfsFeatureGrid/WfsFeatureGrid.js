import React, {useState, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Space, Divider} from 'antd';
import olMap from 'ol/Map';
import OlStyle from 'ol/style/Style';
import olVectorLayer from 'ol/layer/Vector';
import FeatureGrid from '../FeatureGrid/FeatureGrid';
import WfsSearchMenuBar from '../../../menuBar/wfs/search/WfsSearchMenuBar/WfsSearchMenuBar';
import useWFSDescribeFeatureType from '../../../../hooks/wfs/useWFSDescribeFeatureType';
import './WfsFeatureGrid.css';


const defaultKeyFunction = (feature) => feature.ol_uid;
const defaultColumnDefs = [];

/**
 * <p>
 *  Grid Component to allow to send a WFS Request and load all the features
 *  Retrieved in the response.
 * </p>
 * <p>The following functionalities are present:</p>
 * <ol>
 *  <li>
 *      The <i>Search Type</i> button will allow to select the type of search (by
 *      properties, by point, by BBox, etc...)
 *  </li>
 *  <li>
 *      Each selected "Search Type" will load the needed input controls for the
 *      search. A button will be present to send the WFS Request after the 
 *      needed input values were provided on these input controls.
 *  </li>
 *  <li>All the features returned in the WFS response  will be loaded in the grid.</li>
 *  <li>
 *      The <i>Clear Button</i> will offer the options to remove all loaded features in the grid or
 *      to remove only the feature(s) selected in the grid.
 *  </li>
 *  <li>
 *      The <i>Zoom Button</i> will offer the options to zoom to all features loaded in the grid or
 *      to zoom only to the feature(s) selected in the grid.
 *  </li>
 *  <li>
 *      The unselected feature(s) in the row grid will be rendered
 *      using the style defined in <i>featureStyle</i>.
 *  </li>
 *  <li>
 *      The selected feature(s) in the row grid will be rendered
 *      using the style defined in <i>selectedFeatureStyle</i>.
 *  </li>
 *  <li>
 *      Addional properties not listed below can be passed. See
 *      <a href="https://www.ag-grid.com/react-grid/grid-properties/">documentation</a> 
 *      for more details.
 *  </li>
 * </ol>
 * 
 * @visibleName WFS Feature Grid
 */

const WfsFeatureGrid = (
{
    url,
    wfsOptions,
    fetchOptions,
    map,
    vectorLayer,
    zoomToLayer = true,
    columnDefs = defaultColumnDefs,
    rowSelection= 'multiple',
    featureStyle,
    selectedFeatureStyle,
    className='ag-theme-balham',
    keyFunc= defaultKeyFunction,
    onSelectionChanged,
    onGridReady,
    onRowClicked,
    ...otherProps

}) => {
    
    const {isLoading, data, error, sendRequest, } = useWFSDescribeFeatureType();

    const [gridApi, setGridApi] = useState(null);
    const [internalColumnDefs, setInternalColumnDefs] = useState(columnDefs);

    // const previousColumnDef = usePrevious(columnDefs);
    // if (columnDefs !== previousColumnDef && columnDefs !== internalColumnDefs) {
    //     setInternalColumnDefs(columnDefs);
    // }

    /**
     * Method to build the column definitios from the feature types
     * retrieved from the WFS Service DescribeFeatureType
     * @param {Object} jsonFeatTypes A json object retrieved from 
     *                               the WFS Service DescribeFeatureType
     */
    const buildColumnDefsFromWfsDescribeFeatureTypes = (jsonFeatTypes) => {
        const newColumnDefs = [];
        if(jsonFeatTypes && ('featureTypes' in jsonFeatTypes)) {
            //retrieve the first feature type
            const featureTypes = jsonFeatTypes.featureTypes[0].properties;
            featureTypes.forEach((featType) => {
                //filter out of geometry gml types
                if(!featType.type.includes('gml')) {
                    newColumnDefs.push({
                        field: featType.name,
                        sortable:true,
                        filter:true,
                        resizable:true
                    });
                }
            });
        }

        return newColumnDefs;
    };


     /**
     * Event Handler fired when the grid is ready.
     * This handler will initialize the grid api 
     * in the state
     */
    const onInternalGridReady = useCallback((params) => {
        setGridApi(params.api);
        onGridReady && onGridReady(params);
    }, [onGridReady]);


    /**
     * Send a call to WFS DescribeFeatureType to be used later
     * to build the column definitions
    */
    useEffect(() => {
            //const featureType = 'LoM:WFS_MUN';
            let featureType = wfsOptions.featureTypes[0];
            if ('featurePrefix' in wfsOptions) {
                featureType = wfsOptions.featurePrefix + ':' + featureType;
            }
            sendRequest(url, featureType);

    }, [sendRequest, url, wfsOptions]);


    /**
     * Build the Grid Column definitions from the data retrieved from
     * the WFS service DescribeFeatureType
     */
    useEffect(() => {
        if((! internalColumnDefs || internalColumnDefs.length === 0) 
            && data && !isLoading && !error) {
                const newColumnDefs = buildColumnDefsFromWfsDescribeFeatureTypes(data);
                setInternalColumnDefs(newColumnDefs);
            }
    }, [internalColumnDefs, vectorLayer, data, isLoading, error]);

    return(
        <div className='rolext-wfsfeaturegrid'/*style={ { height: "100%", width: "100%" } }*/>
            <Space wrap className='rolext-wfsfeaturegrid-menubar-container'>
                <FeatureGrid.MenuBar map={map} layer={vectorLayer} gridApi={gridApi} />
                <Divider type="vertical" />
                <WfsFeatureGrid.SearchMenuBar map={map} layer={vectorLayer} url={url} 
                    wfsOptions={wfsOptions} fetchOptions={fetchOptions} columnDefs={internalColumnDefs}
                />
            </Space>
            <div className='rolext-wfsfeaturegrid-content-container' /*style={{height:'80%'}}*/>
                <FeatureGrid
                    map={map}
                    vectorLayer={vectorLayer}
                    zoomToLayer={zoomToLayer}
                    columnDefs={internalColumnDefs}
                    rowSelection={rowSelection}
                    featureStyle={featureStyle}
                    selectedFeatureStyle={selectedFeatureStyle}
                    keyFunc={keyFunc}
                    onGridReady={onInternalGridReady}
                    onSelectionChanged={onSelectionChanged}
                    onRowClicked={onRowClicked}
                    className={className}
                    {...otherProps}
                />
            </div>
        </div>
    );
};

WfsFeatureGrid.propTypes = {

    /**
     * The url used for the WFS request
     */
    url: PropTypes.string.isRequired,

    /**
     * The WFS options for the WFS GetFeature request.
     * This object has the same format as used in the OpenLayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html">
     * ol/format/WFS.writeGetFeature</a> method.
     */
    wfsOptions: PropTypes.object.isRequired,

    /**
     * Additional options to be used for the 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">fetch API</a>.
     */
    fetchOptions: PropTypes.object,

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
     * If true, the map will we zoomed to the features in the 
     * layer <i>vectorLayer</i> during the initialization;
     */
    zoomToLayer: PropTypes.bool,

    /**
     * <p>Array of <a href="https://www.ag-grid.com/react-grid/grid-properties">Column Definitions.</a></p>
     * <p>
     *  If it is a empty array, all the property names will be shown
     *  in the grid.
     * </p>
     */
    columnDefs: PropTypes.array,

    /**
     * Allow a single or multiple row selection in the grid.
     */
    rowSelection: PropTypes.oneOf(['single', 'multiple']),

     /**
     * The openLayers style <i>ol/Style</i> used to render the
     * <u>unselected</u> feature(s) in the row grid.
     * If not provided, a default style will be provided
     * by the <i>FeatureGrid</i> component.
     */
    featureStyle: PropTypes.instanceOf(OlStyle),

     /**
     * The openLayers style <i>ol/Style</i> used to render the
     * <u>selected</u> feature(s) in the row grid.
     * If not provided, a default style will be provided
     * by the <i>FeatureGrid</i> component
     */
    selectedFeatureStyle: PropTypes.instanceOf(OlStyle),

    /**
     * Function to provide a unique identifer for the feature in the map.
     * The default function returns your internal unique identifier (uid).
     */
    keyFunc: PropTypes.func,

    /**
     * Event Handler for the event fired once the user selects 
     * one or more rows in the grid. See example below to check
     * how it works.
     */
    onSelectionChanged: PropTypes.func,

    /**
     * Event Handler for the event fired once the grid was
     * initialised.
     */
    onGridReady: PropTypes.func,

    /**
     * Event Handler for the event fired once a row in the
     * grid is selected.
     */
    onRowClicked: PropTypes.func,

    /**
     * The class name to provide different themes.
     * Check the  <a href="https://www.ag-grid.com/react-grid/themes-provided/">available themes.</a>
     * details about available themes.
     */
    className: PropTypes.string,

}



WfsFeatureGrid.SearchMenuBar = WfsSearchMenuBar;

export default WfsFeatureGrid;