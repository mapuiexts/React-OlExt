import {useMemo} from 'react';
import {Dropdown, Tooltip, Button} from 'antd';
import {ColumnWidthOutlined} from '@ant-design/icons';
import CustomControl from '../CustomControl';
import MeasureMenu from '../../../../../menu/measure/MeasureMenu/MeasureMenu';
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

    return (
        <CustomControl map={map} options={options}>
            <Dropdown trigger="click" 
                      placement="bottomLeft"
                      overlay={<MeasureMenu map={map}/>}
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