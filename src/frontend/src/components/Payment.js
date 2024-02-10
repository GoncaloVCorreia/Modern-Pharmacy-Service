import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if the state is available
  if (!location.state || !location.state.drugs) {
    // Redirect to the home page
    navigate('/');
    return null;
  }

  const { drugs } = location.state;

  const calculateTotalPrice = () => {
    return drugs.reduce((total, drug) => total + drug.price, 0);
  };

  const handleManualPayment = async () => {
    try {
      const formData = new FormData();
      formData.append('drugs', JSON.stringify( drugs.map(drug => drug.name)));
      // Send a POST request to the /paid endpoint with the list of drugs
      await axios.post('http://django-env.eba-qjp8nisp.us-east-1.elasticbeanstalk.com/paid/', formData);

      // Redirect to a success page or perform any other desired action
      navigate('/success', { state: { fromPayment: true } });
    } catch (error) {
      console.error('Failed to process payment:', error);
      // Handle the error accordingly
      navigate('/failed', { state: { fromPayment: true } });
    }
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleFaceRecognitionPayment = async () => {
    if (!photo) {
      alert('Please select a photo for face recognition.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('photo', photo);

      // Send a POST request to the /verifyRecognition endpoint with the photo
      const response = await axios.post('http://django-env.eba-qjp8nisp.us-east-1.elasticbeanstalk.com/verifyPhoto/', formData);
    
      if (response.data.success) {
        const formDataDrugs = new FormData();
        formDataDrugs.append('drugs', JSON.stringify( drugs.map(drug => drug.name)));
        // Send a POST request to the /paid endpoint with the list of drugs
        await axios.post('http://django-env.eba-qjp8nisp.us-east-1.elasticbeanstalk.com/paid/', formDataDrugs);
  
        // Face recognition successful, redirect to success page
        navigate('/success', { state: { fromPayment: true } });
      } else {
        // Face recognition failed, redirect to failed page
        navigate('/failed', { state: { fromPayment: true } });
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
      // Handle the error accordingly
      navigate('/failed', { state: { fromPayment: true } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2 className="receipt-title">Payment Receipt</h2>
      <table className="receipt-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Generic</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug, index) => (
            <tr key={index}>
              <td>{drug.name}</td>
              <td>{drug.price}€</td>
              <td>{drug.generic ? 'Generic' : 'Not Generic'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment options */}
      <div className="payment-options">
        <button className="pay-button-manual" onClick={handleManualPayment}>
          Pay Manually
        </button>
        <div className="face-recognition-option">
          <input type="file" accept="image/jpeg" onChange={handlePhotoChange} id="photo-input" />
          <label htmlFor="photo-input" className="photo-input-label">
            Explore
          </label>
          <button className="pay-button" onClick={handleFaceRecognitionPayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay with Face Recognition'}
          </button>
        </div>
      </div>

      {/* Total price */}
      <p className="total-price">Total Price: {calculateTotalPrice()}€</p>
    </div>
  );
}

export default Payment;
