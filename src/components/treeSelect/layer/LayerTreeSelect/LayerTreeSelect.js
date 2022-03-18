import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map as OlMap} from 'ol';
import BaseLayer from 'ol/layer/Base';
import OlGroupLayer from 'ol/layer/Group';
import {TreeSelect} from 'antd';

const defaultTitleFunc = layer => layer.get('name');

/**
 * TreeSelect component to allow the selection of a ol/layer Layer.
 * Additional properties not listed below can be used for this
 * component: See <u>https://ant.design/components/tree-select/</u> for 
 * more details.
 * 
 * @visibleName Layer TreeSelect
 */
const LayerTreeSelect = ({
    map,
    layerGroup = map.getLayerGroup(),
    filterFunc = undefined,
    titleFunc = defaultTitleFunc,
    style= {width: '100%' },
    dropdownStyle={ maxHeight: 400, overflow: 'auto' },
    value,
    defaultLayer,
    //defaultValue = defaultLayer ? defaultLayer.ol_uid.toString() : defaultLayer,
    defaultValue = defaultLayer ? 
                    Array.isArray(defaultLayer) ? 
                        defaultLayer.map(layer => layer.ol_uid.toString()) 
                        : defaultLayer.ol_uid.toString()
                    : undefined,
    placeholder = "Select Layer",
    treeDefaultExpandAll = true,
    onSelect,
    onSelectLayer,
    multiple,
    treeCheckable = false,
    ...otherProps

}) => {

    const [internalValue, setInternalValue] = useState(value ? value : defaultValue );

    if(!map.getLayerGroup().get('name')) {
        const rootLayerName = 'Layers';
        map.getLayerGroup().set('name', rootLayerName);
    }
    
    /**
     * Create the tree data from the input layer.
     */
    const treeDataFromLayer = useCallback((layer) => {
        let childrenTreeData =  [];

        // if (layer instanceof OlGroupLayer) {
        //     let childLayers = layer.getLayers().getArray()
        //     childLayers = filterFunc ? childLayers.filter(filterFunc) : childLayers;
        //     childrenTreeData = childLayers.map((childLayer) => {
        //         return treeDataFromLayer(childLayer);
        //     });
        //     childrenTreeData.reverse();
        // } 
        if (layer instanceof OlGroupLayer) {
            let childLayers = layer.getLayers().getArray()
            childLayers = filterFunc ? childLayers.filter(filterFunc) : childLayers;
            childrenTreeData = childLayers.map((childLayer) => {
                return treeDataFromLayer(childLayer);
            });
            childrenTreeData.reverse();
        } 
        //const key = layer.ol_uid.toString();
        const treeData = {
            //key:key,
            title: titleFunc(layer),
            value:layer.ol_uid.toString(),
            layer: layer,
            children: childrenTreeData
        };

        return treeData;
    }, [filterFunc, titleFunc]);

     /**
     * Creates TreeNodes from a given layergroup and sets the treeNodes in the state.
     * 
     * @param {ol.layer.Group} groupLayer A Layer Group
     */
    const treeDataFromLayerGroup = useCallback((groupLayer) => {
        const newTreeData = treeDataFromLayer(groupLayer);
        //newTreeData.children.reverse();
        setTreeData([newTreeData]);
    }, [treeDataFromLayer]);
    // const treeDataFromLayerGroup = useCallback((groupLayer) => {
    //     let layers = groupLayer.getLayers().getArray();
    //     layers = filterFunc ? layers.filter(filterFunc) : layers;
    //     const newTreeData = layers.map((layer) => treeDataFromLayer(layer));
    //     newTreeData.children.reverse();
    //     setTreeData(newTreeData);
    // }, [filterFunc, treeDataFromLayer]);

    const rebuildTreeData = useCallback(() => {
        treeDataFromLayerGroup(layerGroup);
    
    }, [layerGroup, treeDataFromLayerGroup]);

    /**
     * Event Handler to handle 'change:name' event
     * 
     */
    const onLayerChangeName = useCallback((evt) => {
        if(evt.target.get('name') !== evt.oldValue) {
            if(evt.oldValue === internalValue) {
                setInternalValue(evt.target.ol_uid.toString());
            }
            rebuildTreeData();
        }
    }, [rebuildTreeData, internalValue]);

    /**
     * Register the 'change:name' event handler for the layer.
     * if the layer is a group, the related children will have 
     * also the event handler registered.
     * 
     * @param {ol.layer.Base} layerOrGroup A corresponding layer or group
     */
    const registerOnLayerChangeName = useCallback((layerOrGroup) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        if(layerOrGroup instanceof OlGroupLayer) {
            //register layer group
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.on('change:name', onLayerChangeName);
            }
            //register childrens
            const layers = layerOrGroup.getLayers();
            layers.forEach((layer) => {
                if(filterFunction(layer)) {
                    registerOnLayerChangeName(layer);
                }
            });
        }
        else {
            //register leaf
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.on('change:name', onLayerChangeName);
            }
        }

    }, [filterFunc, onLayerChangeName]);


    /**
     * Unregister the 'change:name' event handler for the layer.
     * if the layer is a group, the related children will have 
     * also the event handler unregistered.
     * 
     * @param {ol.layer.Base} layerOrGroup A corresponding layer or group
     */
    const unRegisterOnLayerChangeName = useCallback((layerOrGroup) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        if(layerOrGroup instanceof OlGroupLayer) {
            //unregister layer group
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.un('change:name', onLayerChangeName);
            }
            //register childrens
            const layers = layerOrGroup.getLayers();
            layers.forEach((layer) => {
                if(filterFunction(layer)) {
                    unRegisterOnLayerChangeName(layer);
                }
            });
        }
        else {
            //register leaf
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.un('change:name', onLayerChangeName);
            }
        }

    }, [filterFunc, onLayerChangeName]);


    /**
     * Register recursivelly the event handlers add/remove/change
     * for all the group layers.
     * 
     * Pre-definition of registerCollectionHandlers to manage circular
     * dependencies. See re-definition below
     */

    let registerCollectionHandlers = null;

    /**
     * Unregister recursivelly the event handlers add/remove/change
     * for all the group layers.
     * 
     * Pre-definition of unRegisterCollectionHandlers to manage circular
     * dependencies. See re-definition below
     */
    let unRegisterCollectionHandlers = null;

    /**
     * Event handler called once a layer is added
     * to the collection.
     * 
     * This handler will register:
     * (a) the event handlers for add/remove/change in group layer
     * (b) the 'change:visible' event handler for the layer.
     */
    const onCollectionAdd = useCallback((evt) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        if(filterFunction(evt.element)) {
            if (evt.element instanceof OlGroupLayer) {
                registerCollectionHandlers && registerCollectionHandlers(evt.element);
            }
            registerOnLayerChangeName(evt.element);
        }
        rebuildTreeData();
    }, [registerCollectionHandlers, filterFunc, rebuildTreeData, registerOnLayerChangeName]);

    /**
     * Event handler called once a layer is removed
     * from the collection.
     * 
     * This handler will unregister:
     * (a) the event handlers for add/remove/change in group layer
     * (b) the 'change:visible' event handler for the layer.
     */
    const onCollectionRemove = useCallback((evt) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        if(filterFunction(evt.element)) {
            if (evt.element instanceof OlGroupLayer) {
                unRegisterCollectionHandlers && unRegisterCollectionHandlers(evt.element);
            }
            unRegisterOnLayerChangeName(evt.element);
        }
        rebuildTreeData();

    }, [filterFunc, rebuildTreeData, unRegisterCollectionHandlers, unRegisterOnLayerChangeName]);

    /**
     * Register recursivelly the event handlers add/remove/change
     * for all the group layers.
     * 
     * @param {ol.layer.Group} groupLayer 
     */
    registerCollectionHandlers = useCallback((groupLayer) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        const collection = groupLayer.getLayers();
        if(filterFunction(groupLayer)) {
            collection.on('add', onCollectionAdd);
            collection.on('remove', onCollectionRemove);
            //groupLayer.on('change:layers', onCollectionChangeLayers);
        }

        //register handler in all the child group layers
        collection.forEach((layer) => {
        if (layer instanceof OlGroupLayer) {
            registerCollectionHandlers(layer);
        }
    });

    }, [filterFunc, onCollectionAdd, onCollectionRemove, registerCollectionHandlers]);

    

    /**
     * Unregister recursivelly the event handlers add/remove/change
     * for all the group layers.
     * 
     * @param {ol.layer.Group} groupLayer 
     */
    unRegisterCollectionHandlers = useCallback((groupLayer) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        const collection = groupLayer.getLayers();
        if(filterFunction(groupLayer)) {
            collection.un('add', onCollectionAdd);
            collection.un('remove', onCollectionRemove);
            //groupLayer.un('change:layers', onCollectionChangeLayers);
        }

        //register handler in all the child group layers
        collection.forEach((layer) => {
        if (layer instanceof OlGroupLayer) {
            unRegisterCollectionHandlers(layer);
        }
    });

    }, [filterFunc, onCollectionAdd, onCollectionRemove, unRegisterCollectionHandlers]);


    const internalOnSelect = useCallback((value, node, extra) => {
        setInternalValue(node.layer.ol_uid.toString());
        onSelect && onSelect(value, node, extra);
        onSelectLayer && onSelectLayer(node.layer);
    }, [onSelect, onSelectLayer]);
    

    const [treeData, setTreeData] = useState([]);
    


    /**
     * Register 'change:name' for the group layer and all its
     * childrens
     */
    useEffect(() => {
        registerOnLayerChangeName(layerGroup);

        //clean-up:
        return () => unRegisterOnLayerChangeName(layerGroup);
    }, [layerGroup, registerOnLayerChangeName, unRegisterOnLayerChangeName]);


     /**
     * Register collection event handlers for the group layer and 
     * its child group layers 
     */
    useEffect(() => {
        registerCollectionHandlers(layerGroup);
        //clean-up:
        return () => unRegisterCollectionHandlers(layerGroup);
    }, [layerGroup, registerCollectionHandlers, unRegisterCollectionHandlers]);

      /**
     * rebuild the tree data
     */
    useEffect(() => {
        rebuildTreeData();
    }, [rebuildTreeData]);

    return (
        <TreeSelect
          style={style}
          value={internalValue}
          defaultValue = {defaultValue}
          dropdownStyle={dropdownStyle}
          treeData={treeData}
          placeholder= {placeholder}
          treeDefaultExpandAll = {treeDefaultExpandAll}
          onSelect={internalOnSelect}
          multiple={multiple}
          treeCheckable={treeCheckable}
          {...otherProps}
        />
    );

    
    

    // const treeDataFromLayer = useCallback((layer) => {
    //     let childNodes =  [];

    //     if (layer instanceof OlGroupLayer) {
    //         let childLayers = layer.getLayers().getArray()
    //         childLayers = filterFunc ? childLayers.filter(filterFunc) : childLayers;
    //         childNodes = childLayers.map((childLayer) => {
    //             return treeDataFromLayer(childLayer);
    //         });
    //         childNodes.reverse();
    //     } 
    //     const treeNode = (
    //         <TreeSelect.TreeNode 
    //             key={layer.ol_uid.toString()} 
    //             title={titleFunc ? titleFunc(layer) : layer.get('name')}
    //             ol_layer={layer}
    //         >
    //             {childNodes.length > 0 && childNodes}
    //         </TreeSelect.TreeNode>
    //     );
    //     //treeNode._ol_layer = layer;

    //     return treeNode;
    // }, [filterFunc, titleFunc]);

};

