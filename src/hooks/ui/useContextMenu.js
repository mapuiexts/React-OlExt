import {useState, useEffect, useCallback} from 'react';

/**
 * Hook to allow the context menu usage through the 
 * storage of the current mouse position, the visibility
 * of the context menu and handler to disable the default 
 * context menu in the browser.
 * 
 * see 'https://www.pluralsight.com/guides/how-to-create-a-right-click-menu-using-react'
 * for more details
 * 
 * @author Paulo Sergio SAMPAIO de ARAGAO
 */
const useContextMenu = ({onFinish}) => {
    const [xPos, setXPos] = useState("0px");
    const [yPos, setYPos] = useState("0px");
    const [showMenu, setShowMenu] = useState(false);
  
    const handleContextMenu = useCallback((e) => {
        
        e.preventDefault();
        setXPos(`${e.pageX}px`);
        setYPos(`${e.pageY}px`);
        setShowMenu(true);
        //onFinish();
        
      },
      [setXPos, setYPos]
    );
  
    const handleClick = useCallback(() => {
      onFinish && onFinish();
      showMenu && setShowMenu(false);
    }, [showMenu, onFinish]);
  
    useEffect(() => {
      document.addEventListener("click", handleClick);
      document.addEventListener("contextmenu", handleContextMenu);
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("contextmenu", handleContextMenu);
      };
    });
  
    return { xPos, yPos, showMenu };
  };

  export default useContextMenu;