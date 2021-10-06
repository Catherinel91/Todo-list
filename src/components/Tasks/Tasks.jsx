import axios from 'axios';

import styles from "./Task.module.scss";
import svgEdit from "../../assets/images/edit-icon.svg";
import svgRemove from "../../assets/images/close-icon.svg";
import TaskForm from './TasksForm';

const Tasks = ({list, onEditTitle, onChecked,onRemoveTask, onAddTask, noTask}) => {
    const editTitle = () => {
        const newText = prompt("Название списка", list.name);
        if(newText) {
            onEditTitle(list.id, newText);
            axios.patch("http://localhost:3001/lists/" + list.id, {
                name: newText
            })
        }
    }
    
    return(
        <div className={styles.task}>
            <div className={styles.taskHead}>
                <span style={{color: `${list.color ? list.color.hex : ""}`}}  className={styles.taskHeadTitle} >{list.name}</span>
                <img onClick={() => editTitle()} className={styles.taskHeadImg} src={svgEdit} alt="" />
            </div>
            <div className={styles.taskInner}>
                {list.tasks && list.tasks.map(task => 
                    <div key={task.id} className={styles.taskItem}>
                        <label className={styles.taskLabelCheckbox}>
                            <input onChange={(e) => onChecked(task.id,list.id,e.target.checked)} className={styles.taskCheckbox} type="checkbox" checked={task.completed}/>
                            <span className={styles.taskItemCheckbox}></span>
                        </label>
                        <span className={styles.taskText}>{task.text}</span>
                        <img onClick={() => onRemoveTask(task.id, list.id)} className={styles.taskHeadIconRemove} src={svgRemove} alt="" />
                    </div>
                    )}
            </div>
            <TaskForm list={list}  onAddTask={onAddTask}/>
            {list.tasks && list.tasks.length === 0 && noTask && <div className={styles.tasknoTask}>Задачи отсутствуют</div>}
        </div>        
    );
}

export default Tasks;