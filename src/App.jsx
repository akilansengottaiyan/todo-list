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

  const [statusFilter, setStatusFilter] = useState("all")

  // 2️⃣ Save todos whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // 3️⃣ Save task whenever it changes
  useEffect(() => {
    localStorage.setItem("task", task)
  }, [task])

  const addTodo = () => {
    setTodos([...todos, { 
      text: task, 
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }])
    setTask("")
  }

  const removeTodo = (id) => {
    setTodos(prev => prev.filter((_, i) => i !== id))
    console.log("Hello World " + id)
  }

  const toggleComplete = (id) => {
    setTodos(prev => prev.map((todo, i) => 
      i === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : null
      } : todo
    ))
  }

  const getFilteredTodos = () => {
    return todos
      .map((todo, index) => ({ ...todo, originalIndex: index }))
      .filter((todo) => {
        if (statusFilter === "completed") return todo.completed === true
        if (statusFilter === "pending") return todo.completed === false
        return true // "all"
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return dateA - dateB
      })
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
          <div className="filter-container">
            <button 
              className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button 
              className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${statusFilter === "completed" ? "active" : ""}`}
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </button>
          </div>
          <ul className="list">
            { getFilteredTodos().map((t) => (
              <li key={t.originalIndex} className="todo-item">
                <div className="todo-content">
                  <input 
                    type="checkbox" 
                    checked={t.completed || false}
                    onChange={() => toggleComplete(t.originalIndex)}
                    className="todo-checkbox"
                  />
                  <span className={t.completed ? "completed" : ""}>{t.text || t}</span>
                </div>
                <button className="btn btn-danger" onClick={() => removeTodo(t.originalIndex)}>🗑️ Delete</button>
              </li>
            )) }
          </ul>
        </div>
      </div>
    </>
  )
}

export default App