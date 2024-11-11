import React, {useState} from 'react'
import '../styles/EmployeeHome.css';


export const PaymentHolder = ({addPayment}) => { // NOSONAR
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
      // prevent default action
        e.preventDefault();
        if (value) {
          addPayment(value);
          setValue('');
        }
      };
  return (
    <form onSubmit={handleSubmit} className="PaymentForm">
  </form>
  )
}
