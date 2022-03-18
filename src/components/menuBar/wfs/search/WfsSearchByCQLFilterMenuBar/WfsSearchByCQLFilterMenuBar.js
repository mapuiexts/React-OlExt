import React, {useCallback, useState} from 'react';
import {Button, Space, Input} from 'antd';
import useWFSGetFeature from '../../../../../hooks/wfs/useWFSGetFeature';

const WfsSearchByCQLFilterMenuBar = ({
    url,
    layer,
    map,
    wfsOptions
}) => {

    const [filterValue, setFilterValue] = useState("");
    const wfsGetFeature = useWFSGetFeature();

    const onFilterValueHandler = useCallback((value) => {
        setFilterValue(value.target.value);
    },[]);

    const onSearchClickHandler = useCallback((event) => {
        if(!layer) return;
        layer.getSource().clear();
        
        const wfsFilteredOptions = {...wfsOptions, cql_filter:filterValue};
        wfsGetFeature.sendRequest(url, map, layer, wfsFilteredOptions);

    }, [layer, filterValue, wfsOptions, wfsGetFeature, map, url]);

    return (
        <Space>
            <Button type="primary" 
                    loading={wfsGetFeature.isLoading} 
                    onClick={onSearchClickHandler}
            >
                Search by CQL
            </Button>
            <Input placeholder="CQL Filter" onChange={onFilterValueHandler}
                   onPressEnter={onSearchClickHandler} style={{width: 800}}
            />
        </Space>
    );
};

export default WfsSearchByCQLFilterMenuBar;