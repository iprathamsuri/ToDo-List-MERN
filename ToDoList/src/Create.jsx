import React, { useState } from "react";
import "./Create.css";
import axios from "axios";

function Create() {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    if (!task.trim()) return;

    axios.post("http://localhost:3001/add", { task })
      .then(result => {
        console.log(result);
        setTask("");
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="create">
      <input
        type="text"
        placeholder="Add a new task..."
        className="create-input"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button
        type="button"
        className="create-btn"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
}

export default Create;
