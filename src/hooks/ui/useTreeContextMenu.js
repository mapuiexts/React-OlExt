import {useState, useCallback, useEffect} from 'react';

const useTreeContextMenu = () => {
    const [xPos, setXPos] = useState("0px");
    const [yPos, setYPos] = useState("0px");
    const [showMenu, setShowMenu] = useState(false);
    const [rightClickedNode, setRightClickedNode] = useState(null);

    /**
     * Method to handle the right click in the tree node view
     * This method will store the needes states to show the
     * context menu
     */
    const onRightClickNode = useCallback((e) => {
        const node = e.node;
        const event = e.event;

        setXPos(`${event.clientX}px`);
        setYPos(`${event.clientY}px`);

        // setXPos(`${event.pageX}px`);
        // setYPos(`${event.pageY}px`);
        setShowMenu(true);
        setRightClickedNode(node);
        
    }, [setXPos, setYPos]);

    /**
     * Handle to set the menu context invisible once 
     * the user clicks in the context menu or outside it
     */
    const handleClick = useCallback(() => {
        showMenu && setShowMenu(false);
    }, [showMenu ]);

    /**
     * Effect to register/unregister the click mouse
     * event responsible to make invisible to context
     * menu
     */
    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
          document.removeEventListener("click", handleClick);
        };
    }, [handleClick]);

    return { xPos, yPos, showMenu, rightClickedNode, onRightClickNode};
};

export default useTreeContextMenu;
