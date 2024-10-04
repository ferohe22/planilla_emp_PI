import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import EmployeeTab from './components/EmployeeTab';
import BasicoTab from './components/BasicoTab';
import FondoPensionTab from './components/FondoPensionTab';
import CrearPlanillaMensual from './components/CrearPlanillaMensual';
import ModificarPlanillaMensual from './components/ModificarPlanillaMensual';
import EliminarPlanillaMensual from './components/EliminarPlanillaMensual';
import CrearReportePlanillaMensual from './components/crearReportePlanillaMensual';

function App() {
  const [selectedOption, setSelectedOption] = useState('');

  const renderContent = () => {
    switch(selectedOption) {
      case 'Empleados':
        return <EmployeeTab />;
      case 'Basico':
        return <BasicoTab />;
      case 'Fondos de Pension':
        return <FondoPensionTab />;
      case 'CrearPlanillaMensual':
        return <CrearPlanillaMensual />;
      case 'ModificarPlanillaMensual':
        return <ModificarPlanillaMensual />;
      case 'EliminarPlanillaMensual':
        return <EliminarPlanillaMensual />;
      case 'Listado de empleados':
        return <CrearReportePlanillaMensual />;
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src="/logo.png" alt="Logo" className="app-logo" />
        <h1 className="app-title">Sistema de Planillas - Proinnovate</h1>
      </header>
      <div className="app-content">
        <Sidebar setSelectedOption={setSelectedOption} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
