// src/pages/ReportePedidos.tsx (Versión Optimizada)
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { format, parseISO } from "date-fns";
import { FaSearch, FaFilePdf, FaCalendarAlt, FaFilter, FaSyncAlt, FaSortAmountDownAlt, FaEye } from "react-icons/fa";
// Asumo que renombrarás el modal para que coincida con tu proyecto
import PedidoDetalleModal from "./DetallesPedidoModal"; 

// --- Tipos Adaptados a tu Modelo Pedido ---
interface Cliente {
  id: number;
  nombre: string; // Usando 'nombre' como en tu DB
}

interface Pedido {
  id: number;
  monto: number;
  fecha_pedido: string; // Usando 'fecha_pedido' como en tu DB
  cliente: Cliente;
}

// Interfaz unificada para los filtros de búsqueda
interface BusquedaState {
    empleado: string;
    cliente: string;
    filtroFecha: "rango" | "especifica";
    fechaInicio: string; // YYYY-MM-DD
    fechaFin: string; // YYYY-MM-DD
    fechaEspecifica: string; // YYYY-MM-DD
}

const ReportesVentas: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState<BusquedaState>({
    empleado: "",
    cliente: "",
    filtroFecha: "rango",
    fechaInicio: "",
    fechaFin: "",
    fechaEspecifica: ""
  });
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState<number | null>(null);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true);

  // --- Helpers ---
  const obtenerFechaYMD = (fecha: string | Date): string => {
    // Convierte a ISO y toma la fecha. Esto funciona bien si el backend maneja UTC.
    return new Date(fecha).toISOString().split("T")[0];
  };

  const API_URL = "/api/pedidos"; // Ajusta esta URL si es necesario

  // --- Fetch de Datos ---
  const fetchPedidos = useCallback(async () => {
    try {
      setCargando(true);
      // Usamos la ruta base de tu router para listar pedidos
      const response = await axios.get(API_URL); 
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);


  // --- Lógica de Filtrado (Memoizada) ---
  const filteredPedidos = useMemo(() => {
    let filtradas = [...pedidos];
    const { cliente, filtroFecha, fechaInicio, fechaFin, fechaEspecifica } = busqueda;

    // 1) Filtros de texto
    if (cliente) {
      const terminoCli = cliente.toLowerCase();
      // Usamos 'cliente.nombre' como en tu DB, no 'cliente.nombre_cliente'
      filtradas = filtradas.filter(p => p.cliente?.nombre.toLowerCase().includes(terminoCli)); 
    }

    // 2) Filtros de fecha
    if (filtroFecha === "rango" && (fechaInicio || fechaFin)) {
      const startYMD = fechaInicio || "0000-01-01";
      const endYMD = fechaFin || "9999-12-31";

      filtradas = filtradas.filter(p => {
        const pedidoYMD = obtenerFechaYMD(p.fecha_pedido);
        return pedidoYMD >= startYMD && pedidoYMD <= endYMD;
      });
    }

    if (filtroFecha === "especifica" && fechaEspecifica) {
      const especYMD = obtenerFechaYMD(fechaEspecifica);
      filtradas = filtradas.filter(p => obtenerFechaYMD(p.fecha_pedido) === especYMD);
    }

    return filtradas;
  }, [busqueda, pedidos]);

  // --- Total General ---
  const totalGeneral = useMemo(() => filteredPedidos.reduce((sum, p) => sum + p.monto, 0), [filteredPedidos]);


  // --- Manejo del Modal ---
  const abrirModal = (pedido: Pedido) => {
    setPedidoSeleccionadoId(pedido.id);
  };
  const cerrarModal = () => {
    setPedidoSeleccionadoId(null);
  };


  // --- Columnas de la Tabla (Memoizadas) ---
  const columnas: TableColumn<Pedido>[] = useMemo(() => [
    { id: "id", name: "ID", selector: (row) => row.id, sortable: true, center: true, width: "80px" },
    {
      id: "fecha",
      name: "Fecha",
      // Usamos parseISO para un sorting correcto.
      selector: (row) => parseISO(row.fecha_pedido).getTime(), 
      sortable: true,
      sortFunction: (a, b) => parseISO(a.fecha_pedido).getTime() - parseISO(b.fecha_pedido).getTime(),
      cell: (row) => (
        <div className="flex flex-col items-center">
          <span className="font-medium">{format(parseISO(row.fecha_pedido), "dd/MM/yyyy")}</span>
          <span className="text-xs text-gray-500">{format(parseISO(row.fecha_pedido), "HH:mm")}</span>
        </div>
      ),
      center: true,
    },
    // Usamos 'nombre' para el cliente
    { id: "cliente", name: "Cliente", selector: (row) => row.cliente?.nombre || "N/A", sortable: true, center: true }, 
    {
      id: "monto",
      name: "Monto",
      selector: (row) => row.monto,
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-green-700 bg-green-100 py-1 px-2 rounded-full">
          Bs. {row.monto.toFixed(2)}
        </span>
      ),
      center: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <button
          onClick={() => abrirModal(row)}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition flex items-center shadow hover:shadow-md"
          title="Ver Detalle"
        >
          <FaEye className="text-sm" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: "100px",
    },
  ], []);

  // --- Exportar PDF (Simplificado y adaptado a Pedidos) ---
  const handleDescargarPDF = (datos: Pedido[]) => {
    const doc = new jsPDF("landscape");
    const now = new Date();
    
    // Header
    doc.setFontSize(16).setFont("helvetica", "bold").text("Reporte de Pedidos General", 145, 20, { align: "center" });
    doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(100);
    doc.text(`Generado el: ${now.toLocaleDateString()} a las ${now.toLocaleTimeString()}`, 145, 30, { align: "center" });

    const tableData = datos.map((pedido) => [
      pedido.id,
      format(parseISO(pedido.fecha_pedido), "dd/MM/yyyy HH:mm"),
      pedido.cliente?.nombre || "N/A", // Usamos 'nombre'
      `Bs. ${pedido.monto.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["ID", "Fecha Pedido", "Empleado", "Cliente", "Monto"]],
      body: tableData,
      styles: { fontSize: 9, cellPadding: 3, halign: "center" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      theme: "grid",
      margin: { left: 15, right: 15 }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 40;
    const total = datos.reduce((sum, p) => sum + p.monto, 0);

    doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(0);
    doc.text(`TOTAL GENERAL: Bs. ${total.toFixed(2)}`, 275, finalY + 10, { align: "right" });

    doc.save(`Reporte_Pedidos_${now.toISOString().slice(0, 10)}.pdf`);
    // Opcional: Para abrir en una nueva pestaña (como en tu código original)
    // window.open(doc.output("bloburl"), "_blank");
  };


  // --- Función para actualizar el estado de búsqueda ---
  const handleBusquedaChange = (key: keyof BusquedaState, value: string | "rango" | "especifica") => {
    setBusqueda(prev => ({
        ...prev,
        [key]: value
    }));
  };

  const limpiarFiltros = () => {
    setBusqueda({
      empleado: "",
      cliente: "",
      filtroFecha: "rango",
      fechaInicio: "",
      fechaFin: "",
      fechaEspecifica: ""
    });
  };


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FaSortAmountDownAlt className="text-blue-200" />
                Reporte de Pedidos
              </h1>
              <p className="text-blue-100 mt-1">
                {filteredPedidos.length} {filteredPedidos.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FaFilter />
                {filtrosAbiertos ? "Ocultar Filtros" : "Mostrar Filtros"}
              </button>

              <button
                onClick={() => handleDescargarPDF(filteredPedidos)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium shadow hover:shadow-md"
              >
                <FaFilePdf className="text-red-500" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* --- Filtros --- */}
        {filtrosAbiertos && (
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              
              {/* Filtros de Texto */}
              <div className="space-y-4 md:col-span-2 lg:col-span-1">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <FaSearch className="text-blue-500" />
                  Búsqueda por Nombre
                </h3>
                <input
                    type="text"
                    placeholder="Buscar por Cliente"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={busqueda.cliente}
                    onChange={(e) => handleBusquedaChange("cliente", e.target.value)}
                  />
              </div>

              {/* Filtro de Fecha */}
              <div className="space-y-4 md:col-span-1 lg:col-span-2">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" />
                  Filtro por Fecha
                </h3>
                <select
                    value={busqueda.filtroFecha}
                    onChange={(e) => handleBusquedaChange("filtroFecha", e.target.value as "rango" | "especifica")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    <option value="rango">Rango de Fechas</option>
                    <option value="especifica">Fecha Específica</option>
                  </select>

                {busqueda.filtroFecha === "rango" ? (
                  <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        placeholder="Fecha Inicio"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={busqueda.fechaInicio}
                        onChange={(e) => handleBusquedaChange("fechaInicio", e.target.value)}
                      />
                      <input
                        type="date"
                        placeholder="Fecha Fin"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={busqueda.fechaFin}
                        onChange={(e) => handleBusquedaChange("fechaFin", e.target.value)}
                      />
                  </div>
                ) : (
                  <input
                    type="date"
                    placeholder="Fecha Específica"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={busqueda.fechaEspecifica}
                    onChange={(e) => handleBusquedaChange("fechaEspecifica", e.target.value)}
                  />
                )}
              </div>

              {/* Botón de Limpiar */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition font-medium w-full h-full"
                >
                  <FaSyncAlt />
                  Limpiar Filtros
                </button>
              </div>

            </div>
          </div>
        )}

        {/* --- Tabla y Totales --- */}
        <div className="p-6">
          <DataTable
            columns={columnas}
            data={filteredPedidos}
            pagination
            responsive
            // customStyles se puede mantener si lo necesitas, si no, puedes eliminarlo
            highlightOnHover
            striped
            defaultSortFieldId="fecha"
            defaultSortAsc={false}
            progressPending={cargando}
            progressComponent={
                <div className="py-12 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Cargando datos de pedidos...</p>
                </div>
            }
            noDataComponent={
                <div className="py-12 text-center">
                    <div className="bg-gray-100 p-6 rounded-xl inline-block">
                        <p className="text-gray-600 text-lg mb-4">
                            No se encontraron pedidos con los filtros aplicados
                        </p>
                        <button
                            onClick={limpiarFiltros}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                        >
                            <FaSyncAlt />
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            }
          />

          {/* Total General (Solo del reporte filtrado) */}
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xl font-bold text-gray-700">
                TOTAL DEL REPORTE:
              </span>
              <span className="text-2xl font-bold text-green-700 bg-green-100 px-4 py-2 rounded-full">
                Bs. {totalGeneral.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal de Detalles --- */}
      {pedidoSeleccionadoId && (
        <PedidoDetalleModal
          // Ahora enviamos solo el ID, para que el Modal haga la llamada GET /api/pedidos/:id/detalles
          pedidoId={pedidoSeleccionadoId} 
          onClose={cerrarModal}
        />
      )}
    </div>
  );
};

export default ReportesVentas;