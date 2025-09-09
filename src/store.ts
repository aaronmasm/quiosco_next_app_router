import { create } from "zustand";
import { OrderItem } from "@/src/types";
import { Product } from "@/generated/prisma/client";

// Interfaz del estado global del store
interface Store {
  order: OrderItem[]; // Lista de productos en el carrito
  addToOrder: (product: Product) => void; // Agrega producto o aumenta cantidad
  increaseQuantity: (id: Product["id"]) => void; // Aumenta cantidad de un producto específico
  decreaseQuantity: (id: Product["id"]) => void; // Disminuye cantidad de un producto específico
  removeItem: (id: Product["id"]) => void; // Elimina un producto del carrito
  clearOrder: () => void; // Limpia la orden
}

// Función interna reutilizable para actualizar la cantidad y el subtotal
function updateQuantityAndSubtotal(
  order: OrderItem[],
  id: Product["id"],
  quantityDelta: number, // Puede ser positivo (sumar) o negativo (restar)
): OrderItem[] {
  return order.map((item) =>
    item.id === id
      ? {
          ...item,
          quantity: item.quantity + quantityDelta,
          subtotal: (item.quantity + quantityDelta) * item.price,
        }
      : item,
  );
}

// Zustand store
export const useStore = create<Store>((set, get) => ({
  order: [],

  addToOrder: (product) => {
    const { id, name, price } = product;
    const currentOrder = get().order;

    // Verifica si el producto ya está en el carrito
    const exists = currentOrder.some((item) => item.id === id);

    let updatedOrder: OrderItem[];

    if (exists) {
      // Si existe, aumenta su cantidad
      updatedOrder = updateQuantityAndSubtotal(currentOrder, id, 1);
    } else {
      // Si no existe, lo agrega como nuevo
      const newItem: OrderItem = {
        id,
        name,
        price,
        quantity: 1,
        subtotal: price,
      };

      updatedOrder = [...currentOrder, newItem];
    }

    // Actualiza el estado con la nueva orden
    set({ order: updatedOrder });
  },

  increaseQuantity: (id) => {
    // Incrementa la cantidad del producto con ID dado
    const currentOrder = get().order;
    const updatedOrder = updateQuantityAndSubtotal(currentOrder, id, 1);
    set({ order: updatedOrder });
  },

  decreaseQuantity: (id) => {
    // Decrementa la cantidad del producto con ID dado
    const currentOrder = get().order;
    const updatedOrder = updateQuantityAndSubtotal(currentOrder, id, -1);
    set({ order: updatedOrder });
  },

  removeItem: (id) => {
    // Elimina el producto completamente del carrito
    set((state) => ({
      order: state.order.filter((item) => item.id !== id),
    }));
  },

  clearOrder: () => {
    set(() => ({
      order: [],
    }));
  },
}));
