const calcularSalarioNeto = (salarioBruto, deducciones) => {
    return salarioBruto - deducciones;
  };
  
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const generarCodigoEmpleado = (nombre, apellido, id) => {
    const iniciales = nombre.charAt(0) + apellido.charAt(0);
    const numeroAleatorio = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${iniciales}${id}${numeroAleatorio}`.toUpperCase();
  };
  
  module.exports = {
    calcularSalarioNeto,
    formatearFecha,
    generarCodigoEmpleado
  };