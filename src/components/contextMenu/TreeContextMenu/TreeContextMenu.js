import React from 'react';
import './TreeContextMenu.css';

const TreeContextMenu = React.memo(({
    overlay, 
    node,
    xPos,
    yPos,
    showMenu = false
}) => {
   
    //calculate the visibility to show/hide the context menu
    const visibility  = showMenu ? {visibility:'visible'} : {visibility:'hidden', height:0}
    return (
        <div mode="vertical"
            className="rolext-tree-context-menu"
            style={{
                ...visibility,
                top: yPos,
                left: xPos,
            }}
        >
            {overlay}
        </div>
    );

  });

  export default TreeContextMenu;

// const ContextMenu = ({ menu }) => {
//     const { xPos, yPos, showMenu } = useContextMenu();
//     return (
//       <Motion
//         defaultStyle={{ opacity: 0 }}
//         style={{ opacity: !showMenu ? spring(0) : spring(1) }}
//       >
//         {(interpolatedStyle) => (
//           <>
//             {showMenu ? (
//               <div
//                 className="menu-container"
//                 style={{
//                   top: yPos,
//                   left: xPos,
//                   opacity: interpolatedStyle.opacity,
//                 }}
//               >
//                 {menu}
//               </div>
//             ) : (
//               <></>
//             )}
//           </>
//         )}
//       </Motion>
//     );
//   };