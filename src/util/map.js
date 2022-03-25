import {Collection as OlCollection, Map as OlMap, View as OlView} from "ol";
import VectorSource from 'ol/source/Vector';
import {ScaleLine, defaults as defaultControls} from 'ol/control';
import {defaults as interactionDefaults}  from 'ol/interaction';
import OlLayerTile from "ol/layer/Tile";
import {OSM as OlSourceOSM}  from "ol/source";
import OlLayerGroup from 'ol/layer/Group';
import OlSourceTileWMS from 'ol/source/TileWMS';
import {createStringXY} from 'ol/coordinate';
import {transform} from 'ol/proj';
import { fromLonLat } from 'ol/proj';
import {METERS_PER_UNIT as OlProjMETERS_PER_UNIT} from 'ol/proj';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj/projections';

var projObj = {
  'code': '31370', 
  'name': 'Belge 1972 / Belgian Lambert 72',
  'proj4': "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs",
  'bbox': [51.51, 2.5, 49.5, 6.4]
};
proj4.defs('EPSG:31370', projObj['proj4']);
register(proj4);
//const proj31370 = getProjection('EPSG:31370');

export function registerProjection(projectionCode, proj4Definition) {
  let projection = getProjection(projectionCode);
  if(!projection) {
      proj4.defs(projectionCode, proj4Definition);
      register(proj4);
      projection = getProjection(projectionCode)
  }
  return projection;
}

export function createDefaultMap(viewOpts={
  projection: 'EPSG:31370',
  center: [170000, 135000],
	zoom: 9
  
})
 {
     //create osm layer
     const osmLayer = new OlLayerTile({
        name: 'OSM',
        source: new OlSourceOSM(),
        zIndex: 0,
    });


    //create a default map
    const options = {
        controls: defaultControls({attribution: false}).extend(
        [
            //mousePositionControl, 
            new ScaleLine({units: 'metric'})
        ]),
        interactions: interactionDefaults({
            constrainResolution: false, 
        }),
        view: new OlView(viewOpts),
        layers: [osmLayer],
        overlays: []
    };
    
    return (new OlMap(options));
}


export function createExampleMap() {
    const layerGroup = new OlLayerGroup({
        name: 'Layergroup',
        layers: [
          new OlLayerTile({
            name: 'OSM-Overlay-WMS',
            minResolution: 0,
            maxResolution: 200,
            source: new OlSourceTileWMS({
              url: 'https://ows.terrestris.de/osm/service',
              params: {
                'LAYERS': 'OSM-Overlay-WMS'
              }
            })
          }),
          new OlLayerTile({
            name: 'SRTM30-Contour',
            minResolution: 0,
            maxResolution: 10,
            source: new OlSourceTileWMS({
              url: 'https://ows.terrestris.de/osm/service',
              params: {
                'LAYERS': 'SRTM30-Contour'
              }
            })
          })
        ]
    });
  
    const map = new OlMap({
        layers: [
            new OlLayerTile({
            name: 'OSM',
            source: new OlSourceOSM()
            }),
            layerGroup
        ],
        view: new OlView({
            center: fromLonLat([12.924, 47.551]),
            zoom: 13
        })
    });

    return map;
}


/**
 * Create a default overview map having a osm layer
 * based on the parent map configuration
 * 
 * @param {ol.Map} parentMap The parent map
 * @param {Array} layers A collection of layers to be added in the overview map. If null, 
 *                   a osm layer will be added
 */
export function createDefaultOverviewMap(parentMap, layers = null) {
    const parentView = parentMap.getView();
    if(!layers) {
        //create osm layer
        const osmLayer = new OlLayerTile({
            source: new OlSourceOSM(),
            zIndex: 0,
        });
        layers = [osmLayer];
    }

    //create overview map
    const overviewMap = new OlMap({
        controls: new OlCollection(),
        //interactions: new OlCollection(),
        interactions: interactionDefaults({
            constrainResolution: false, 
            doubleClickZoom: false,
            dragAndDrop: false,
            dragPan: false,
            keyboardPan: false,
            keyboardZoom: false,
            mouseWheelZoom: false,
            pointer: false,
            select: false
        }),
        view: new OlView({
            center: parentView.getCenter(),
            zoom: parentView.getZoom(),
            projection: parentView.getProjection()
        })
    });
    //add layers
    layers.forEach((layer) => {
        overviewMap.addLayer(layer);
    });
    
    return overviewMap;
}