LayerTreeSelect.propTypes = {

    /**
     * The OpenLayers ol/Map having the layers to be shown
     * in the LayerTreeSelect.
     */
    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * The OpenLayers ol/layer/Group having the layers to be shown
     * in the LayerTreeSelect.
     * If not provided, all the layers from the <u>map</u> will
     * be shown.
     */
    layerGroup: PropTypes.instanceOf(OlGroupLayer),

    /**
     * Function to filter the layers to be shown in the LayerTreeSelect.
     * This function should have as parameter the layer and if it 
     * returns true, the layer will be shown; otherwise the layer
     * will not be included in the component. Check for the
     * javascript Array.filter function for additional parameters.
     * If not provided, all the layers present in the input
     * <u>layerGroup</u> will be shown.
     */
    filterFunc: PropTypes.func,

    /**
     * A function to change the title of the Layer to be shown
     * in the LayerTreeSelect. This function will receive as parameter
     * the layer and returns a string for the title. Some function
     * implementations should be, for example, to set the first 
     * letter of the layer name in uppercase and or to replace
     * "_" by a single space. This function will not change the layer
     * name and it will only affect how the layer name will be 
     * shown in the LayerTreeSelect.
     */
    titleFunc: PropTypes.func,

    /**
     * Function callback called once the user selects the layer in the tree.
     * This function will have as parameter the selected layer.
    */
    onSelectLayer: PropTypes.func,

    /**
     * The initial selected value(s)
     * @ignore
     */
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,  
        PropTypes.arrayOf(PropTypes.string)
    ]),

    /**
     * The initial selected layer(s)
     */
    defaultLayer: PropTypes.oneOfType([
        PropTypes.instanceOf(BaseLayer),
        PropTypes.arrayOf(PropTypes.instanceOf(BaseLayer))
    ]),

    /**
     * To set the CSS style of the dropdown menu.
     * 
     */
    dropdownStyle: PropTypes.object,

    /**
     * Placeholder of the tree select input
     */
    placeholder: PropTypes.string,

    /**
     * A CSS style of the tree select input.
     */
    style: PropTypes.object,

    /**
     * Whether to expand all treeNodes by default
     */
    treeDefaultExpandAll: PropTypes.bool,

    /**
     * Support multiple or not, will be true when enable treeCheckable
     */
    multiple: PropTypes.bool,

    /**
     * Whether to show checkbox on the treeNodes
     */
    treeCheckable: PropTypes.bool

}

export default LayerTreeSelect;