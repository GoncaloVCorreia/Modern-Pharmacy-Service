import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Success() {
 
  const navigate=useNavigate();

  useEffect(() => {
    const handlePopstate = () => {
      // Redirect to the prescription page
      navigate('/profile/');
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Thank you for your payment.</p>
    </div>
  );
}

const SuccessWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.fromPayment) {
    // Redirect to the home page 
    navigate('/');
    return null;
  }

  return <Success />;
};

export default SuccessWrapper;
