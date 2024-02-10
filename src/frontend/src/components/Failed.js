import React from 'react';
import { useLocation,Link} from 'react-router-dom';

function Failed() {
  const location = useLocation();
 

  // Check if the state is available
  if (!location.state || !location.state.fromPayment) {
    // Redirect to the home page if the state is not available or if it doesn't indicate coming from payment
    return <Link to="/">Please buy something first</Link>;
  }

  return (
    <div>
      <h2>Payment Failed!</h2>
      <p>Something went wrong.</p>
    </div>
  );
}

export default Failed;
