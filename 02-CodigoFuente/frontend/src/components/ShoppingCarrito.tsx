
import React from 'react';
import { useCart } from '../context/CarritoContext';
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { Producto } from '../types';

const ShoppingCarrito: React.FC = () => {
    const { state, dispatch, cartTotal } = useCart();
    const { isCartOpen, items } = state;

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

    // Clases de Tailwind para transición y visibilidad
    const sidebarClasses = isCartOpen
        ? 'translate-x-0'
        : 'translate-x-full';

    return (
        <>
            {/* Fondo Oscuro (Overlay) */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={handleClose}
                ></div>
            )}

            {/* Panel del Carrito */}
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

                <div className="p-5 overflow-y-auto h-[calc(100vh-170px)]">
                    {items.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p className="text-lg">Tu carrito está vacío 😔</p>
                            <p className="text-sm mt-2">¡Añade algo delicioso!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
                                    <img
                                        src={`/${item.imagen}`}
                                        alt={item.nombre}
                                        className="w-16 h-16 object-cover rounded-md mr-4 shadow"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-900">{item.nombre}</h3>
                                        <p className="text-sm text-red-600 font-bold">${(item.precio * item.cantidad).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* Control de Cantidad */}
                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.cantidad - 1)}
                                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                                            aria-label="Disminuir cantidad"
                                            disabled={item.cantidad <= 1}
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-4 text-center">{item.cantidad}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.cantidad + 1)}
                                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                                            aria-label="Aumentar cantidad"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                        {/* Eliminar Ítem */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-1 ml-3 text-red-500 hover:bg-red-100 rounded-full transition"
                                            aria-label="Eliminar producto"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pie de página del carrito (Total y Botón de Pago) */}
                <div className="p-5 border-t sticky bottom-0 bg-white shadow-top">
                    <div className="flex justify-between items-center text-xl font-bold mb-3">
                        <span>Total:</span>
                        <span className="text-red-600">Bs. {cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition disabled:bg-gray-400"
                        disabled={items.length === 0}
                    >
                        Proceder a Realizar Pedido
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