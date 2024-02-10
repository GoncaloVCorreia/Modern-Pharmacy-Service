import React, { createContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState('');

  const login = (username) => {
    setAuthorized(true);
    setUsername(username);
  };

  const logout = () => {
    setAuthorized(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ authorized, username,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
