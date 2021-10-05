import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';

import { List } from '../index';

import styles from "./AddBtnList.module.scss";

import svg from "../../assets/images/close-color-list.svg"

const AddBtnList = ({colorsName, onAddList}) => {
    const [visibleListDrop,setVisibleListDrop] = useState(false);
    const [selectedcolor,setSelectedColor] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if(Array.isArray(colorsName)) {
            setSelectedColor(colorsName[0].id)
        }
    },[colorsName])

    const onCloseDrop = () => {
        setSelectedColor(colorsName[0].id);
        setInputValue('');
    }

    const addList = () => {
        if(!inputValue) {
            alert("Введите название папки");
            return
        }
        setLoading(true)
        axios.post('http://localhost:3001/lists', {
                name:  inputValue.trim(),
                colorId: selectedcolor            
            })
            .then(({data}) => {
                const color = colorsName.filter(item => item.id === selectedcolor)[0];
                const listObj = {...data, color: {name: color.name, hex: color.hex}}
                onAddList(listObj)
                setLoading(false)
            })
    }

    return(
        <>
        <List
            onClick={() => setVisibleListDrop(true)}
            items = {[
                {
                icon: <svg width="12" height="12" viewBox="0 0 12 12" stroke="#000" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1V11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 6H11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>,
                name: "Добавить задачу",
                btn: true              
                }
            ]}
        />
        {visibleListDrop && (
            <div className={styles.listDrop}>
                <img onClick={() => {setVisibleListDrop(false); onCloseDrop()}} className={styles.listDropIconClose} src={svg} alt="" />
                <input 
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    type="text" 
                    placeholder="Название папки" />
                <div className={styles.listDropColorsWrap}>
                    {colorsName.map((item,index) => (
                    <div 
                    onClick={() => setSelectedColor(index + 1)} 
                    key={index} 
                    style={{background: `${item.hex}`}} 
                    className={clsx(styles.listDropIcon,{
                        [styles.listDropItemActive] : selectedcolor === colorsName[index].id
                    })}></div>
                    ))}
                </div>
                <button
                    disabled={loading}
                    onClick={addList}
                    className={`${styles.listDropBtn} btn--green `}>
                        {loading? "Добавление..." : "Добавить"}</button>
            </div>)
        }
        </>
    );
}

export default AddBtnList;