import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';

function TipoPlanillaTab() {
  const [tiposPlanilla, setTiposPlanilla] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTiposPlanilla = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tipos-planilla');
        const sortedTiposPlanilla = response.data.sort((a, b) => a.ID_tipo - b.ID_tipo);
        setTiposPlanilla(sortedTiposPlanilla);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tipos de planilla:', error);
        setError('Error al cargar los tipos de planilla');
        setIsLoading(false);
      }
    };

    fetchTiposPlanilla();
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-container">
      <h2>Tipos de Planilla</h2>
      <div className="table-wrapper">
        <table className="resizable-table adaptive-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {tiposPlanilla.map(tipo => (
              <tr key={tipo.ID_tipo}>
                <td>{tipo.ID_tipo}</td>
                <td>{tipo.Nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TipoPlanillaTab;