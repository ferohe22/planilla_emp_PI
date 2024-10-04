import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Table.css';

function BasicoTab() {
  const [Basicos, setBasicos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [columns, setColumns] = useState([
    { key: 'id_salario', label: 'ID', width: 100 },
    { key: 'Base', label: 'Monto Básico', width: 150 },
    // Añade más columnas según sea necesario
  ]);

  useEffect(() => {
    const fetchBasicos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Basicos');
        setBasicos(response.data);
      } catch (error) {
        console.error('Error fetching Basicos:', error);
      }
    };

    fetchBasicos();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBasicos = React.useMemo(() => {
    let sortableBasicos = [...Basicos];
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
  }, [Basicos, sortConfig]);

  const handleResize = useCallback((index, newWidth) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      newColumns[index] = { ...newColumns[index], width: newWidth };
      return newColumns;
    });
  }, []);

  return (
    <div className="table-container">
      <h2>Listado de Nóminas</h2>
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
          {sortedBasicos.map(Basico => (
            <tr key={Basico.id}>
              {columns.map(column => (
                <td key={column.key} style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}>
                  {Basico[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BasicoTab;