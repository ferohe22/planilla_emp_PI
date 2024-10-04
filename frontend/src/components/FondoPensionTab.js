import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Table.css';

function FondoPensionTab() {
  const [fondos, setFondos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [columns, setColumns] = useState([
    { key: 'id_fondo', label: 'ID', width: 100 },
    { key: 'nom_fondo', label: 'Nombre', width: 200 },
    { key: 'pct_fondo', label: 'Porcentaje fondo', width: 150 },
    { key: 'pct_comision', label: 'Porcentaje Comision', width: 150 },
    { key: 'pct_seguro', label: 'Porcentaje Seguro', width: 150 }
  ]);

  useEffect(() => {
    const fetchFondos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fondos-pension');
        setFondos(response.data);
      } catch (error) {
        console.error('Error fetching fondos de pensión:', error);
      }
    };

    fetchFondos();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedFondos = React.useMemo(() => {
    let sortableFondos = [...fondos];
    if (sortConfig.key !== null) {
      sortableFondos.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFondos;
  }, [fondos, sortConfig]);

  const handleResize = useCallback((index, newWidth) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      newColumns[index] = { ...newColumns[index], width: newWidth };
      return newColumns;
    });
  }, []);

  return (
    <div className="table-container">
      <h2>Listado de Fondos de Pensión</h2>
      <table className="resizable-table">
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
          {sortedFondos.map(fondo => (
            <tr key={fondo.id_fondo}>
              {columns.map(column => (
                <td key={column.key} style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}>
                  {fondo[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FondoPensionTab;