import React, {useState, useEffect, useCallback} from 'react';
import {Map as OlMap} from 'ol';
import PropTypes from 'prop-types';
import {Tree} from 'antd';
import OlLayerGroup from 'ol/layer/Group';
import TreeLayerContextMenu from '../../../contextMenu/TreeLayerContextMenu/TreeLayerContextMenu';
import {getAllLayers, getLayerPositionInfo} from '../../../../util/map';
import useTreeContextMenu from '../../../../hooks/ui/useTreeContextMenu';

/**
 * <p>Tree to show the layers in a layer group. This component
 * presents several functionalities:</p>
 * <ol>
 * <li>The user will be able to switch the layer visibility to on/off
 * using the checkbox control.</li>
 * <li>Re-order the layers using the drag/drop functionality.</li>
 * <li>If the user right click the mouse in a layer node, a context
 * menu will be shown to provide several possibilities to 
 * interact with layer (create a  new layer, edit, remove, etc...)</li>
 * </ol>
 * @visibleName Layer Tree
 */
const LayerTree = ({
        map,
        layerGroup = map.getLayerGroup(),
        //className = null,
        draggable = true,
        checkable = true,
        onExpand = false,
        filterFunc = null,
        titleFunc = null
    }) => {
    
    const [treeNodes, setTreeNodes] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    //const [rightClickedNode, setRightClickedNode] = useState(null);
    //const [showMenuContext, setShowMenuContext] = useState(false);

    const { xPos, yPos, showMenu, rightClickedNode, onRightClickNode} = useTreeContextMenu();
    let rootLayerName = null;
    if(!map.getLayerGroup().get('name')) {
        rootLayerName = 'Layers';
        map.getLayerGroup().set('name', rootLayerName);
    }
    else {
        rootLayerName = map.getLayerGroup().get('name');
    }
    
   
    /*
    const onRightClickNode = useCallback((event) => {
        setRightClickedNode(event.node);
        setShowMenuContext(true);
    }, []);
    */

    /*
    const onFinishMenuContext = useCallback(() => {
        setShowMenuContext(false);
        setRightClickedNode(null);
    }, []);
    */

  /**
   * Get the flat array of ol_uids from visible non groupLayers.
   *
   * @return The visible ol_uids.
   */
    const getVisibleOlUids = useCallback(() => {
        let layers = getAllLayers(layerGroup, (layer) => {
            return !(layer instanceof OlLayerGroup) && layer.getVisible();
        });
        layers = filterFunc ? layers.filter(filterFunc) : layers;
        return layers.map(l => l.ol_uid.toString());
    }, [filterFunc, layerGroup]);
    

    /**
     * Creates a treeNode for the input layer.
     * 
     * @param {ol.layer.Base} layer 
     * @return The corresponding LayerTreeNode element.
     */
    const treeNodeFromLayer = useCallback((layer) => {
        let childNodes =  [];

        if (layer instanceof OlLayerGroup) {
            let childLayers = layer.getLayers().getArray()
            childLayers = filterFunc ? childLayers.filter(filterFunc) : childLayers;
            childNodes = childLayers.map((childLayer) => {
                return treeNodeFromLayer(childLayer);
            });
            childNodes.reverse();
        } 
        const treeNode = (
            <Tree.TreeNode 
                key={layer.ol_uid.toString()} 
                title={titleFunc ? titleFunc(layer) : layer.get('name')}
                ol_layer={layer}
            >
                {childNodes.length > 0 && childNodes}
            </Tree.TreeNode>
        );
        //treeNode._ol_layer = layer;

        return treeNode;
    }, [filterFunc, titleFunc]);
    
    /**
     * Creates TreeNodes from a given layergroup and sets the treeNodes in the state.
     * 
     * @param {ol.layer.Group} groupLayer A Layer Group
     */
    const treeNodesFromLayerGroup = useCallback((groupLayer) => {
        let layers = groupLayer.getLayers().getArray();
        layers = filterFunc ? layers.filter(filterFunc) : layers;
        const newTreeNodes = layers.map((layer) => treeNodeFromLayer(layer));
        newTreeNodes.reverse();
        setTreeNodes(newTreeNodes);
    }, [filterFunc, treeNodeFromLayer]);

    /**
     * 
     * @param {ol.MapEvent} evt 
     */
    const rebuildTreeNodes = useCallback((evt) => {
        treeNodesFromLayerGroup(layerGroup);
        setCheckedKeys(getVisibleOlUids());
    }, [layerGroup, getVisibleOlUids, treeNodesFromLayerGroup]);

    /**
     * Event Handler to handle 'change:name' event
     * 
     */
    const onLayerChangeName = useCallback((evt) => {
        if(evt.target.get('name') !== evt.oldValue) {
            rebuildTreeNodes();
        }
    }, [rebuildTreeNodes]);

    /**
     * Register the 'change:name' event handler for the layer.
     * if the layer is a group, the related children will have 
     * also the event handler registered.
     * 
     * @param {ol.layer.Base} layerOrGroup A corresponding layer or group
     */
    const registerOnLayerChangeName = useCallback((layerOrGroup) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        if(layerOrGroup instanceof OlLayerGroup) {
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
        if(layerOrGroup instanceof OlLayerGroup) {
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
      * Event handler to react to 'change:visible' event
      * 
      * @param {*} evt 
      */
     const onLayerChangeVisible = useCallback((evt) => {
        const newCheckedKeys = getVisibleOlUids();
        setCheckedKeys(newCheckedKeys);
        rebuildTreeNodes();
    }, [getVisibleOlUids, rebuildTreeNodes]);

    /**
     * Register the 'change:visible' event handler for the layer.
     * if the layer is a group, the related children will have 
     * also the event handler registered.
     * 
     * @param {ol.layer.Base} layerOrGroup A corresponding layer or group
     */
    const registerOnLayerChangeVisible = useCallback((layerOrGroup) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        if(layerOrGroup instanceof OlLayerGroup) {
            //register layer group
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.on('change:visible', onLayerChangeVisible);
            }
            //register childrens
            const layers = layerOrGroup.getLayers();
            layers.forEach((layer) => {
                if(filterFunction(layer)) {
                    registerOnLayerChangeVisible(layer);
                }
            });
        }
        else {
            //register leaf
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.on('change:visible', onLayerChangeVisible);
            }
        }

    }, [filterFunc, onLayerChangeVisible]);

    /**
     * Unregister the 'change:visible' event handler for the layer.
     * if the layer is a group, the related children will have 
     * also the event handler unregistered.
     * 
     * @param {ol.layer.Base} layerOrGroup A corresponding layer or group
     */
    const unRegisterOnLayerChangeVisible = useCallback((layerOrGroup) => {
        const filterFunction = filterFunc ? filterFunc : () => true;
        if(layerOrGroup instanceof OlLayerGroup) {
            //unregister layer group
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.un('change:visible', onLayerChangeVisible);
            }
            //register childrens
            const layers = layerOrGroup.getLayers();
            layers.forEach((layer) => {
                if(filterFunction(layer)) {
                    unRegisterOnLayerChangeVisible(layer);
                }
            });
        }
        else {
            //register leaf
            if(filterFunction(layerOrGroup)) {
                layerOrGroup.un('change:visible', onLayerChangeVisible);
            }
        }

    }, [filterFunc, onLayerChangeVisible]);

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
            if (evt.element instanceof OlLayerGroup) {
                registerCollectionHandlers && registerCollectionHandlers(evt.element);
            }
            registerOnLayerChangeVisible(evt.element);
            registerOnLayerChangeName(evt.element);
        }
        rebuildTreeNodes();
    }, [registerCollectionHandlers, registerOnLayerChangeVisible, 
        registerOnLayerChangeName, filterFunc, rebuildTreeNodes]);

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
            if (evt.element instanceof OlLayerGroup) {
                unRegisterCollectionHandlers && unRegisterCollectionHandlers(evt.element);
            }
            unRegisterOnLayerChangeVisible(evt.element);
            unRegisterOnLayerChangeName(evt.element);
        }
        rebuildTreeNodes();

    }, [unRegisterCollectionHandlers, unRegisterOnLayerChangeVisible, 
        filterFunc, rebuildTreeNodes, unRegisterOnLayerChangeName]);

    const onCollectionChangeLayers = useCallback((evt) => {
        //const filterFunc = filterFunc ? filterFunc : () => true;
        //TODO: Needed to handle???
    }, []);


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
            groupLayer.on('change:layers', onCollectionChangeLayers);
        }

        //register handler in all the child group layers
        collection.forEach((layer) => {
        if (layer instanceof OlLayerGroup) {
            registerCollectionHandlers(layer);
        }
    });

    }, [filterFunc, onCollectionAdd, onCollectionRemove, onCollectionChangeLayers, registerCollectionHandlers]);

    

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
            groupLayer.un('change:layers', onCollectionChangeLayers);
        }

        //register handler in all the child group layers
        collection.forEach((layer) => {
        if (layer instanceof OlLayerGroup) {
            unRegisterCollectionHandlers(layer);
        }
    });

    }, [filterFunc, onCollectionAdd, onCollectionRemove, onCollectionChangeLayers, unRegisterCollectionHandlers]);

    

    /**
     * Sets the layer visibility. Calls itself
     * recursively for group layers.
     * 
     * @param {ol.layer.Base} layer 
     * @param {boolean} visibility 
     */
    const setLayerVisibility = useCallback((layer, visibility) => {
        if (layer instanceof OlLayerGroup) {
          layer.getLayers().forEach((subLayer) => {
            setLayerVisibility(subLayer, visibility);
          });
        } 
        else {
            if (layer) {
                layer.setVisible(visibility);
            }
        }
    }, []);

    /**
     * Callback Method to be called once the check box is
     * checked in the tree view.
     * @param {Array(string)} checkedKeys 
     * @param {{checked:bool}} e 
     */
    const onCheck = useCallback((checkedKeys,  e) => {
        const { checked } = e;
        //const key = e.node.key;
        //const layer = getLayerByOlUid(map, key);
        const layer = e.node.ol_layer;
    
        setLayerVisibility(layer, checked);
    }, [setLayerVisibility]);

    /**
     * The callback method for the drop event in the tree view.
     * As result, the corresponding layers will be re-ordered in the 
     * map and in the tree.
     * 
     * @param e The ant-d tree event object for this event. See ant-d docs
     */
    const onDrop = useCallback((e) => {
        //const dragLayer = getLayerByOlUid(map, e.dragNode.key);
        const dragLayer = e.dragNode.ol_layer;
        const dragInfo = getLayerPositionInfo(dragLayer, map);
        const dragCollection = dragInfo.groupLayer.getLayers();

        const dropLayer = e.node.ol_layer;
        const dropPos = e.node.pos.split('-');
        const location = e.dropPosition - Number(dropPos[dropPos.length - 1]);
    
        dragCollection.remove(dragLayer);
    
        const dropInfo = getLayerPositionInfo(dropLayer, map);
        const dropPosition = dropInfo.position;
        const dropCollection = dropInfo.groupLayer.getLayers();
    
        // drop before node
        if (location === -1) {
          if (dropPosition === dropCollection.getLength() - 1) {
            dropCollection.push(dragLayer);
          } else {
            dropCollection.insertAt(dropPosition + 1, dragLayer);
          }
          // drop on node
        } else if (location === 0) {
          if (dropLayer instanceof OlLayerGroup) {
            dropLayer.getLayers().push(dragLayer);
          } else {
            dropCollection.insertAt(dropPosition + 1, dragLayer);
          }
          // drop after node
        } else if (location === 1) {
          dropCollection.insertAt(dropPosition, dragLayer);
        }
    
        rebuildTreeNodes();
      }, [map, rebuildTreeNodes]);

      /**
       * The callback method to be called after the tree
       * is expanded.
       * This method will call rebuildTreeNodes to avoid
       * sync issues.
       * 
       * @param {string[]} expandedKeys The expanded keys
       * @param {Object} info The info about the expanded keys.
       *                      check ant-d doc for more details
       */
      const onExpandTree = useCallback((expandedKeys, info) => {
        rebuildTreeNodes();
    
        if (onExpand) {
          onExpandTree(expandedKeys, info);
        }
      }, [onExpand, rebuildTreeNodes]);


    /**
     * Register 'change:visible' for the group layer and all its
     * childrens
     */
    useEffect(() => {
        registerOnLayerChangeVisible(layerGroup);

        //clean-up:
        return () => unRegisterOnLayerChangeVisible(layerGroup);
    }, [layerGroup, registerOnLayerChangeVisible, unRegisterOnLayerChangeVisible]);

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
     * rebuild the tree nodes
     */
    useEffect(() => {
        rebuildTreeNodes();
    }, [rebuildTreeNodes]);
    

    return(
        <React.Fragment>
            <Tree 
                checkedKeys={checkedKeys} 
                draggable = {draggable}
                checkable = {checkable}
                //showLine
                onCheck={onCheck}
                onDrop={onDrop}
                onExpand={onExpandTree}
                onRightClick={onRightClickNode}
            >
                <Tree.TreeNode key="root" title={rootLayerName} ol_layer={map.getLayerGroup()}>
                    {treeNodes}
                </Tree.TreeNode>
            </Tree>
            {/* { showMenu && */}
                <TreeLayerContextMenu 
                    map={map}
                    node={rightClickedNode}
                    xPos={xPos}
                    yPos={yPos}
                    showMenu={showMenu}
                />
            {/* } */}
        </React.Fragment>
    );

};

