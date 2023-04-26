import React, {useState, useMemo} from 'react';
import {Dropdown, Button, Radio, Divider} from 'antd';
import MenuBar from '../../../common/MenuBar/MenuBar';
import WfsSearchByPropertyMenuBar from '../WfsSearchByPropertyMenuBar/WfsSearchByPropertyMenuBar';
import WfsSearchByPointMenuBar from '../WfsSearchByPointMenuBar/WfsSearchByPointMenuBar';
import WfsSearchByBBoxMenuBar from '../WfsSearchByBBoxMenuBar/WfsSearchByBBoxMenuBar';
import WfsSearchByPolygonMenuBar from '../WfsSearchByPolygonMenuBar/WfsSearchByPolygonMenuBar';
import WfsSearchByCQLFilterMenuBar from '../WfsSearchByCQLFilterMenuBar/WfsSearchByCQLFilterMenuBar';
import useWindowSize from '../../../../../hooks/ui/useWindowSize';
import {convertRemToPixels} from '../../../../../core/deviceUnits';

const WfsSearchMenuBar = ({
    map,
    layer,
    url,
    wfsOptions,
    columnDefs,
    breakpoint=convertRemToPixels(75),
    title="Search"
}) => {

    const [searchType, setSearchType] = useState(1);
    const { width } = useWindowSize();
    //const direction = width > breakpoint  ?
   

    const onChangeSearchType = (e) => {
        setSearchType(e.target.value);
    };

    

    let childSearchPanel = null;
        switch(searchType) {
            case 1:
                childSearchPanel = (
                    <WfsSearchByPropertyMenuBar url={url} map={map} layer={layer} 
                                                direction={width > breakpoint ? "horizontal" : "vertical"}
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

    

    const searchMenuProps = useMemo(() => {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '50px',
        };
        return({
            items: [
                {
                    key: '1',
                    label:  <Radio.Group onChange={onChangeSearchType} value={searchType}>
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
                },
            ]
        });
    }, [searchType]);

    return(
        // <Space>
        <MenuBar breakpoint={breakpoint} title={title}>
            <Dropdown menu={searchMenuProps} placement="bottomLeft">
                <Button>Search Type</Button>
            </Dropdown>
            <Divider type="vertical" />
            {childSearchPanel}
        </MenuBar>
        // </Space>
    );

};

export default WfsSearchMenuBar;