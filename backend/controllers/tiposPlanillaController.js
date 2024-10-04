const airtableService = require('../services/airtableService');

const tiposPlanillaController = {
    getAllTiposPlanilla: async (req, res) => {
        try {
            const tiposPlanilla = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_TIPO_PLANILLA);
            
            // Transformar los datos si es necesario
            const formattedTiposPlanilla = tiposPlanilla.map(record => {
                //console.log('Procesando registro:', JSON.stringify(record, null, 2));

                if (!record || typeof record !== 'object') {
                    console.warn('Registro inválido encontrado');
                    return null;
                }

                if (!record.ID_tipo) {
                    console.warn(`Registro sin ID_tipo encontrado: ${JSON.stringify(record)}`);
                }

                if (!record.Nombre) {
                    console.warn(`Registro sin Nombre encontrado: ${JSON.stringify(record)}`);
                }

                return {
                    ID_tipo: record.ID_tipo || "ID no disponible",
                    Nombre: record.Nombre || "Sin nombre"
                };
            }).filter(Boolean); // Eliminar los registros nulos


            res.json(formattedTiposPlanilla);
        } catch (error) {
            console.error('Error al obtener los tipos de planilla:', error);
            res.status(500).json({ message: "Error al obtener los tipos de planilla", error: error.message });
        }
    }
};

module.exports = tiposPlanillaController;
