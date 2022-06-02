import { useState } from 'react';
import {Button, Drawer} from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import useWindowSize from '../../../../hooks/ui/useWindowSize';
import {convertRemToPixels} from '../../../../core/deviceUnits';
import './MenuBar.css'

/**
 * Default Responsive MenuBar 
 */

const MenuBar = ({
    title = null,
    children,
    breakpoint=convertRemToPixels(40),
    ...otherProps
}) => {
    const [collapsed, setCollapsed] = useState(true);
    const { width } = useWindowSize();

    const onCloseDrawer = () => {
        setCollapsed(true);
    };

    const showDrawer = () => {
        setCollapsed(false);
    };
    
    return (
        <>
            <nav className="rolext-menubar-main" {...otherProps}>
                {width > breakpoint  ?
                    <>{children}</>
                    :
                    <Button type="primary" onClick={showDrawer}>
                        {title}
                        {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    </Button> 
                }
            </nav>
            <nav>
            <Drawer mask={false} title={title} placement="left" onClose={onCloseDrawer} visible={!collapsed} width="50%">
                <nav className="rolext-menubar-side">
                    <>{children}</>
                </nav>
            </Drawer>
            </nav>
        </>
    );
};

export default MenuBar;