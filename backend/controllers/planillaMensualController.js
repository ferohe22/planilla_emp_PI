const airtableService = require('../services/airtableService');

console.log('Controlador de planilla mensual cargado');

const planillaMensualController = {
    crearPlanillaMensual: async (req, res) => {
        try {
            const { año, mes, ID_tipo } = req.body;
            const añoNumerico = parseInt(año, 10);
            const mesNumerico = parseInt(mes, 10);
            const idTipoNumerico = parseInt(ID_tipo, 10);
            
            if (!idTipoNumerico) {
                throw new Error('ID_tipo no proporcionado o inválido en la solicitud');
            }

            // Obtener todos los empleados
            let empleados;
            try {
                empleados = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_EMPLEADOS);

                if (empleados.length > 0) {

                } else {

                    return res.status(404).json({ message: "No se encontraron empleados en la base de datos." });
                }
            } catch (error) {
                console.error('Error al obtener empleados:', error);
                return res.status(500).json({ message: "Error al obtener empleados de la base de datos", error: error.message });
            }


            // Obtener todos los tipos de planilla
            let tiposPlanilla;
            try {
                tiposPlanilla = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_TIPO_PLANILLA);

            } catch (error) {
                console.error('Error al obtener tipos de planilla:', error);
                return res.status(500).json({ message: "Error al obtener tipos de planilla", error: error.message });
            }
            const tiposPlanillaMap = new Map(
                tiposPlanilla.map(tipo => [
                  tipo.ID_tipo ? tipo.ID_tipo.toString() : '',  // Clave: ID_tipo convertido a string
                  tipo.Nombre ? tipo.Nombre.toString() : ''  // Valor: Nombre convertido a string
                ])
              );
            
            const empleadosFiltrados = empleados.filter(empleado => {
                if (typeof empleado.id_tip_planilla !== 'number') {
                    console.warn(`El empleado ${empleado.id_emp} no tiene un id_tip_planilla válido.`);
                    return false;  // Excluir empleados sin un id_tip_planilla válido
                }
                // Convertir id_tip_planilla a string para comparar con el Map
                const empleadoTipoPlanilla = empleado.id_tip_planilla.toString();
                return empleadoTipoPlanilla === idTipoNumerico.toString();
            });
            
            // Obtener todos los salarios
            let salarios;
            try {
                salarios = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_SALARIO_EMP);
            } catch (error) {
                console.error('Error al obtener salarios:', error);
                return res.status(500).json({ message: "Error al obtener salarios", error: error.message });
            }

            // Obtener todos los fondos de pensión de empleados
            let fondoPensionEmpleados;
            try {
                fondoPensionEmpleados = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_FONDO_EMP);
            } catch (error) {
                console.error('Error al obtener fondos de pensión:', error);
                return res.status(500).json({ message: "Error al obtener fondos de pensión", error: error.message });
            }

            // Obtener todos los fondos
            let fondos;
            try {
                fondos = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_FONDOS);
            } catch (error) {
                console.error('Error al obtener fondos:', error);
                return res.status(500).json({ message: "Error al obtener fondos", error: error.message });
            }

            // Obtener todos los aumentos
            let aumentos;
            try {
                aumentos = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_AUMENTOS);
            } catch (error) {
                console.error('Error al obtener aumentos:', error);
                return res.status(500).json({ message: "Error al obtener aumentos", error: error.message });
            }


            // Verificar los datos de aumentos
            console.log('Aumentos:', aumentos);
            
            const totalAumentos = aumentos
                .filter(a => {
                console.log(`Aumento ID: ${a.id_aumentos}, Estado: ${a.estado}`);  // Log para inspeccionar el estado de cada aumento
                return a.estado === 1;  // Filtrar aumentos activos
            })
                .reduce((sum, a) => {
                console.log(`Sumando monto del aumento: ${a.monto}`);
                return sum + parseFloat(a.monto || 0);
            }, 0);

            console.log('Total de aumentos:', totalAumentos);
            

            // Obtener todos los aguinaldos
            let aguinaldos;
            try {
                aguinaldos = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_AGUINALDO);
            } catch (error) {
                console.error('Error al obtener aguinaldos:', error);
                return res.status(500).json({ message: "Error al obtener aguinaldos", error: error.message });
            }

            // Detrminar suspension de renta
            let susp_renta;
            try {
                susp_renta = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_SUSP_RENTA);
            } catch (error) {
                console.error('Error al obtener susp_renta:', error);
                return res.status(500).json({ message: "Error al obtener susp_renta", error: error.message });
            }

            // Crear registros de planilla mensual para cada empleado filtrado
            const planillaMensual = await Promise.all(empleadosFiltrados.map(async (empleado) => {
                const salarioEmpleado = salarios.find(s => s.id_emp === empleado.id_emp);
                const fondoPensionEmpleado = fondoPensionEmpleados.find(f => f.id_emp === empleado.id_emp);
                
                if (!salarioEmpleado) {
                    console.warn(`No se encontró salario para el empleado ${empleado.id_emp} (${empleado.Nombres} ${empleado.Apellidos})`);
                    return null;
                }

                if (!fondoPensionEmpleado) {
                    console.warn(`No se encontró fondo de pensión para el empleado ${empleado.id_emp} (${empleado.Nombres} ${empleado.Apellidos})`);
                    return null;
                }

                const fondoInfo = fondos.find(f => f.id_fondo === fondoPensionEmpleado.id_fondo);

                if (!fondoInfo) {
                    console.warn(`No se encontró información del fondo para el empleado ${empleado.id_emp} (${empleado.Nombres} ${empleado.Apellidos})`);
                    return null;
                }

                const salarioBruto = parseFloat(salarioEmpleado.salario_bruto);

                // Calcular aguinaldo
                let aguinaldo = 0;
                if (mesNumerico === 7 || mesNumerico === 12) {
                    const aguinaldoMes = aguinaldos.find(a => 
                        a.estado === 1 && 
                        ((mesNumerico === 7 && a.nombre === "Julio") ||
                         (mesNumerico === 12 && a.nombre === "Diciembre"))
                    );
                    if (aguinaldoMes) {
                        aguinaldo = parseFloat(aguinaldoMes.monto || 0);
                    } else {
                        console.log(`No se encontró aguinaldo para el mes ${mesNumerico}`);
                    }
                }

                const suspRentaRegistro = susp_renta.find(registro => {
                    // Verificar si el registro tiene un id_emp válido
                    if (!registro.id_emp || !Array.isArray(registro.id_emp)) {
                        console.warn(`El registro en la tabla susp_renta no tiene un id_emp válido o no es un array: ${registro.id_emp}`);
                        return false;
                    }
                
                    // Extraer el ID de Airtable del empleado desde el array en tab_susp_renta
                    const idAirtableEmp = registro.id_emp[0];  // Suponemos que solo hay un ID en el array
                
                    // Log para verificar qué id_emp está en el registro
                    console.log(`ID en tab_susp_renta: ${idAirtableEmp}`);
                
                    // Obtener el registro completo del empleado usando el ID de Airtable del empleado
                    const empleadoRelacionado = empleados.find(emp => emp.id === idAirtableEmp);
                
                    if (empleadoRelacionado) {
                        console.log(`Empleado encontrado: ${empleadoRelacionado.Nombres} ${empleadoRelacionado.Apellidos}, id_emp: ${empleadoRelacionado.id_emp}`);
                
                        // Comparamos el id_emp numérico del empleado con el id_emp actual del empleado que estamos procesando
                        const idEmpRelacionado = parseInt(empleadoRelacionado.id_emp);
                        const idEmpActual = parseInt(empleado.id_emp);
                
                        if (idEmpRelacionado === idEmpActual) {
                            console.log(`ID coincidente: ${idEmpRelacionado}`);
                            return true;
                        } else {
                            console.log(`ID no coincidente: ${idEmpRelacionado} !== ${idEmpActual}`);
                            return false;
                        }
                    } else {
                        console.warn(`No se encontró el empleado con id_emp vinculado en la tabla empleados para el id de Airtable: ${idAirtableEmp}`);
                        return false;
                    }
                });
                
                if (suspRentaRegistro) {
                    console.log('El empleado no paga impuesto a la renta en los meses registrados.');
                } else {
                    console.log('El empleado paga impuesto a la renta.');
                }
                
                

                let pagaImpuestoRenta = true;  // Asumir que el empleado paga renta por defecto

                if (suspRentaRegistro) {
                    // Convertir el mes actual (mesNumerico) a nombre
                    const mesActual = convertirMesANombre(mesNumerico);

                    console.log(`El mes es: ${mesActual}`);

                    // Verificar si el mes actual está en la lista de meses donde no paga renta
                    if (suspRentaRegistro.mes.includes(mesActual)) {
                        pagaImpuestoRenta = false;
                        console.log(`El empleado ${empleado.Nombres} ${empleado.Apellidos} no paga impuesto a la renta en el mes ${mesActual}`);
                    }
                }
                // Función para convertir el número del mes a su nombre
                function convertirMesANombre(mesNumerico) {
                    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                    return meses[mesNumerico - 1];  // Restamos 1 porque los meses en arrays empiezan en 0
                }


                const ingresos = salarioBruto + totalAumentos;
                
                // Calcular el impuesto a la renta solo si el empleado paga impuesto
                let impuesto_Renta = 0;
                if (pagaImpuestoRenta) {
                    impuesto_Renta = (ingresos + aguinaldo) * 0.08;  // Función para calcular el impuesto
                }

                
                const dsctoFondo = ingresos * (parseFloat(fondoInfo.pct_fondo));
                const dsctoComision = ingresos * (parseFloat(fondoInfo.pct_comision));
                const dsctoSeguro = ingresos * (parseFloat(fondoInfo.pct_seguro));
                const impuestoRenta = impuesto_Renta
                const descuentos = dsctoFondo + dsctoComision + dsctoSeguro + impuestoRenta;
                const remuneracion = ingresos + aguinaldo - descuentos;

                const nuevoRegistro = {
                    año_planilla: añoNumerico,
                    mes_planilla: mesNumerico,
                    id_tip_planilla: empleado.id_tip_planilla,
                    apell_emp: empleado.Apellidos,
                    nom_emp: empleado.Nombres,
                    dias_mes: 30,
                    salario_bruto: salarioBruto,
                    dscto_fondo: dsctoFondo,
                    dscto_comision: dsctoComision,
                    dscto_seguro: dsctoSeguro,
                    aumentos: totalAumentos,
                    aguinaldo: aguinaldo,
                    total_ingresos: ingresos,
                    total_descuentos: descuentos,
                    neto_pagar: remuneracion,
                    impuesto_renta: impuestoRenta,
                };

                try {
                    const resultado = await airtableService.crearRegistro(process.env.AIRTABLE_TABLE_NAME_PLAN_MENSUAL, nuevoRegistro);
                    return resultado;
                } catch (error) {
                    console.error(`Error al crear registro para el empleado ${empleado.id_emp}:`, error);
                    return null;
                }
            }));

            // Filtrar los registros nulos (empleados sin salario, fondo de pensión o errores)
            const planillaFiltrada = planillaMensual.filter(registro => registro !== null);

            console.log(`Se crearon ${planillaFiltrada.length} registros de planilla mensual`);

            if (planillaFiltrada.length === 0) {
                return res.status(404).json({ message: "No se pudo crear ningún registro de planilla mensual." });
            }

            res.json({ 
                message: "Planilla mensual creada con éxito", 
                planillaMensual: planillaFiltrada,
                totalEmpleados: empleadosFiltrados.length,
                totalRegistrosCreados: planillaFiltrada.length
            });
        } catch (error) {
            console.error('Error al crear la planilla mensual:', error);
            res.status(500).json({ message: "Error al crear la planilla mensual", error: error.message });
        }
    },

    generarReporteEmpleados: async (req, res) => {
        try {
            console.log('Iniciando generación de reporte de empleados');
            const { año, mes, id_tip_planilla } = req.body;
            const añoNumerico = parseInt(año, 10);
            const mesNumerico = parseInt(mes, 10);
            const idTipoPlanillaNumerico = parseInt(id_tip_planilla, 10);

            console.log('Datos recibidos para generar reporte:');
            console.log('Año:', añoNumerico);
            console.log('Mes:', mesNumerico);
            console.log('ID Tipo Planilla:', idTipoPlanillaNumerico);

            if (isNaN(añoNumerico) || isNaN(mesNumerico) || isNaN(idTipoPlanillaNumerico)) {
                console.log('Error: Año, mes o tipo de planilla inválidos');
                return res.status(400).json({ message: "Año, mes o tipo de planilla inválidos" });
            }

            console.log('Preparando filtro para Airtable');
            const filtro = `AND({año_planilla} = ${añoNumerico}, {mes_planilla} = ${mesNumerico}, {id_tip_planilla} = ${idTipoPlanillaNumerico})`;
            console.log('Filtro preparado:', filtro);

            console.log('Obteniendo registros de la planilla mensual');
            const planillaMensual = await airtableService.getAllRecords(process.env.AIRTABLE_TABLE_NAME_PLAN_MENSUAL, {
                filterByFormula: filtro
            });

            console.log('Registros encontrados:', planillaMensual.length);

            if (planillaMensual.length === 0) {
                console.log('No se encontraron registros para los parámetros especificados');
                return res.status(404).json({ message: "No se encontraron registros para el año, mes y tipo de planilla especificados" });
            }

            console.log('Formateando datos de empleados');
            const empleados = planillaMensual.map(registro => {
                console.log('Procesando registro:', registro.id);
                return {
                    nombres: registro.nom_emp,
                    apellidos: registro.apell_emp,
                    id_tip_planilla: registro.id_tip_planilla,
                    salario: registro.salario_bruto,
                    totalIngreso: registro.total_ingresos,
                    totalDescuento: registro.total_descuentos,
                    netoAPagar: registro.neto_pagar
                };
            });

            console.log('Empleados formateados:', empleados.length);

            console.log('Preparando respuesta JSON');
            const respuesta = {
                año: añoNumerico,
                mes: mesNumerico,
                id_tip_planilla: idTipoPlanillaNumerico,
                empleados: empleados
            };

            console.log('Enviando respuesta');
            res.json(respuesta);

        } catch (error) {
            console.error('Error al generar el reporte de empleados:', error);
            res.status(500).json({ message: "Error al generar el reporte de empleados", error: error.message });
        }
    }
};

module.exports = planillaMensualController;