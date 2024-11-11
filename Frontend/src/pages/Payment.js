import React from 'react';
import '../styles/EmployeeHome.css';
import { useNavigate } from 'react-router-dom';

export const Payment = ({ task, toggleComplete }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.setItem('paymentId', task.id); // Store payment ID in local storage
    navigate('/transactions');
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