import clsx from 'clsx';
import axios from 'axios';

import styles from "./List.module.scss";
import svgClose from "../../assets/images/close-icon.svg"

const List = ({items, onClick, isRemove, onRemove,onClickItem,activeItem}) => {

    const onRemoveItem = (item) => {
        if(window.confirm("Вы действительно хотите удалить список?")) {
            axios.delete("http://localhost:3001/lists/" + item.id)
                .then(() => {
                    onRemove(item.id)
                })
        }
    }
    
    return(
        <div onClick={onClick}  className={styles.list}>
            {items.map((item,index) => (
                <div onClick={onClickItem ? () => onClickItem(item) : null} key={index} className={clsx(styles.listItem, {
                    [styles.listItemActive] : (item.active) || (activeItem && activeItem.id === item.id),
                    [styles.listItemBtn] : item.btn
                })}>   
                    {item.icon ? item.icon : <div style={{background: `${item.color.hex}`}} className={styles.listIcon}></div>}                  
                    <p className={styles.listText}>{item.name}</p>
                    {isRemove && 
                        <img 
                            onClick={() =>onRemoveItem(item)}
                            className={styles.listCloseIcon} 
                            src={svgClose} alt="" />}
                </div>
            ))}
        </div>
    );
}

export default List;