LayerTree.propTypes = {

    /**
     * The OpenLayers ol/Map having the layers to be shown
     * in the TreeLayer.
     */
    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * The OpenLayers ol/layer/Group having the layers to be shown
     * in the TreeLayer.
     * If not provided, all the layers from the <u>map</u> will
     * be shown.
     */
    layerGroup: PropTypes.instanceOf(OlLayerGroup),

    /**
     * If true, the user can re-order the layers through the
     * drag/drop in the LayerTree.
     */
    draggable: PropTypes.bool,

    /**
     * If true, the user will be able to switch the layer visibility
     * on/off for the layer using the check-box control in the TreeLayer.
     */
    checkable: PropTypes.bool,

    /**
     * Function to filter the layers to be shown in the TreeLayer.
     * This function should have as parameter the layer and if it 
     * returns true, the layer will be shown; otherwise the layer
     * will not be included in the TreeLayer. Check for the
     * javascript Array.filter function for additional parameters.
     * If not provided, all the layers present in the 
     * <u>layerGroup</u> will be shown.
     */
    filterFunc: PropTypes.func,

    /**
     * A function to change the title of the Layer to be shown
     * in the TreeLayer. This function will receive as parameter
     * the layer and returns a string for the title. Some function
     * implementations should be, for example, to set the first 
     * letter of the layer name in uppercase and or to replace
     * "_" by a single space. This function will not change the layer
     * name and it will only affect how the layer name will be 
     * shown in the TreeLayer.
     */
    titleFunc: PropTypes.func
};

export default LayerTree;