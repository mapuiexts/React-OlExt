import {useCallback, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import Panel from '../../../panel/Panel/Panel';
import {Divider, Space, Button} from 'antd';
import './Window.css';

/**
 * 
 * The Window Component
 */
const Window = ({
    expanded = true,
    collapsible = true,
    expandDir, 
    preTools = undefined,
    postTools = undefined, 
    style = {}, 
    title = 'My Window',
    onOk = undefined,
    onCancel = undefined,
    onClose = undefined,
    visible = false,
    ...otherProps
}) => {
    //if(!visible) return null;
    const [bounds, setBounds] = useState(null);
    const [dragDisabled, setDragDisabled] = useState(true);
    const draggleRef = useRef(null);

   

    const onStart = useCallback((event, uiData) => {
        const { clientWidth, clientHeight } = window?.document?.documentElement;
        const targetRect = draggleRef?.current?.getBoundingClientRect();
        setBounds({
            left: -targetRect?.left + uiData?.x,
            right: clientWidth - (targetRect?.right - uiData?.x),
            top: -targetRect?.top + uiData?.y,
            bottom: clientHeight - (targetRect?.bottom - uiData?.y),
            //bottom: 1.15*clientHeight - (targetRect?.bottom - uiData?.y),
          },);
    },[]);

    /**
     * Handler to enable dragging if the mouse is 
     * over the Title Bar.
     */
    const onTitleMouseOver = useCallback(() => {
        setDragDisabled(false);
    }, []);

    /**
     * Handler to disable dragging if the mouse is 
     * out of the Title Bar.
     */
    const onTitleMouseOut = useCallback(() => {
        setDragDisabled(true);
    }, []);
    

    return (
        visible &&
        <div className="rolext-wnd">
            
            <Draggable
                nodeRef={draggleRef}
                disabled={dragDisabled}
                bounds={bounds}
                onStart={onStart}
            >
            <div ref={draggleRef}>
            {/* <ResizableBox> */}
                <Space>
                    <Panel
                        title={title}
                        expanded={expanded}
                        collapsible
                        style={style}
                        preTools={preTools}
                        postTools={postTools}
                        expandDir={expandDir}
                        onTitleMouseOver={onTitleMouseOver}
                        onTitleMouseOut={onTitleMouseOut}
                        titleStyle={{ width: '100%', cursor: 'move'}}
                        onClose={onClose}
                    >
                        {otherProps.children}
                        <Divider style={{margin:"5px"}}/>
                        {(onOk || onCancel) &&
                            <div className="rolext-wnd-btn-container">
                                {onOk && <Button type="primary" onClick={onOk}>OK</Button>}
                                {onCancel && <Button type="primary" onClick={onCancel}>Cancel</Button>}
                            </div>
                        }
                    </Panel>
                    
                </Space>
            {/* </ResizableBox>   */}
            </div>
            </Draggable>
        </div>
    );
};

Window.propTypes = {

    /**
     * Set to true by default. 
     * Passing expanded as false will show the 
     * window panel collapsed.
     */
    expanded:PropTypes.bool,

    /**
     * If true, the window titlebar will display 
     * a collapse/expand control to collapse/expand the window panel.
     */
    collapsible:PropTypes.bool,

    /**
     * Not used currently.
     * To be used in the future to allow to expand in a horizontal
     * direction.
     * @ignore
     */
    expandDir: PropTypes.string,

    /**
     * Arbitrary tools, any element or React component you’d like, 
     * to be shown in the titlebar before the collapse/expand control.
     */
    preTools: PropTypes.node,

    /**
     * Arbitrary tools, any element or React component you’d like, 
     * to be shown in the titlebar, after the close control.
     */
    postTools: PropTypes.node,

    /**
     * A CSS Style to render the Window
     */
    style:PropTypes.object,

    /**
     * a title to be shown in the Window titlebar
     */
    title: PropTypes.node.isRequired,

    /**
     * A callback function to be called once the
     * user clicks in the <i>OK</i> button.
     * If null, the <i>OK</i> button will not be 
     * shown.
     */
     onOk: PropTypes.func,

     /**
     * A callback function to be called once the
     * user clicks in the <i>Cancel</i> button.
     * If null, the <i>Cancel</i> button will not be 
     * shown.
     */
      onCancel: PropTypes.func,

     /**
     * A callback function to be called once the
     * user clicks in the close control.
     * If null, the close control will not be 
     * shown.
     */
    onClose: PropTypes.func


};

export default Window;