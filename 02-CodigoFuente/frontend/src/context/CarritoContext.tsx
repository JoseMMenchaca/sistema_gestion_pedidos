import React, { createContext, useReducer, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Producto } from '../types'; // Asegúrate de que tu type Producto está disponible

interface CartItem extends Producto {
    cantidad: number;
}

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: Producto }
    | { type: 'REMOVE_ITEM'; payload: { id: number } }
    | { type: 'UPDATE_QUANTITY'; payload: { id: number; cantidad: number } }
    | { type: 'TOGGLE_CART'; }
    | { type: 'CLEAR_CART' };

const initialState: CartState = {
    items: [],
    isCartOpen: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const product = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);

            if (existingItem) {
                // Si ya existe, incrementa la cantidad
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === product.id
                            ? { ...item, cantidad: item.cantidad + 1 }
                            : item
                    ),
                };
            } else {
                // Si es nuevo, añade el producto con cantidad 1
                return {
                    ...state,
                    items: [...state.items, { ...product, cantidad: 1 }],
                };
            }
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id),
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, cantidad: action.payload.cantidad }
                        : item
                ).filter(item => item.cantidad > 0), // Elimina si la cantidad es 0 o menos
            };
        case 'TOGGLE_CART':
            return {
                ...state,
                isCartOpen: !state.isCartOpen,
            };
        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
            };
        default:
            return state;
    }
};

interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    cartTotal: number;
    totalItems: number;
}

export const CarritoContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar el carrito
export const useCart = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};


interface CartProviderProps {
    children: ReactNode;
}

export const CarritoProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Calcular el total de artículos y el precio total
    const totalItems = state.items.reduce((acc, item) => acc + item.cantidad, 0);
    const cartTotal = state.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <CarritoContext.Provider value={{ state, dispatch, cartTotal, totalItems }}>
            {children}
        </CarritoContext.Provider>
    );
};