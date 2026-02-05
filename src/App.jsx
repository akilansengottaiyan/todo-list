import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos")
    return saved ? JSON.parse(saved) : []
  })

  const [task, setTask] = useState(() => {
    return localStorage.getItem("task") || ""
  })

  // 2️⃣ Save todos whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // 3️⃣ Save task whenever it changes
  useEffect(() => {
    localStorage.setItem("task", task)
  }, [task])

  const addTodo = () => {
    setTodos([...todos, { text: task, completed: false }])
    setTask("")
  }

  const removeTodo = (id) => {
    setTodos(prev => prev.filter((_, i) => i !== id))
    console.log("Hello World " + id)
  }

  const toggleComplete = (id) => {
    setTodos(prev => prev.map((todo, i) => 
      i === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <>
      <div className="custom-container">
        <div className="todo-container">
          <div className="todo-header">
            <h1><span className="my">My</span> <span className="tasks">Tasks</span></h1>
            <p>What do you need to do?</p>
          </div>
          <div className="form-input input-group mb-3">
            <input value={task} onChange={(e) => setTask(e.target.value)} type="text" className="form-control" aria-describedby="button-addon2"/>
            <button className="btn add-todo btn-outline-secondary" type="button" id="button-addon2" onClick={addTodo}>Add Todo</button>
          </div>
          <ul className="list">
            { todos.map((t, i) => (
              <li key={i} className="todo-item">
                <div className="todo-content">
                  <input 
                    type="checkbox" 
                    checked={t.completed || false}
                    onChange={() => toggleComplete(i)}
                    className="todo-checkbox"
                  />
                  <span className={t.completed ? "completed" : ""}>{t.text || t}</span>
                </div>
                <button className="btn btn-danger" onClick={() => removeTodo(i)}>🗑️ Delete</button>
              </li>
            )) }
          </ul>
        </div>
      </div>
    </>
  )
}

export default App