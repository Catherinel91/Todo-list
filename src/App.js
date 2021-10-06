import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route , useHistory, useLocation} from 'react-router-dom';

import {List, Tasks, AddBtnList} from './components/index'

function App() {
  const [lists, setList] = useState([]);
  const [colors, setColor] = useState([]);
  const [activeItem, setActiveItem] = useState([]);
  let history = useHistory();
  let location = useLocation();
  
  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks')
      .then(({data}) => {
        setList(data);
      })

    axios.get('http://localhost:3001/colors')
    .then(({data}) => {
      setColor(data);
    })
  }, [])

  useEffect(() => {
    const listId = history.location.pathname.split('lists/')[1];
    if (lists) {
      const list = lists.find(list => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists,history.location.pathname])
 

  

  const onAddList = (listObj) => {
    const newLists =[...lists, listObj];
    setList(newLists);
  }
  const onRemove = (id) => {
    const newLists = lists.filter(item => item.id !== id)
    setList(newLists);
  }

  const onEditTitle = (listId, listTitle) => {
    const newList = lists.map(item => {
      if(item.id === listId) {
        item.name = listTitle
      }
      return item
    })
    setList(newList);
  }

  const onChecked = (id,listId,inputChecked) => {
    const newList = lists.map(list => {
      if(list.id === listId) {
          list.tasks = list.tasks.map(task => {
            if(task.id === id) {
              task.completed = inputChecked;
            }
            return task;
          })                           
      }
      return list;
    })
    setList(newList);

    axios.patch("http://localhost:3001/tasks/" + id, {
      completed: inputChecked
    })
  }

  const onRemoveTask = (id, listId) => {
    const newList = lists.map(list => {
      if(listId === list.id) {
        list.tasks = list.tasks.filter(task => task.id !== id)
      }
      return list
    })
    setList(newList);

    axios.delete("http://localhost:3001/tasks/" + id);
  }

  const onAddTask = (id, obj) => {
    const newList = lists.map(list => {
      if(list.id === id) {
        list.tasks = [...list.tasks,obj]
      }
      return list
    })
    setList(newList)
  }

  
  return (
    <div className="todo">
      <div className="sidebar">
        <List
           onClickItem={list => history.push(`/`)}
          items = {[
            {icon : <svg width="18" height="18" viewBox="0 0 18 18" fill="#7C7C7C" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9599 8.09998H7.73995C7.24315 8.09998 7.19995 8.50228 7.19995 8.99998C7.19995 9.49768 7.24315 9.89998 7.73995 9.89998H12.9599C13.4567 9.89998 13.4999 9.49768 13.4999 8.99998C13.4999 8.50228 13.4567 8.09998 12.9599 8.09998ZM14.7599 12.6H7.73995C7.24315 12.6 7.19995 13.0023 7.19995 13.5C7.19995 13.9977 7.24315 14.4 7.73995 14.4H14.7599C15.2567 14.4 15.2999 13.9977 15.2999 13.5C15.2999 13.0023 15.2567 12.6 14.7599 12.6ZM7.73995 5.39998H14.7599C15.2567 5.39998 15.2999 4.99768 15.2999 4.49998C15.2999 4.00228 15.2567 3.59998 14.7599 3.59998H7.73995C7.24315 3.59998 7.19995 4.00228 7.19995 4.49998C7.19995 4.99768 7.24315 5.39998 7.73995 5.39998ZM4.85995 8.09998H3.23995C2.74315 8.09998 2.69995 8.50228 2.69995 8.99998C2.69995 9.49768 2.74315 9.89998 3.23995 9.89998H4.85995C5.35675 9.89998 5.39995 9.49768 5.39995 8.99998C5.39995 8.50228 5.35675 8.09998 4.85995 8.09998ZM4.85995 12.6H3.23995C2.74315 12.6 2.69995 13.0023 2.69995 13.5C2.69995 13.9977 2.74315 14.4 3.23995 14.4H4.85995C5.35675 14.4 5.39995 13.9977 5.39995 13.5C5.39995 13.0023 5.35675 12.6 4.85995 12.6ZM4.85995 3.59998H3.23995C2.74315 3.59998 2.69995 4.00228 2.69995 4.49998C2.69995 4.99768 2.74315 5.39998 3.23995 5.39998H4.85995C5.35675 5.39998 5.39995 4.99768 5.39995 4.49998C5.39995 4.00228 5.35675 3.59998 4.85995 3.59998Z" />
                    </svg>,
            name : "Все задачи",
            active: history.location.pathname === "/"
            }
          ]}
        />
        {lists && 
          <List 
            onClickItem={list => history.push(`/lists/${list.id}`)}
            isRemove 
            onRemove={onRemove}
            activeItem={activeItem}
            items={lists}/>
        }
        {colors.length > 0 && <AddBtnList onAddList={onAddList} colorsName={colors}/>}        
        
      </div>
      <div className="tasks">
        <Route exact path="/">
        {lists && lists.map(list => 
          <Tasks 
          onEditTitle={onEditTitle}
          onAddTask={onAddTask}
          onRemoveTask={onRemoveTask} 
          onChecked={onChecked} 
          key={list.id}  
          list={list}/>)}
        </Route>
        <Route exact path="/lists/:id">
        {lists && activeItem &&
          <Tasks 
          noTask
          onAddTask={onAddTask}
          onRemoveTask={onRemoveTask} 
          onChecked={onChecked} 
          onEditTitle={onEditTitle}  
          list={activeItem}/>}
        </Route>
      </div>
    </div>    
  );
}

export default App;
