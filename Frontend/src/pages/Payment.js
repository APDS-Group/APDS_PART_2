import React from 'react';
import '../styles/EmployeeHome.css';
import { useNavigate } from 'react-router-dom';

export const Payment = ({ task }) => { // NOSONAR
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem('paymentId', task.id); // NOSONAR
    navigate('/transactions');
  };

  const handleKeyPress = (event) => { // NOSONAR
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <button
      className="Payment"
      onClick={handleClick}
    >
      <p>
        {task.task}
      </p>
    </button>
  );
};