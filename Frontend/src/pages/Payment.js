import React from 'react';
import '../styles/EmployeeHome.css';
import { useNavigate } from 'react-router-dom';

export const Payment = ({ task }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem('paymentId', task.id); 
    navigate('/transactions');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <div
      className="Payment"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0} 
      role="button" 
    >
      <p>
        {task.task}
      </p>
    </div>
  );
};