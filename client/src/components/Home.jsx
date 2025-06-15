import React from 'react';

const Home = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login'; // Если нет токена, перенаправляем на логин
    return null; // Предотвращаем рендеринг компонента
  }

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome! You are logged in.</p>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }}>Logout</button>
    </div>
  );
};

export default Home;