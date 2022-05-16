import React from "react";


const MainTabsContext = new React.createContext({
    tabs: [],
    setTabs: (tabs) => {}
});

export default MainTabsContext;