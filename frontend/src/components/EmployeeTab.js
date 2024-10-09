import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Table.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

function EmployeeTab() {
  const [employees, setEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [columns, setColumns] = useState([
    { key: 'id_emp', label: 'ID', width: 80 },
    { key: 'Nombres', label: 'Nombre', width: 150 },
    { key: 'Apellidos', label: 'Apellido', width: 150 },
    { key: 'DNI', label: 'DNI', width: 120 },
    { key: 'Email', label: 'Email', width: 200 },
    { key: 'Direccion', label: 'Dirección', width: 200 },
    { key: 'contrato', label: 'Contrato', width: 120 },
    { key: 'Desc. estado', label: 'Estado', width: 120 } 
  ]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/empleados');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    let sortableEmployees = [...employees];
    if (sortConfig.key !== null) {
      sortableEmployees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig]);

  const handleResize = useCallback((index, newWidth) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      newColumns[index] = { ...newColumns[index], width: newWidth };
      return newColumns;
    });
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(column => column.label)],
      body: sortedEmployees.map(employee => columns.map(column => employee[column.key]))
    });
    doc.save('listado_empleados.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedEmployees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados");
    XLSX.writeFile(workbook, "listado_empleados.xlsx");
  };

  const downloadTXT = () => {
    const content = sortedEmployees.map(employee => 
      columns.map(column => `${column.label}: ${employee[column.key]}`).join(', ')
    ).join('\n');
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "listado_empleados.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="table-container">
      <h2>Listado de Empleados</h2>
      <div className="download-buttons">
        <button onClick={downloadPDF}>Descargar PDF</button>
        <button onClick={downloadExcel}>Descargar Excel</button>
        <button onClick={downloadTXT}>Descargar TXT</button>
      </div>
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
            {sortedEmployees.map(employee => (
              <tr key={employee.id}>
                {columns.map(column => (
                  <td key={column.key} style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}>
                    {employee[column.key]}
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

export default EmployeeTab;