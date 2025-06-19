import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ username }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white flex justify-between p-4">
      <h1 className="text-xl font-bold">TaskHub</h1>
      <div>
        Hello, {username}!
        <button onClick={logout} className="ml-4 px-3 py-1 bg-white text-blue-600 rounded">Logout</button>
      </div>
    </nav>
  );
}
