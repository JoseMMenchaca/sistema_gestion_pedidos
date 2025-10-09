// src/components/modals/ModalDetallePedido.tsx (Versión Optimizada)
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

interface PedidoDetalle {
    id: number;
    cantidad: number;
    precio_unitario: number; // Usamos precio_unitario (de tu DB)
    // El monto total por detalle es cantidad * precio_unitario, lo calcularemos
    producto: {
        id: number;
        nombre: string;
    };
    notas_adicionales: string; // Incluimos esta columna que tienes en tu DB
}

interface PedidoInfo {
    id: number;
    monto: number; // Mantenemos el monto total del pedido
    fecha_pedido: string;
    cliente: {
        id: number;
        nombre: string; // Usamos 'nombre' como en tu DB
    };
    pedido_detalles: PedidoDetalle[]; // Usamos 'pedido_detalles'
    metodo_pago: string; // Usamos 'metodo_pago' (de tu DB)
    estado: string; // Usamos 'estado' (de tu DB)
    // omitimos tipoVenta y tipoEntrega ya que no están en tu esquema DB Pedidos
}


const ModalDetallePedido: React.FC<{
    // Renombramos a pedidoId para claridad
    pedidoId: number; 
    onClose: () => void
}> = ({ pedidoId, onClose }) => {
    const [pedidoInfo, setPedidoInfo] = useState<PedidoInfo | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerDetallePedido = async () => {
            try {
                setCargando(true);
                // Usamos la ruta de tu router: /api/pedidos/:id/detalles
                const API_URL = `/api/pedidos/${pedidoId}/detalles`; 
                const response = await axios.get(API_URL);
                
                // NOTA IMPORTANTE: La respuesta de tu backend debe mapear a la interfaz PedidoInfo.
                // Asegúrate que tu controlador verPedidoDetalles devuelva el objeto con .cliente y .pedido_detalles
                setPedidoInfo(response.data); 
            } catch (error) {
                console.error("Error al obtener detalle de pedido:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerDetallePedido();
    }, [pedidoId]);

    // Usamos el monto ya calculado y guardado en la DB, pero si deseas recalcular:
    const totalCalculado = pedidoInfo?.pedido_detalles.reduce(
        (sum, detalle) => sum + (detalle.cantidad * detalle.precio_unitario), 0
    ) || 0;


    // --- Generación de PDF (Simplificada) ---
    const descargarPDFDetalle = () => {
        if (!pedidoInfo) return;

        const doc = new jsPDF();
        const fechaPedido = new Date(pedidoInfo.fecha_pedido);
        const fechaGeneracion = new Date();

        // Encabezado
        doc.setFontSize(16).setFont("helvetica", "bold").text("Detalle de Pedido", 105, 15, { align: "center" });
        doc.setDrawColor(41, 128, 185).setLineWidth(0.5).line(15, 20, 195, 20);

        // Información General
        doc.setFontSize(10).setTextColor(0).setFont("helvetica", "bold");
        doc.text(`Pedido #${pedidoInfo.id}`, 20, 30);
        doc.setFont("helvetica", "normal");
        doc.text(`Cliente: ${pedidoInfo.cliente?.nombre || "N/A"}`, 20, 35);
        doc.text(`Fecha: ${fechaPedido.toLocaleDateString('es-ES')} ${fechaPedido.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`, 20, 40);
        doc.text(`Método de Pago: ${pedidoInfo.metodo_pago || "N/A"}`, 100, 35);
        doc.text(`Estado: ${pedidoInfo.estado || "N/A"}`, 100, 40);


        // Tabla de productos
        autoTable(doc, {
            startY: 50,
            head: [["Producto", "Notas", "Cantidad", "P. Unitario", "Subtotal"]],
            body: pedidoInfo.pedido_detalles.map(detalle => [
                detalle.producto?.nombre || "N/A",
                detalle.notas_adicionales || "Ninguna",
                detalle.cantidad.toString(),
                `Bs. ${detalle.precio_unitario.toFixed(2)}`,
                `Bs. ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}`
            ]),
            styles: { fontSize: 9, cellPadding: 3, halign: 'center' },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            columnStyles: { 0: { halign: 'left', cellWidth: 50 }, 1: { halign: 'left', cellWidth: 50 }, 2: { cellWidth: 20 }, 3: { cellWidth: 35 }, 4: { cellWidth: 35 } },
            theme: 'grid'
        });

        // Total
        const finalY = (doc as any).lastAutoTable?.finalY || 50;
        doc.setFontSize(12).setFont("helvetica", "bold");
        doc.text(`TOTAL PEDIDO: Bs. ${pedidoInfo.monto.toFixed(2)}`,
            190, finalY + 10, { align: "right" });

        // Pie de página
        doc.setFontSize(8).setFont("helvetica", "normal").setTextColor(100);
        doc.text(`Generado: ${fechaGeneracion.toLocaleDateString()} ${fechaGeneracion.toLocaleTimeString()}`,
            195, 290, { align: "right" });

        doc.save(`Detalle_Pedido_${pedidoInfo.id}_${fechaPedido.toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Detalle de Pedido #{pedidoId}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ✖
                        </button>
                    </div>

                    {cargando ? (
                        <div className="text-center py-10">Cargando detalles...</div>
                    ) : !pedidoInfo ? (
                        <div className="text-center py-10 text-red-500">No se encontró información del pedido.</div>
                    ) : (
                        <div>
                            {/* Información General */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                                <p className="font-semibold text-gray-700">Cliente:</p>
                                <p>{pedidoInfo.cliente?.nombre || "N/A"}</p>
                                <p className="font-semibold text-gray-700">Método de Pago:</p>
                                <p>{pedidoInfo.metodo_pago || "N/A"}</p>
                                <p className="font-semibold text-gray-700">Estado:</p>
                                <p>{pedidoInfo.estado || "N/A"}</p>
                                <p className="font-semibold text-gray-700">Fecha:</p>
                                <p>{new Date(pedidoInfo.fecha_pedido).toLocaleString()}</p>
                            </div>

                            {/* Tabla de Detalles */}
                            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Productos</h3>
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-600 uppercase">Producto</th>
                                            <th className="py-2 px-4 text-center text-xs font-medium text-gray-600 uppercase">Cantidad</th>
                                            <th className="py-2 px-4 text-right text-xs font-medium text-gray-600 uppercase">P. Unitario</th>
                                            <th className="py-2 px-4 text-right text-xs font-medium text-gray-600 uppercase">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pedidoInfo.pedido_detalles.map((detalle) => {
                                            const subtotal = detalle.cantidad * detalle.precio_unitario;
                                            return (
                                                <tr key={detalle.id}>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <p className="font-medium text-gray-900">{detalle.producto?.nombre || "N/A"}</p>
                                                        {detalle.notas_adicionales && (
                                                            <p className="text-xs text-gray-500 italic">Notas: {detalle.notas_adicionales}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">
                                                        {detalle.cantidad}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-gray-700">
                                                        Bs. {detalle.precio_unitario.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-gray-800">
                                                        Bs. {subtotal.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totales y Acciones */}
                            <div className="mt-6">
                                <div className="flex justify-end">
                                    <div className="flex border-t border-gray-300 pt-3">
                                        <div className="px-4 py-2 font-bold text-xl text-gray-800">TOTAL PEDIDO:</div>
                                        <div className="px-4 py-2 font-bold text-2xl text-blue-700">
                                            Bs. {pedidoInfo.monto.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={descargarPDFDetalle}
                                        className=" bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 shadow"
                                    >
                                        <FaFilePdf className="text-xl" />
                                        Exportar PDF
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 shadow"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalDetallePedido;