import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from "./Task.module.scss";
import svgAddTask from "../../assets/images/icon-btn-list.svg";

const TaskForm = ({list,onAddTask}) => {
    const [formVisible, setFormVisible] = useState(false);
    const [inputValueForm, setInputValueForm] = useState('');

    // const input = () => {
    //     if(!inputValueForm.trim()) {
    //         return null
    //     } else {
    //         return inputValueForm.trim()
    //     }
    // }
    
    const addTask = () => {
        if(!inputValueForm) {
            return
        }
        const newTask = {
            listId: list.id,
            text: inputValueForm.trim() ,
            completed: false
        }
        axios.post("http://localhost:3001/tasks/", newTask)
            .then(({data}) => {
                onAddTask(list.id, data);
                setFormVisible(false);
                setInputValueForm("");
            })
    }
    
    return(
        
        <div className={styles.taskForm}>
            {!formVisible &&
                <div onClick={() => setFormVisible(true)} className={styles.taskAddBtn}>
                    <img className={styles.taskAddBtnSvg} src={svgAddTask} alt="" />
                    <span className={styles.taskAddBtnText}>Новая задача</span>
                </div>
            }
           {formVisible && 
                <div className={styles.taskFormItem}>
                    <input value={inputValueForm} onChange={(e) => setInputValueForm(e.target.value)} type="text" className={styles.taskFormInput} placeholder="Текст задачи"/>
                    <div className={styles.taskFormItemBtns}>
                        <button onClick={addTask} className={`${styles.taskFormBtnAdd} btn--green`}>Добавить задачу</button>
                        <button onClick={() => {setFormVisible(false); setInputValueForm('')}} className={`${styles.taskFormBtnCancle} btn--grey`}>Отмена</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default TaskForm;