import React, { useMemo } from 'react';
import {Tabs} from 'antd';
import {Form, Button, Space} from 'antd';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';


const layout = {
    labelAlign: 'left',
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 10,
        span: 3,
    },
};

const defaultTabs = [
    {
        title: "General",
        key: "general",
        isDefault: true,
        el: GeneralTab
    }
];

/**
 * A basic Form to create a new Layer ol/layer/Base Layer.
 */
const NewLayerForm = ({
    layerOpts,
    onFinish,
    onFinishFailed,
    tabs = defaultTabs,
    ...otherProps
}) => {
    const [form] = Form.useForm();
    const tabItems = useMemo(() => {
        const items = tabs.map((tab) => {
            const Item = tab.el;
            return({
                key: tab.key,
                label: tab.title,
                forceRender: true,
                children: <Item mode="new"/>
            });
        });
        return items;
    }, [tabs]);


    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue(layerOpts);
    };

    //get first key as the default active key for the tab
    let defaultActiveKey = tabs[0].key;
    tabs.forEach((tab) => {
        if(tab.isDefault === true) {
            defaultActiveKey = tab.key;
        }
    });

    return(
        <Form 
            {...otherProps}
            {...layout} 
            //layout="vertical"
            form={form} 
            name="new-layer-form" 
            onFinish={onFinish}
            initialValues = {layerOpts}
        >
        <Tabs defaultActiveKey= {defaultActiveKey} items={tabItems}/>
        <Form.Item 
            {...tailLayout}
        >
            <Space>
                <Button  type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                    Reset
                </Button>
                <Button type="link" htmlType="button" onClick={onFill}>
                    Fill form
                </Button>
            </Space>
        </Form.Item>
        </Form>
    );
};

export default NewLayerForm;