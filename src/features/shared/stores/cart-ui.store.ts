import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CartUIState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

export const useCartUIStore = create<CartUIState>()(
  devtools(
    (set) => ({
      isOpen: false,
      open: () => set({ isOpen: true }, false, 'cart-ui/open'),
      close: () => set({ isOpen: false }, false, 'cart-ui/close'),
      setOpen: (open: boolean) =>
        set({ isOpen: open }, false, 'cart-ui/setOpen'),
    }),
    { name: 'cart-ui-store' },
  ),
);
