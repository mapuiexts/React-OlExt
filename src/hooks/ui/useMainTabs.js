import {useContext} from 'react';
import MainTabsContext from '../../context/MainTabsContext';
const useMainTabs = () => {
    return useContext(MainTabsContext);
};


export default useMainTabs;