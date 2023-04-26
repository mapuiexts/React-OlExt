import React, {useMemo} from 'react';
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
        span: 3
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
 * A basic Form for the ol/layer/Base Layer.
 */
const EditLayerForm = ({
    layer,
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
                children: <Item mode="edit"/>
            });
        });
        return items;
    }, [tabs]);

    //get first key as the default active key for the tab
    let defaultActiveKey = tabs[0].key;
    //get options
    let opts = {};
    tabs.forEach((tab) => {
        opts = {
            ...opts,
            ...tab.el.getOpts(layer)
        };
        if(tab.isDefault === true) {
            defaultActiveKey = tab.key;
        }
    });
    
    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue(opts);
    };

    return(
        <Form 
            {...otherProps}
            {...layout} 
            //layout="vertical"
            form={form} 
            name="edit-layer-form" 
            onFinish={onFinish}
            initialValues = {opts}
        >
        <Tabs defaultActiveKey={defaultActiveKey} items={tabItems}/>

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

export default EditLayerForm;