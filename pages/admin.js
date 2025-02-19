import React, { useState } from 'react';
import styles from '../src/styles/Admin.module.css';

export default function Admin() {
  const [promotions, setPromotions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para actualizar promociones
  };

  return (
    <div className={styles.container}>
      <h1>Panel de Administración</h1>
      <form onSubmit={handleSubmit}>
        {/* Formulario para agregar/editar promociones */}
      </form>
    </div>
  );
} 