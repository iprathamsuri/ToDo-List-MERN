import React, { useEffect, useState } from "react";
import Create from "./Create";
import axios from "axios";
import "./Home.css";
import "./TodoActions.css";

function Home() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch todos
  useEffect(() => {
    axios.get("http://localhost:3001/get")
      .then(res => setTodos(res.data))
      .catch(err => console.log(err));
  }, []);

  // Toggle done / undo
  const toggleDone = (id, currentStatus) => {
    axios.put(`http://localhost:3001/update/${id}`, {
      done: !currentStatus
    }).then(res => {
      setTodos(todos.map(todo =>
        todo._id === id ? res.data : todo
      ));
    });
  };

  // Delete todo
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      });
  };

  // Edit todo
  const handleEdit = (id, task) => {
    setEditId(id);
    setEditText(task);
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:3001/edit/${id}`, {
      task: editText
    }).then(res => {
      setTodos(todos.map(todo =>
        todo._id === id ? res.data : todo
      ));
      setEditId(null);
      setEditText("");
    });
  };

  // Filter logic
  const filteredTodos = todos.filter(todo => {
    if (filter === "done") return todo.done;
    if (filter === "pending") return !todo.done;
    return true;
  });

  return (
    <div className="home">
      <h2 className="home-title">ToDo List</h2>

      <Create />

      {/* FILTER BUTTONS */}
      <div className="filter-bar">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("done")}>Done</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <h2>No Records</h2>
        </div>
      ) : (
        <div className="todo-list">
          {filteredTodos.map(todo => (
            <div key={todo._id} className="todo-item todo-row">

              {/* EDIT MODE */}
              {editId === todo._id ? (
                <>
                  <input
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button onClick={() => saveEdit(todo._id)}>💾</button>
                </>
              ) : (
                <>
                  <span
                    className={`todo-text ${todo.done ? "done" : ""}`}
                    onClick={() => toggleDone(todo._id, todo.done)}
                  >
                    {todo.task}
                  </span>

                  <div className="actions">
                    <button onClick={() => handleEdit(todo._id, todo.task)}>✏️</button>
                    <button onClick={() => handleDelete(todo._id)}>❌</button>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
