import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { FaFilePdf, FaCalendarAlt, FaSortAmountDownAlt, FaSyncAlt } from "react-icons/fa";
import { format, startOfMonth, endOfMonth } from "date-fns"; 

// --- Tipos para el Reporte ---
interface ProductoVendido {
    producto_id: number;
    producto_nombre: string;
    total_cantidad_vendida: number;
    total_monto_vendido: number;
}

// URL base de la API (Asegúrate de que coincida con tu configuración)
const API_URL = "/api/productos"; 

const ReporteProductos: React.FC = () => {
    
    const now = new Date();
    const defaultStartDate = format(startOfMonth(now), 'yyyy-MM-dd');
    const defaultEndDate = format(endOfMonth(now), 'yyyy-MM-dd');

    // --- ESTADOS ---
    const [datosReporte, setDatosReporte] = useState<ProductoVendido[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fechaInicio, setFechaInicio] = useState(defaultStartDate); 
    const [fechaFin, setFechaFin] = useState(defaultEndDate);
    const [reporteGenerado, setReporteGenerado] = useState(false); 
    const [usarFiltros, setUsarFiltros] = useState(true);
    const [periodoReporteTexto, setPeriodoReporteTexto] = useState('');


    // --- Lógica de Fetch de Datos ---
    const fetchReporte = useCallback(async () => {
        let url = `${API_URL}/reporte-vendidos`;
        let periodoTemp = "TODO EL HISTORIAL";
        
        if (usarFiltros) {
            if (!fechaInicio || !fechaFin) {
                setError("Debe seleccionar un rango de fechas.");
                setDatosReporte([]);
                setReporteGenerado(false);
                setPeriodoReporteTexto('');
                return;
            }
            url = `${API_URL}/reporte-vendidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            periodoTemp = `${fechaInicio} al ${fechaFin}`;
        }
        
        try {
            setCargando(true);
            setError(null);
            
            const response = await axios.get(url);
            setDatosReporte(response.data);
            setReporteGenerado(true);
            setPeriodoReporteTexto(periodoTemp);
        } catch (err: any) {
            console.error("Error al obtener reporte:", err);
            setError("Error al cargar los datos del reporte. Verifique la conexión con el backend o las asociaciones de Sequelize.");
            setDatosReporte([]);
        } finally {
            setCargando(false);
        }
    }, [usarFiltros, fechaInicio, fechaFin]);

    // --- Carga Automática al Montar el Componente ---
    useEffect(() => {
        fetchReporte();
    }, [fetchReporte]); 

    const restablecerFiltros = () => {
        setUsarFiltros(true);
        setFechaInicio(defaultStartDate);
        setFechaFin(defaultEndDate);
    };

    const handleToggleFiltros = () => {
        const newState = !usarFiltros;
        setUsarFiltros(newState);
        
        if (!newState) {
            setFechaInicio('');
            setFechaFin('');
        } else {
            setFechaInicio(defaultStartDate);
            setFechaFin(defaultEndDate);
        }
    };


    // --- Columnas de la Tabla (LÓGICA DE RANKING MODIFICADA) ---
    const columnas: TableColumn<ProductoVendido>[] = useMemo(() => [
        {
            name: "Rank", 
            sortable: false, 
            width: "100px",
            center: true,
        //cell: (row, index) => {
            cell: (_, index) => {
                const rank = index + 1;
                
                // 💡 LÓGICA MODIFICADA: Primeros 3 con fuego
                if (rank <= 3) {
                    return (
                        <span className="text-xl" title={`Top ${rank}`}>
                            🔥 <span className={`font-bold ${rank === 1 ? 'text-red-600' : 'text-orange-500'}`}>#{rank}</span>
                        </span>
                    );
                }
                // 💡 LÓGICA MODIFICADA: Posiciones 4 y 5 en verde
                if (rank <= 6) {
                    return (
                        <span className="font-bold text-lg text-green-600">
                            #{rank}
                        </span>
                    );
                }
                // Los demás (rank > 5) sin formato especial
                return (
                    <span className="text-gray-500">
                        #{rank}
                    </span>
                );
            },
        },
        {
            name: "Producto",
            selector: (row) => row.producto_nombre,
            sortable: true,
            grow: 2,
        },
        {
            name: "Cantidad Vendida",
            selector: (row) => row.total_cantidad_vendida,
            sortable: true,
            right: true,
            sortFunction: (a, b) => a.total_cantidad_vendida - b.total_cantidad_vendida, 
            cell: (row) => (
                <span className="font-semibold text-blue-700 bg-blue-100 py-1 px-3 rounded-full">
                    {row.total_cantidad_vendida} Unidades
                </span>
            ),
        },
        {
            name: "Monto Total (Bs.)",
            selector: (row) => row.total_monto_vendido,
            sortable: true,
            right: true,
            sortFunction: (a, b) => a.total_monto_vendido - b.total_monto_vendido, 
            cell: (row) => (
                <span className="font-bold text-green-700">
                    Bs. {row.total_monto_vendido.toFixed(2)}
                </span>
            ),
        },
    ], []);

    // --- Exportar PDF (Sin cambios relevantes) ---
    const handleDescargarPDF = () => {
        if (datosReporte.length === 0) return;

        const doc = new jsPDF("p");
        const now = new Date();
        
        doc.setFontSize(16).setFont("helvetica", "bold").text("Reporte de Productos Más Vendidos", 105, 15, { align: "center" });
        doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(100);
        doc.text(`Período: ${periodoReporteTexto}`, 105, 22, { align: "center" }); 
        doc.text(`Generado el: ${format(now, 'dd/MM/yyyy HH:mm')}`, 105, 27, { align: "center" });

        const tableData = datosReporte.map((producto, index) => [
            `#${index + 1}`, // Rank basado en la posición
            producto.producto_nombre,
            producto.total_cantidad_vendida.toString(),
            `Bs. ${producto.total_monto_vendido.toFixed(2)}`,
        ]);

        autoTable(doc, {
            startY: 35,
            head: [["Rank", "Producto", "Cant. Vendida", "Monto Total"]],
            body: tableData,
            styles: { fontSize: 9, cellPadding: 3, halign: "center" },
            headStyles: { fillColor: [0, 100, 200], textColor: 255, fontStyle: "bold" },
            theme: "grid",
        });

        doc.save(`Reporte_Mas_Vendidos_${usarFiltros ? `${fechaInicio}_a_${fechaFin}` : 'HistorialCompleto'}.pdf`);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-5 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <FaSortAmountDownAlt className="text-teal-200" />
                        Productos Más Vendidos (TOP)
                    </h1>
                </div>

                {/* --- Filtros --- */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-4">
                        <FaCalendarAlt className="text-teal-500" />
                        Opciones de Período
                    </h3>

                    {/* Checkbox para alternar filtros */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <input
                            type="checkbox"
                            id="usarFiltros"
                            checked={usarFiltros}
                            onChange={handleToggleFiltros}
                            className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor="usarFiltros" className="font-medium text-gray-700">
                            {usarFiltros 
                                ? "Aplicar filtro por rango de fechas" 
                                : "Mostrar todo el historial (sin límite de fecha)"}
                        </label>
                    </div>

                    {/* Inputs de fecha (se muestran solo si usarFiltros es true) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {usarFiltros && (
                            <>
                                <input
                                    type="date"
                                    placeholder="Fecha Inicio"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                />
                                <input
                                    type="date"
                                    placeholder="Fecha Fin"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                            </>
                        )}
                        
                        {/* Botón Generar Reporte */}
                        <button
                            onClick={fetchReporte}
                            disabled={cargando || (usarFiltros && (!fechaInicio || !fechaFin))}
                            className="px-4 py-3 bg-teal-600 text-white rounded-lg flex items-center justify-center gap-2 transition font-medium w-full hover:bg-teal-700 disabled:bg-gray-400"
                            style={{ gridColumn: usarFiltros ? 'span 1' : 'span 2' }}
                        >
                            <FaSortAmountDownAlt />
                            {cargando ? "Generando..." : (usarFiltros ? "Generar Reporte" : "Mostrar Historial Completo")}
                        </button>
                        
                        {/* Botón Restablecer */}
                        <button
                            onClick={restablecerFiltros}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition font-medium w-full"
                        >
                            <FaSyncAlt />
                            Restablecer a mes actual
                        </button>
                    </div>
                </div>

                {/* --- Tabla y Resultados --- */}
                {error && <div className="p-4 text-red-600 text-center font-medium">{error}</div>}

                {reporteGenerado && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-600">
                                Período del Reporte: <span className="font-bold text-teal-700">{periodoReporteTexto}</span>
                            </p>
                            
                            <button
                                onClick={handleDescargarPDF}
                                disabled={datosReporte.length === 0}
                                className="bg-white text-teal-600 border border-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium shadow hover:bg-teal-50 disabled:opacity-50"
                            >
                                <FaFilePdf />
                                Exportar PDF
                            </button>
                        </div>
                        
                        <DataTable
                            columns={columnas}
                            data={datosReporte}
                            pagination
                            responsive
                            highlightOnHover
                            striped
                            defaultSortFieldId={3} 
                            defaultSortAsc={false}
                            progressPending={cargando}
                            noDataComponent={
                                <div className="py-12 text-center text-gray-500">
                                    No se registraron ventas para ningún producto en el período seleccionado.
                                </div>
                            }
                        />

                        {/* Total de ventas del periodo */}
                        <div className="mt-6 p-5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100 shadow-sm">
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-xl font-bold text-gray-700">
                                    MONTO TOTAL VENDIDO EN ESTE PERÍODO:
                                </span>
                                <span className="text-2xl font-bold text-green-700 bg-green-100 px-4 py-2 rounded-full">
                                    Bs. {datosReporte.reduce((sum, p) => sum + p.total_monto_vendido, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReporteProductos;