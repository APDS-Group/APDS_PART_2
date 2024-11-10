import React from 'react';
import '../styles/EmployeeHome.css';
import { useNavigate } from 'react-router-dom';

export const Payment = ({ task, toggleComplete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/transactions/${task.id}`);
  };

  return (
    <div className="Payment" onClick={handleClick}>
      <p className={`${task.completed ? "completed" : "incompleted"}`} onClick={() => toggleComplete(task.id)}>
        {task.task}
      </p>
      <div>
      </div>
    </div>
  );
};