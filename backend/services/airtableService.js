const Airtable = require('airtable');

const initAirtable = () => {
  if (!process.env.AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY no está configurada en las variables de entorno');
  }
  if (!process.env.AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_BASE_ID no está configurada en las variables de entorno');
  }

  console.log('Configurando Airtable...');
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
  });

  console.log('Airtable configurado exitosamente');
  return Airtable.base(process.env.AIRTABLE_BASE_ID);
};

let base;
try {
  base = initAirtable();
} catch (error) {
  console.error('Error al inicializar Airtable:', error.message);
  process.exit(1);
}

const getAllRecords = async (tableName, options = {}) => {
  console.log(`Obteniendo registros de la tabla ${tableName} con opciones:`, options);
  
  try {
    let queryParams = {};

    if (options.filterByFormula) {
      console.log(`Aplicando filtro: ${options.filterByFormula}`);
      queryParams.filterByFormula = options.filterByFormula;
    }

    console.log('Query params:', queryParams);

    const query = base(tableName).select(queryParams);
    console.log('Query creada:', query);

    const records = await query.all();
    
    console.log(`Registros obtenidos de ${tableName}:`, records.length);

    if (records.length === 0) {
      console.warn(`La tabla ${tableName} está vacía o no se encontraron registros que coincidan con el filtro.`);
      return [];
    }

    const formattedRecords = records.map(record => {
      return {
        id: record.id,
        ...record.fields
      };
    });

    console.log(`Registros formateados de ${tableName}:`, formattedRecords.length);
    return formattedRecords;
  } catch (error) {
    console.error(`Error al obtener registros de ${tableName}:`, error);
    console.error('Detalles del error:', JSON.stringify(error, null, 2));
    throw error;
  }
};

const crearRegistro = async (tableName, datos) => {
  try {
    const nuevoRegistro = await base(tableName).create([{ fields: datos }]);
    return {
      id: nuevoRegistro[0].id,
      ...nuevoRegistro[0].fields
    };
  } catch (error) {
    console.error(`Error al crear registro en ${tableName}:`, error);
    console.error('Detalles del error:', JSON.stringify(error, null, 2));
    throw error;
  }
};

const actualizarRegistro = async (tableName, id, datos) => {
  console.log(`Actualizando registro ${id} en la tabla ${tableName}...`);
  try {
    const registroActualizado = await base(tableName).update(id, datos);
    console.log(`Registro ${id} actualizado exitosamente en la tabla ${tableName}`);
    return {
      id: registroActualizado.id,
      ...registroActualizado.fields
    };
  } catch (error) {
    console.error(`Error al actualizar registro en ${tableName}:`, error);
    console.error('Detalles del error:', JSON.stringify(error, null, 2));
    throw error;
  }
};

const eliminarRegistro = async (tableName, id) => {
  console.log(`Eliminando registro ${id} de la tabla ${tableName}...`);
  try {
    await base(tableName).destroy(id);
    console.log(`Registro ${id} eliminado exitosamente de la tabla ${tableName}`);
  } catch (error) {
    console.error(`Error al eliminar registro de ${tableName}:`, error);
    console.error('Detalles del error:', JSON.stringify(error, null, 2));
    throw error;
  }
};

module.exports = {
  getAllRecords,
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro
};