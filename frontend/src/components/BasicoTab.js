import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Table.css';

function BasicoTab() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  console.log('API URL:', API_URL); // Para depuración

  const [basicos, setBasicos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([
    { key: 'id_salario', label: 'ID', width: 100 },
    { key: 'Base', label: 'Monto Básico', width: 150 },
  ]);

  useEffect(() => {
    const fetchBasicos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Basicos`);
        setBasicos(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching Basicos:', error);
        setError('Hubo un error al cargar los datos. Por favor, intente nuevamente más tarde.');
      }
    };

    fetchBasicos();
  }, [API_URL]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBasicos = React.useMemo(() => {
    let sortableBasicos = [...basicos];
    if (sortConfig.key !== null) {
      sortableBasicos.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBasicos;
  }, [basicos, sortConfig]);

  const handleResize = useCallback((index, newWidth) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      newColumns[index] = { ...newColumns[index], width: newWidth };
      return newColumns;
    });
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="table-container">
      <h2>Listado de Remuneraciones Base</h2>
      <div className="table-wrapper">
        <table className="resizable-table adaptive-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={column.key} 
                  onClick={() => requestSort(column.key)}
                  style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                  <div
                    className="resizer"
                    onMouseDown={(e) => {
                      const startX = e.pageX;
                      const startWidth = column.width;
                      const handleMouseMove = (e) => {
                        handleResize(index, Math.max(50, startWidth + e.pageX - startX));
                      };
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                      }, { once: true });
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedBasicos.map(basico => (
              <tr key={basico.id_salario}>
                {columns.map(column => (
                  <td key={column.key} style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}>
                    {basico[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BasicoTab;