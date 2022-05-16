import MainTabsContext from '../context/MainTabsContext';


const MainTabsProvider = ({value, children}) => {
    return(
        <MainTabsContext.Provider value={value}>
            {children}
        </MainTabsContext.Provider>
    );
};


export default MainTabsProvider;
