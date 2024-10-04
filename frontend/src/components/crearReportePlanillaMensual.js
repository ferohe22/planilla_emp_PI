import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CrearReportePlanillaMensual() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedTipoPlanilla, setSelectedTipoPlanilla] = useState('');
  const [tiposPlanilla, setTiposPlanilla] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reporteData, setReporteData] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowPopup(false);
        setSelectedYear('');
        setSelectedMonth('');
        setSelectedTipoPlanilla('');
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Cargar tipos de planilla
    const fetchTiposPlanilla = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tipos-planilla');
        console.log('Tipos de planilla cargados:', response.data);
        setTiposPlanilla(response.data);
      } catch (error) {
        console.error('Error al cargar tipos de planilla:', error);
        setError('Error al cargar tipos de planilla. Por favor, intente de nuevo más tarde.');
      }
    };

    fetchTiposPlanilla();

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleGenerar = async () => {
    setIsProcessing(true);
    setError(null);
    setReporteData(null);

    const requestData = {
      año: parseInt(selectedYear, 10),
      mes: parseInt(selectedMonth, 10),
      id_tip_planilla: parseInt(selectedTipoPlanilla, 10)
    };

    console.log('Iniciando generación de reporte');
    console.log('Datos a enviar:', requestData);

    try {
      console.log('Enviando solicitud al servidor...');
      const response = await axios.post('http://localhost:5001/api/planilla-mensual/reporte', requestData);
      console.log('Respuesta del servidor recibida:', response.data);
      
      if (response.data && response.data.empleados) {
        console.log('Número de empleados en el reporte:', response.data.empleados.length);
      } else {
        console.warn('La respuesta no contiene datos de empleados');
      }

      setReporteData(response.data);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      if (error.response) {
        console.error('Respuesta de error del servidor:', error.response.data);
        setError(`Error al generar el reporte: ${error.response.data.message}`);
      } else {
        setError('Error al generar el reporte. Por favor, intente de nuevo más tarde.');
      }
    }

    setIsProcessing(false);
    setShowPopup(false);
    console.log('Proceso de generación de reporte finalizado');
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Listado de Empleados</h2>
      
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">Seleccione los parámetros del Reporte</div>
            <div className="popup-content">
              <div className="select-container">
                <select 
                  value={selectedTipoPlanilla} 
                  onChange={(e) => setSelectedTipoPlanilla(e.target.value)}
                  className="select-input"
                  style={{ color: selectedTipoPlanilla === '' ? '#808080' : 'black' }}
                >
                  <option value="" disabled>Seleccione tipo de planilla</option>
                  {tiposPlanilla.map(tipo => (
                    <option key={tipo.ID_tipo} value={tipo.ID_tipo}>{tipo.Nombre}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="select-input"
                  style={{ color: selectedYear === '' ? '#808080' : 'black' }}
                >
                  <option value="" disabled>Seleccione año</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="select-input"
                  style={{ color: selectedMonth === '' ? '#808080' : 'black' }}
                >
                  <option value="" disabled>Seleccione mes</option>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
                
              </div>
              <button 
                onClick={handleGenerar} 
                disabled={!selectedYear || !selectedMonth || !selectedTipoPlanilla || isProcessing}
                className="submit-button"
              >
                {isProcessing ? 'Procesando...' : 'Generar Reporte'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {reporteData && (
        <div className="reporte-container">
          <h3>PLANILLA DE EMPLEADOS:</h3>
          <p>AÑO: {selectedYear}</p>
          <p>MES: {months[parseInt(selectedMonth) - 1]}</p>
          <p>TIPO DE PLANILLA: {tiposPlanilla.find(tipo => tipo.ID_tipo === parseInt(selectedTipoPlanilla))?.Nombre}</p>
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Salario</th>
                <th>Tot. Ingreso</th>
                <th>Tot. Descto</th>
                <th>Neto a pagar</th>
              </tr>
            </thead>
            <tbody>
              {reporteData.empleados.map((empleado, index) => (
                <tr key={index}>
                  <td>{empleado.nombres}</td>
                  <td>{empleado.apellidos}</td>
                  <td>{empleado.salario}</td>
                  <td>{empleado.totalIngreso}</td>
                  <td>{empleado.totalDescuento}</td>
                  <td>{empleado.netoAPagar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CrearReportePlanillaMensual;