
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CarritoContext';
import axios from 'axios';
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { Producto } from '../types';


const API_CLIENTES_URL = `api/clientes`;
const API_PEDIDOS_URL = `api/pedidos`;

interface Cliente {
    id: number;
    nombre: string;
}

const ShoppingCarrito: React.FC = () => {
    const { state, dispatch, cartTotal } = useCart();
    const { isCartOpen, items } = state;

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedClienteId, setSelectedClienteId] = useState<number | ''>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => dispatch({ type: 'TOGGLE_CART' });
    
    const handleUpdateQuantity = (item: Producto, newQuantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, cantidad: newQuantity } });
    };

    const handleRemoveItem = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    };

    const handleClearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };


    useEffect(() => {
        const fetchClientes = async () => {
            try {
                // Intentar obtener la lista de clientes
                const response = await axios.get<Cliente[]>(API_CLIENTES_URL);
                const fetchedClients = response.data;
                
                setClientes(fetchedClients);
                setError(null);

                if (fetchedClients.length > 0) {
                    setSelectedClienteId(fetchedClients[0].id);
                }

            } catch (err) {
                console.error("Error al obtener la lista de clientes:", err);
                setError("Error al cargar clientes. Verifique que la API esté activa en " + API_CLIENTES_URL);
            }
        };

        if (isCartOpen && clientes.length === 0) {
            fetchClientes();
        }
    }, [isCartOpen, clientes.length]);

     const handleCheckout = async () => {
        if (items.length === 0) return;
        if (!selectedClienteId) {
            alert('Por favor, selecciona un cliente para continuar.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        const detalles = items.map(item => ({
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precio, 
        }));

        const pedidoData = {
            monto: cartTotal,
            fecha_pedido: new Date().toISOString(),
            metodo_pago: 'EFECTIVO', 
            estado: 'ENTREGADO', 
            cliente_id: Number(selectedClienteId), 
            detalles: detalles,
        };
        
        console.log('Enviando pedido:', pedidoData);

        try {
            const response = await axios.post(API_PEDIDOS_URL, pedidoData);

            const newPedidoId = response.data.id || 'N/A';
            
            alert(`Pedido #${newPedidoId} enviado con éxito. Total: Bs. ${cartTotal.toFixed(2)}.`);
            
            dispatch({ type: 'CLEAR_CART' }); 
            dispatch({ type: 'TOGGLE_CART' }); 

        } catch (err) {
            let errorMessage = 'Ocurrió un error al procesar tu pedido.';
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.message || errorMessage;
            }
            console.error('Error al enviar el pedido:', err);
            setError(`Error al enviar: ${errorMessage}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const sidebarClasses = isCartOpen
        ? 'translate-x-0'
        : 'translate-x-full';

  return (
        <>
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={handleClose}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-2xl z-50 transform transition-transform duration-500 ${sidebarClasses}`}
            >
          
                <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <ShoppingBagIcon className="w-6 h-6 mr-2 text-red-600" />
                        Tu Pedido
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto h-[calc(100vh-270px)]"> 
                    {items.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p className="text-lg">Tu carrito está vacío 😔</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
                                    <img
                                        src={`http://localhost:3000${item.imagen}`}
                                        alt={item.nombre}
                                        className="w-16 h-16 object-cover rounded-md mr-4 shadow"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-900">{item.nombre}</h3>
                                        <p className="text-sm text-red-600 font-bold">Bs. {(item.precio * item.cantidad).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.cantidad - 1)}
                                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                                            disabled={item.cantidad <= 1}
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-4 text-center">{item.cantidad}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.cantidad + 1)}
                                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-1 ml-3 text-red-500 hover:bg-red-100 rounded-full transition"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-5 border-t sticky bottom-0 bg-white shadow-top">
                    <div className="mb-4">
                        <label htmlFor="cliente-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Seleccionar Cliente:
                        </label>
                        <select
                            id="cliente-select"
                            value={selectedClienteId}
                            onChange={(e) => setSelectedClienteId(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md border"
                            disabled={clientes.length === 0 || isProcessing}
                        >
                            {clientes.length === 0 ? (
                                <option value="">Cargando clientes...</option>
                            ) : (
                                <>
                                    <option value="" disabled>-- Elige un cliente --</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.nombre} 
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>

                    <div className="flex justify-between items-center text-xl font-bold mb-3">
                        <span>Total:</span>
                        <span className="text-red-600">Bs. {cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout} 
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={items.length === 0 || !selectedClienteId || isProcessing} 
                    >
                        {isProcessing ? 'Enviando Pedido...' : 'Proceder a Realizar Pedido'}
                    </button>

                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="w-full mt-2 text-sm text-gray-500 hover:text-red-500 transition"
                        >
                            Vaciar Carrito
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};
export default ShoppingCarrito;