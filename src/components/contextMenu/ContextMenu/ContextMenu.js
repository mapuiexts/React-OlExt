import React from 'react';
import {Button} from 'antd';
import useContextMenu from '../../../hooks/ui/useContextMenu';

const ContextMenu = ({overlay, onFinish}) => {
    const { xPos, yPos, showMenu } = useContextMenu({onFinish});
    //onFinish && onFinish();
    return (
        showMenu && (
            <div
                //className="menu-container"
                style={{
                    position: 'fixed',
                    display: 'flex',
                    flexDirection: 'column',
                    top: yPos,
                    left: xPos,
                    borderRadius: '15px',
                    backgroundColor: 'lightgray'
                    //opacity: interpolatedStyle.opacity,
                }}
            >
            {/* <Space direction='vertical'> */}
                {overlay}
                <Button size='small'>Hello</Button>
                <Button size='small' >Delete Layer </Button>
                <Button size='small'>Add Layer</Button>
            {/* </Space> */}
            </div>
        )
    );
  };

  export default ContextMenu;

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