/**
 * Returns all layers of a collection. Even the hidden ones.
 *
 * @param {ol.Map|ol.layer.Group} collection The collection to get the layers
 *                                           from. This can be an ol.layer.Group
 *                                           or an ol.Map.
 * @param {Function} [filter] A filter function that receives the layer.
 *                            If it returns true it will be included in the
 *                            returned layers.
 * @return {Array} An array of all Layers.
 */
export function getAllLayers(collection, filter = (() => true)) {
    
    var layers = collection.getLayers().getArray();
    var allLayers = [];

    layers.forEach(function(layer) {
        if (layer instanceof OlLayerGroup) {
            getAllLayers(layer).forEach((layeri) => {
                if (filter(layeri)) {
                    allLayers.push(layeri);
                }
            });
        }
        if (filter(layer)) {
        allLayers.push(layer);
        }
    });
    return allLayers;
}

/**
 * Get a layer by its key (ol_uid).
 * 
 * @param {ol.map} map 
 * @param {string} ol_uid The UID for the layer as string
 * @return {ol.layer.Layer} The layer found
 */
export const getLayerByOlUid = (map, ol_uid) => {
    const layers = getAllLayers(map);
    const layer = layers.find((l) => {
      return ol_uid === l.ol_uid.toString();
    });
    return layer;
}


/**
 * Get information about the layer position in the tree.
 * 
 * @param {ol.layer.Layer} layer The layer to get the information
 * @param {ol.layer.Group | ol.Map} groupLayerOrMap The group layer or map
 *                                                  containing the information
 * @return {Object} An object with the keys:
 *      {ol.layer.Group} groupLayer The group Layer containing the layer
 *      {Integer} position The position of the layer in the collection
 */
export const getLayerPositionInfo = (layer, groupLayerOrMap) => {
    const groupLayer = groupLayerOrMap instanceof OlLayerGroup
      ? groupLayerOrMap
      : groupLayerOrMap.getLayerGroup();
    const layers = groupLayer.getLayers().getArray();
    //let info = {};
    let info = {position: layers.length - 1, groupLayer: groupLayer};

    if (layers.indexOf(layer) < 0) {
      layers.forEach((childLayer) => {
        if (childLayer instanceof OlLayerGroup /*&& !info.groupLayer*/) {
          info = getLayerPositionInfo(layer, childLayer);
        }
      });
    } else {
      info.position = layers.indexOf(layer);
      info.groupLayer = groupLayer;
    }
    return info;
};

/**
 * Calculates the resolution based on the scale.
 * 
 * @param {ol.Map} map The map on which the resolution will be calculated
 * @param {number} scale The scale to calculate the resolution
 * @return {number} The calculated resolution
 */
export const getResolutionFromScale = (map, scale) => {
  const units = map.getView().getProjection().getUnits();
  const dpi = 25.4 / 0.28;
  const mpu = OlProjMETERS_PER_UNIT[units];
  const resolution = scale/(mpu * 39.37 * dpi);
  return resolution;
};

/**
 * Calculates the scale based on the resolution.
 * 
 * @param {ol.Map} map  The map on which the scale will be calculated
 * @param {number} resolution The resolution to calculate the scale.
 * @return {number} The calculated scale.
 */
export const getScaleFromResolution = (map, resolution) => {
  const units = map.getView().getProjection().getUnits();
  const dpi = 25.4 / 0.28;
  const mpu = OlProjMETERS_PER_UNIT[units];
  const scale = resolution * (mpu * 39.37 * dpi);
  return scale;
};

/**
 * Zoom the map based on the provided extent.
 * 
 * @param {ol.Map} map The map where the zoom will be performed
 * @param {ol.extent.Extent} extent The extent to be zoomed
 */
export const zoomToExtent = (map, extent) => {
	if(extent === null || extent === undefined || extent[0] === Infinity) {
    alert('No Coordinates');
		return;
	}
	map.getView().fit(extent, map.getSize());
	//Change scale if less than 1/500
	const scale = getScaleFromResolution(map, map.getView().getResolution());
	if(scale < 500) {
		const resolution = getResolutionFromScale(map, 500);
		map.getView().setResolution(resolution);
	}
};

