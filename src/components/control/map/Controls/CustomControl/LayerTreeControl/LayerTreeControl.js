import { useMemo } from 'react';
import CustomControl from '../CustomControl';
import LayerTree from '../../../../../tree/layer/LayerTree/LayerTree';
import {Button, Popover, Tooltip} from 'antd';
import {ProfileOutlined  } from '@ant-design/icons';
import './LayerTreeControl.css';
const LayerTreeControl = ({
    map,
    icon = <ProfileOutlined/>,
    shape = null,
    popOverProps = null,
    layerTreeProps = null,
    tooltipProps = null,
    children,
    ...otherProps
}) => {

    const options = useMemo(() => {
        return({
            target: undefined,
            className: 'rolext-layer-tree-control'
        });
    }, []);

    return (
        <CustomControl map={map} options={options}>
            <Popover title="Layers"
                     trigger="click"
                     placement="bottom"
                     content={<LayerTree map={map} {...layerTreeProps}/>}
                     {...popOverProps}
            >
                <Tooltip title="Layer Tree" placement="top" mouseLeaveDelay={0.05} {...tooltipProps}>
                <Button type="primary" 
                    style={{position:'absolute'}}
                    icon= {icon}
                    shape={shape}
                    {...otherProps}
                >
                    {children}
                </Button>
                </Tooltip>
            </Popover>
        </CustomControl>
    );
};

export default LayerTreeControl;