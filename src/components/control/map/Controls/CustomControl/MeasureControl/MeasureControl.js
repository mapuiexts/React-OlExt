import {useMemo} from 'react';
import {Dropdown, Tooltip, Button} from 'antd';
import {ColumnWidthOutlined} from '@ant-design/icons';
import CustomControl from '../CustomControl';
import { GetDistanceButton } from '../../../../../../main';
import './MeasureControl.css';

/**
 * Control to get the measure (distance, area, ...etc)
 * @visibleName Measure Control
 */
const MeasureControl = ({
    map,
    icon= <ColumnWidthOutlined/>,
    dropDownProps = null,
    tooltipProps = null,
    ...otherProps
}) => {

    const options = useMemo(() => {
        return({
            target: undefined,
            className: 'rolext-measure-control'
        });
    }, []);

    const menuProps = useMemo(() => {
        return({
            items: [
                {
                    key: 'GET_DISTANCE',
                    label: <GetDistanceButton type='text' size="small" map={map} showTooltip={false}>
                            Get Distance
                           </GetDistanceButton>
                }
            ]
        });
    }, [map]);

    return (
        <CustomControl map={map} options={options}>
            <Dropdown trigger="click" 
                      placement="bottomLeft"
                      menu={menuProps}
                      {...dropDownProps}
            >
                <Tooltip title="Measure" placement="top" mouseLeaveDelay={0.05} {...tooltipProps}>
                    <Button type="primary" icon= {icon} {...otherProps}/>
                </Tooltip>
            </Dropdown>  
        </CustomControl>
    );
};

export default MeasureControl;