import React, {useCallback, useState} from 'react';
import { Space, Button, Input, Select, Switch } from 'antd';
import {equalTo, notEqualTo, like, isNull, greaterThan, greaterThanOrEqualTo, 
    lessThan, lessThanOrEqualTo, not, between
} from 'ol/format/filter';


import useWFSGetFeature from '../../../../../hooks/wfs/useWFSGetFeature';
import usePrevious from '../../../../../hooks/common/usePrevious';

const WfsSearchByPropertyMenuBar = ({
    url,
    layer,
    map,
    wfsOptions,
    columnDefs,
    direction="horizontal"
}) => {
    const [internalColumnDefs, setInternalColumnDefs] = useState(columnDefs);
    const [propertyName, setPropertyName] = useState("");
    const [propertyValue, setPropertyValue] = useState("");
    const [propertyValue2, setPropertyValue2] = useState("");
    const [filterName, setFilterName] = useState("equal_to");
    const [hasNotfilter, setHasNotFilter] = useState(false);
    const [matchCase, setMatchCase] = useState(true);
    const wfsGetFeature = useWFSGetFeature();

    const previousColumnDef = usePrevious(columnDefs);
    if (columnDefs !== previousColumnDef && columnDefs !== internalColumnDefs) {
        setInternalColumnDefs(columnDefs);
        if(columnDefs.length > 0) {
            setPropertyName(columnDefs[0].field);
        }
    }

    const onSearchClickHandler = useCallback((event) => {
        if(!layer) return;
        layer.getSource().clear();
        let filter = null;
        switch(filterName) {
            case 'equal_to':
                filter = equalTo(propertyName, propertyValue, matchCase);
                break;
            case 'not_equal_to':
                filter = notEqualTo(propertyName, propertyValue, matchCase);
                break;
            case 'like':
                filter = like(propertyName, propertyValue, '*', '.', '!', matchCase);
                break;
            case 'is_null':
                filter = isNull(propertyName);
                break;
            case 'greater_than':
                filter = greaterThan(propertyName, propertyValue);
                break;
            case 'greater_than_or_equal_to':
                filter = greaterThanOrEqualTo(propertyName, propertyValue);
                break;
            case 'less_than':
                filter = lessThan(propertyName, propertyValue);
                break;
            case 'less_than_or_equal_to':
                filter = lessThanOrEqualTo(propertyName, propertyValue);
                break;
            case 'between':
                filter = between(propertyName, propertyValue, propertyValue2);
                break;
            default:
                filter = null;
        }
        if(hasNotfilter) {
            filter = not(filter);
        }

        const wfsFilteredOptions = {...wfsOptions, filter};
        wfsGetFeature.sendRequest(url, map, layer, wfsFilteredOptions);

    }, [wfsGetFeature, layer, url, wfsOptions, filterName, propertyName, propertyValue, matchCase, hasNotfilter, map, propertyValue2]);

    const onFilterNameChangeHandler = useCallback((value) => {
        setFilterName(value);
    },[]);

    const onHasNotFilterChangeHandler = useCallback((value) => {
        setHasNotFilter(value);
    },[]);

    const onMatchCaseChangeHandler = useCallback((value) => {
        setMatchCase(value);
    },[]);

    const onPropertyNameChangeHandler = useCallback((value) => {
        setPropertyName(value);
    },[]);

    const onPropertyValueChangeHandler = useCallback((value) => {
        setPropertyValue(value.target.value);
    },[]);

    const onPropertyValue2ChangeHandler = useCallback((value) => {
        setPropertyValue2(value.target.value);
    },[]);

    let matchCaseControl = null;
    if((filterName === 'equal_to') 
    || (filterName === 'not_equal_to') 
    || (filterName === 'like')) {
        matchCaseControl = (
            <Switch checkedChildren="Match Case" unCheckedChildren="NO Match Case" 
                    defaultChecked={matchCase} onChange={onMatchCaseChangeHandler} 
            />
        );
    }

    let betweenControl = null;
    if((filterName === 'between')) {
        betweenControl = (
            <Space>
                <b>AND</b>
                <Input placeholder="Property Value" onChange={onPropertyValue2ChangeHandler}
                    onPressEnter={onSearchClickHandler}
                />
            </Space>
        );
    }


    return (
        // <div style={{display:"flex",  flexDirection:'column', columnGap: 5, rowGap:5}}>
        <Space direction={direction} style={{display: 'flex', margin:5}}>
            <Button type="primary" loading={wfsGetFeature.isLoading} onClick={onSearchClickHandler}>Search</Button>
            <Select style={{ width: 200 }}  value = {propertyName} onChange={onPropertyNameChangeHandler}>
                {columnDefs.map((column, index) => {
                    return (
                        <Select.Option key={index} value={column.field}>{column.field}</Select.Option>
                    );
                })}
            </Select>
            <Switch checkedChildren="Not" defaultChecked={hasNotfilter} onChange={onHasNotFilterChangeHandler} />
            <Select defaultValue={filterName} style={{ width: 200 }} onChange={onFilterNameChangeHandler}>
                <Select.Option value="equal_to">Equal To</Select.Option>
                <Select.Option value="not_equal_to">Not Equal To</Select.Option>
                <Select.Option value="like">Like</Select.Option>
                <Select.Option value="is_null">Is Null</Select.Option>
                <Select.Option value="greater_than">Greater Than</Select.Option>
                <Select.Option value="greater_than_or_equal_to">Greater Than or Equal To</Select.Option>
                <Select.Option value="less_than">Less Than</Select.Option>
                <Select.Option value="less_than_or_equal_to">Less Than or Equal To</Select.Option>
                <Select.Option value="between">Between</Select.Option>
            </Select>
            <Input placeholder="Property Value" onChange={onPropertyValueChangeHandler}
                   onPressEnter={onSearchClickHandler}
            />
            {betweenControl}
            {matchCaseControl}
        </Space>
        // </div>

    );
};

export default WfsSearchByPropertyMenuBar;