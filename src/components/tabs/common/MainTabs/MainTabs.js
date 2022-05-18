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
    
    return(
        <Tabs {...props} style={{marginLeft:3, height:'100%', width:'100%'}}>
            {tabs.map((tabItem) => {
                return(
                    <Tabs.TabPane tab={tabItem.name} key={tabItem.key} 
                                  style={{height:'100%', width:'100%'}}
                    >
                        {tabItem.tab}
                    </Tabs.TabPane>
                );
            })}
        </Tabs>
    );
};

MainTabs.propTypes = {

}

export default MainTabs;