/**
 * Zoom the map based on the input scale and center coordinate
 * 
 * @param {ol/Map} map The map on where the zoom will be performed
 * @param {number} scale The scale
 * @param {number} x The x coordinate for the center
 * @param {number} y The y coordinate for the center
 */
export const zoomCenter = (map, scale, x, y) => {
	const resolution = getResolutionFromScale(map, scale);
	map.getView().setCenter([x, y]);
	map.getView().setResolution(resolution);
};



/**
 * Zoom the map based on the layer extent.
 * 
 * @param {ol.Map} map The map to be zoomed
 * @param {ol.layer.Base} layer The layer
 */
export const zoomToLayer = (map, layer) => {
  if(layer.getSource().getFeatures().length > 0 ) {
		const extent = layer.getSource().getExtent();
		zoomToExtent(map, extent);
	}
};

/**
 * Zoom the map based on the features extent.
 * 
 * @param {ol.Map} map The map to be zoomed
 * @param {ol.Feature[]} features The array of features 
 */
export const ZoomToFeatures = (map, features) => {
  if(features.length > 0) {
    const newSource = new VectorSource();
    newSource.addFeatures(features);
    const extent = newSource.getExtent();
    zoomToExtent(map, extent);
  }
};

/**
 * Method to retrieve all the leaf layers from
 * the input array of layers.
 * 
 * @param {[ol.layer.Base]} lyrs Collection of layers
 *  to extract leaf layers from
 */
export const getLeafVisibleLayers = (lyrs) => {
	let  leafLyrs = [];
	lyrs.forEach(function(lyr) {
		if(lyr instanceof OlLayerGroup) {
			leafLyrs = leafLyrs.concat(getLeafVisibleLayers(lyr.getLayers()));
		}
		else {
			if(lyr.get('visible')) {
				leafLyrs.push(lyr);
			}
		}
	});
	return leafLyrs;
}

/**
 * Utility Method to convert to string the coordinate.
 * @param {*} srcCoordinate The source coordinate
 * @param {*} srcProjCode The source projection code
 * @param {*} destProjCode The destination projection code
 * @return {[number, number]} The calculated destination coordinate.
 */
export const coordinateToString = (srcCoordinate, srcProjCode, destProjCode) => {
  const stringifyFunc = createStringXY(8);
  const destCoordinate = transform(srcCoordinate, srcProjCode, destProjCode);
  //retrieve destinatin projection/axisOrientation
  const destProj = getProjection(destProjCode);
  const destAxisOrientation = destProj.getAxisOrientation();

  if(destAxisOrientation === 'neu') {
      destCoordinate.reverse();
  }

  const destCoordinateString = stringifyFunc(destCoordinate);

  return destCoordinateString;
};

/**
 * 
 * @param {string} strCoordinate The coordinate string in the format 'x, y' or 'y,x'
 * @param {string} projCode The projection code
 * @return {Array} the coordinate represented by an array with 2 floats x, y
 */
export const stringToCoordinate = (strCoordinate, projCode) => {
  const proj = getProjection(projCode);
  let coordinate = undefined;
  //parse x and y values from input
  if(strCoordinate && strCoordinate.split(',').length === 2) {
    coordinate = strCoordinate.split(',').map((item) => {
        return parseFloat(item.trim());
    });
    if(proj.getAxisOrientation() === 'neu') {
        coordinate.reverse();
    }
  }
  return coordinate;
}


export const getCoordinateLabel = (projCode) => {
  const proj = getProjection(projCode);
  let [XLabel, YLabel] = ['X', 'Y'];

  const units = proj.getUnits();
  if(units === 'degrees') {
      [XLabel, YLabel] = ['LONG', 'LAT'];
  }

  const axisOrientation = proj.getAxisOrientation();
  if (axisOrientation === 'neu') {
      [XLabel, YLabel] = [YLabel, XLabel];
  }

  const strLabel = `${XLabel}, ${YLabel} (${units})`;
  return strLabel;
}

