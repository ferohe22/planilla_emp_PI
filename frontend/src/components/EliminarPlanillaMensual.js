import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EliminarPlanillaMensual() {
  const [tiposPlanilla, setTiposPlanilla] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Cargar tipos de planilla desde la API
    setIsLoading(true);
    setError(null);
    axios.get('http://localhost:5001/api/tipos-planilla')
      .then(response => {
        console.log('Tipos de planilla cargados:', response.data);
        // Ordenar los tipos de planilla por ID_tipo
        const tiposOrdenados = response.data.sort((a, b) => a.ID_tipo - b.ID_tipo);
        setTiposPlanilla(tiposOrdenados);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar tipos de planilla:', error);
        setError('Error al cargar los tipos de planilla. Por favor, intente de nuevo más tarde.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        // Cerrar completamente el popup y reiniciar todos los estados
        setShowPopup(false);
        setIsCompleted(false);
        setIsProcessing(false);
        setSelectedTipo('');
        setSelectedYear('');
        setSelectedMonth('');
        setMessage('');
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleEliminar = async () => {
    setIsProcessing(true);
    setShowPopup(false);
    setError(null);
    setMessage('');

    const requestData = {
      tipo: parseInt(selectedTipo, 10),
      anio: parseInt(selectedYear, 10),
      mes: parseInt(selectedMonth, 10)
    };

    console.log('Datos a enviar:', requestData);

    try {
      const response = await axios.delete('http://localhost:5001/api/planilla-mensual/eliminar', { data: requestData });
      console.log('Respuesta del servidor:', response.data);
      setMessage(response.data.message);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error al eliminar la planilla:', error);
      if (error.response) {
        console.error('Respuesta de error del servidor:', error.response.data);
        setError(`Error al eliminar la planilla: ${error.response.data.message}`);
      } else {
        setError('Error al eliminar la planilla. Por favor, intente de nuevo más tarde.');
      }
    }

    setIsProcessing(false);
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2>Eliminación de Planilla Mensual</h2>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">Seleccione los parámetros de la Planilla a Eliminar</div>
            <div className="popup-content">
              <div className="select-container">
                <select 
                  value={selectedTipo} 
                  onChange={(e) => setSelectedTipo(e.target.value)}
                  className="select-input"
                  style={{ color: selectedTipo === '' ? '#808080' : 'black' }}
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
                onClick={handleEliminar} 
                disabled={!selectedTipo || !selectedYear || !selectedMonth}
                className="submit-button"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">Procesando...</div>
            <div className="popup-content">
              <p>Por favor espere mientras se elimina la planilla.</p>
            </div>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">Proceso terminado</div>
            <div className="popup-content">
              {message && <p>{message}</p>}
              <p>Presione la tecla ESC para cerrar esta ventana.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EliminarPlanillaMensual;