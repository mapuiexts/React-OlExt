import React, {useState} from 'react';
import { Space, Dropdown, Button, Radio, Divider, Menu } from 'antd';
import WfsSearchByPropertyMenuBar from '../WfsSearchByPropertyMenuBar/WfsSearchByPropertyMenuBar';
import WfsSearchByPointMenuBar from '../WfsSearchByPointMenuBar/WfsSearchByPointMenuBar';
import WfsSearchByBBoxMenuBar from '../WfsSearchByBBoxMenuBar/WfsSearchByBBoxMenuBar';
import WfsSearchByPolygonMenuBar from '../WfsSearchByPolygonMenuBar/WfsSearchByPolygonMenuBar';
import WfsSearchByCQLFilterMenuBar from '../WfsSearchByCQLFilterMenuBar/WfsSearchByCQLFilterMenuBar';

const WfsSearchMenuBar = ({
    map,
    layer,
    url,
    wfsOptions,
    columnDefs
}) => {

    const [searchType, setSearchType] = useState(1);
   

    const onChangeSearchType = (e) => {
        setSearchType(e.target.value);
    };

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '50px',
    };

    let childSearchPanel = null;
        switch(searchType) {
            case 1:
                childSearchPanel = (
                    <WfsSearchByPropertyMenuBar url={url} map={map} layer={layer} 
                                              wfsOptions={wfsOptions} columnDefs={columnDefs}
                    />
                );
                break;
            case 2:
                childSearchPanel = (
                    <WfsSearchByPointMenuBar url={url} map={map} layer={layer} 
                                           wfsOptions={wfsOptions}
                    />
                );
                break;
            case 3:
                childSearchPanel = (
                    <WfsSearchByBBoxMenuBar url={url} map={map} layer={layer} 
                                          wfsOptions={wfsOptions}
                    />
                );
                break;
            case 4:
                childSearchPanel = (
                    <WfsSearchByPolygonMenuBar url={url} map={map} layer={layer} 
                                           wfsOptions={wfsOptions}
                    />
                );
                break;
            case 5:
                childSearchPanel = (
                    <WfsSearchByCQLFilterMenuBar url={url} map={map} layer={layer} 
                                           wfsOptions={wfsOptions}
                    />
                );
                break;
            case 6:
                childSearchPanel = null;
                break;
            default:
                childSearchPanel = null;
        }

    const searchMenu = (
        <Menu>
            <Menu.Item>
                <Radio.Group onChange={onChangeSearchType} value={searchType}>
                    <Radio style={radioStyle} value={1}>
                        By Property
                    </Radio>
                    <Radio style={radioStyle} value={2}>
                        By Point
                    </Radio>
                    <Radio style={radioStyle} value={3}>
                        By BBox
                    </Radio>
                    <Radio style={radioStyle} value={4}>
                        By Polygon
                    </Radio>
                    <Radio style={radioStyle} value={5} disabled>
                        By CQL
                    </Radio>
                </Radio.Group>
            </Menu.Item>
        </Menu>
    );


    return(
        <Space>
            <Dropdown overlay={searchMenu} placement="bottomLeft">
                <Button>Search Type</Button>
            </Dropdown>
            <Divider type="vertical" />
            {childSearchPanel}
            {/* <WfsSearchByPropertyMenuBar url={url} map={map} layer={layer} wfsOptions={wfsOptions} columnDefs={columnDefs}/> */}
        </Space>
    );

};

export default WfsSearchMenuBar;