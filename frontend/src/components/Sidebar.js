import React, { useState } from 'react';

function Sidebar({ setSelectedOption }) {
  const [operacionExpanded, setOperacionExpanded] = useState(true);
  const [planillaMensualExpanded, setPlanillaMensualExpanded] = useState(true);
  const [reportesExpanded, setReportesExpanded] = useState(true);
  const [tablasExpanded, setTablasExpanded] = useState(true);

  const toggleExpand = (setter) => {
    setter(prev => !prev);
  };

  return (
    <nav className="sidebar">
      <ul>
        <li>
          <span onClick={() => toggleExpand(setOperacionExpanded)}>
            {operacionExpanded ? '▼' : '►'} Operación
          </span>
          {operacionExpanded && (
            <ul>
              <li>
                <span onClick={() => toggleExpand(setPlanillaMensualExpanded)}>
                  {planillaMensualExpanded ? '▼' : '►'} Planilla Mensual
                </span>
                {planillaMensualExpanded && (
                  <ul>
                    <li onClick={() => setSelectedOption('CrearPlanillaMensual')}>Crear</li>
                    <li onClick={() => setSelectedOption('ModificarPlanillaMensual')}>Modificar</li>
                    <li onClick={() => setSelectedOption('EliminarPlanillaMensual')}>Eliminar</li>
                  </ul>
                )}
              </li>
              <li onClick={() => setSelectedOption('Generacion de boletas')}>Generación de boletas de pago</li>
            </ul>
          )}
        </li>
        <li>
          <span onClick={() => toggleExpand(setReportesExpanded)}>
            {reportesExpanded ? '▼' : '►'} Reportes
          </span>
          {reportesExpanded && (
            <ul>
              <li onClick={() => setSelectedOption('Listado de empleados')}>Listado de empleados</li>
              <li onClick={() => setSelectedOption('Listado de empleados por AFP')}>Listado de empleados por AFP</li>
            </ul>
          )}
        </li>
        <li>
          <span onClick={() => toggleExpand(setTablasExpanded)}>
            {tablasExpanded ? '▼' : '►'} Tablas Maestras
          </span>
          {tablasExpanded && (
            <ul>
              <li onClick={() => setSelectedOption('Empleados')}>Empleados</li>
              <li onClick={() => setSelectedOption('Tipo de planilla')}>Tipo de planilla</li>
              <li onClick={() => setSelectedOption('Fondos de Pension')}>Fondos de Pensión</li>
              <li onClick={() => setSelectedOption('Basico')}>Remuneracion Base</li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;