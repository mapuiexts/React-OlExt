import { useMemo } from 'react';
import {Tabs} from 'antd';
import useMainTabs from '../../../../hooks/ui/useMainTabs'
import './MainTabs.css';

/**
 * Tabs component to allow the user to dynamically add/remove tabs to the application:
 * <ul>
 * <li>
 *      See <a href="https://ant.design/components/tabs/">Antd Documentation</a> 
 *      for more details about the available properties.
 * </li>
 * </ul>
 *
* @visibleName Main Tabs
 */
const MainTabs = (props) => {
    const {tabs} = useMainTabs();

    const tabItems = useMemo(() => {
        const items = tabs.map((tabItem) => {
            return({
                key: tabItem.key,
                label: tabItem.name,
                children: tabItem.tab
            });
        });
        return items;
    }, [tabs]);
    
    return(
        <Tabs {...props} style={{...props.style, paddingLeft: '0.2rem', height:'100%', width:'100%'}} items={tabItems}/>
    );
};

MainTabs.propTypes = {

}

export default MainTabs;