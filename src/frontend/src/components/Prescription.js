import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Prescription.css';

function Prescription() {
  const [drugs, setDrugs] = useState([]);
  const [selectedAlternatives, setSelectedAlternatives] = useState({});
  const { authorized, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await axios.get('http://django-env.eba-qjp8nisp.us-east-1.elasticbeanstalk.com/drugs/');
        const drugsData = response.data.map(([name, price, generic, alternatives]) => ({
          name,
          price,
          generic: generic === 'Y',
          alternatives: alternatives || [],
        }));
        setDrugs(drugsData);
        setSelectedAlternatives({});
      } catch (error) {
        console.error('Failed to fetch drugs:', error);
      }
    };

    fetchDrugs();
  }, []);

  if (!authorized) {
    return <Link to="/login">Please log in</Link>;
  }

  const handleAlternativeChange = (index, event) => {
    const { value } = event.target;
    const updatedSelectedAlternatives = { ...selectedAlternatives };
    const selectedAlternative = drugs[index].alternatives.find((alternative) => alternative[0] === value);
    const selectedAlternativePrice = selectedAlternative ? selectedAlternative[1] : drugs[index].price;
    const selectedAlternativeGeneric = selectedAlternative ? selectedAlternative[2] === 'Y' : drugs[index].generic;
    updatedSelectedAlternatives[index] = {
      name: value,
      price: selectedAlternativePrice,
      generic: selectedAlternativeGeneric,
    };
    setSelectedAlternatives(updatedSelectedAlternatives);
  };

  const handleGenericChange = (index, event) => {
    const { value } = event.target;
    const updatedSelectedAlternatives = { ...selectedAlternatives };
    const selectedAlternative = updatedSelectedAlternatives[index];
    if (selectedAlternative) {
      selectedAlternative.generic = value === 'Y';
      setSelectedAlternatives(updatedSelectedAlternatives);
    }
  };

  const handlePayment = () => {
    const selectedDrugs = drugs.map((drug, index) => {
      const selectedAlternative = selectedAlternatives[index] || drug;
      return {
        ...drug,
        ...selectedAlternative,
      };
    });
    navigate('/prescription/payment', { state: { drugs: selectedDrugs } });
  };

  return (
    <div className="prescription-container">
      <nav>
        <div>Welcome, {username}!</div>
        <button onClick={logout}>Logout</button>
      </nav>

      <h2>Prescription</h2>
      <table className="prescription-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Generic</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug, index) => {
            const selectedAlternative = selectedAlternatives[index];
            const selectedName = selectedAlternative ? selectedAlternative.name : drug.name;
            const selectedPrice = selectedAlternative ? selectedAlternative.price : drug.price;
            const selectedGeneric = selectedAlternative ? selectedAlternative.generic : drug.generic;

            return (
              <tr key={index}>
                <td>
                  <select value={selectedName} onChange={(event) => handleAlternativeChange(index, event)}>
                    <option value={drug.name}>{drug.name}</option>
                    {drug.alternatives.map((alternative) => (
                      <option key={alternative[0]} value={alternative[0]}>
                        {alternative[0]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{selectedPrice}€</td>
                <td>
                  {drug.generic ? (
                    <select value={selectedGeneric ? 'Y' : 'N'} onChange={(event) => handleGenericChange(index, event)}>
                      <option value="N">Non Generic</option>
                      <option value="Y">Generic</option>
                    </select>
                  ) : (
                    <span>Not Generic</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className="payment-button" onClick={handlePayment}>
        Make Payment
      </button>
    </div>
  );
}

export default Prescription;
