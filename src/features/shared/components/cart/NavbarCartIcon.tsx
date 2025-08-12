'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/context/CartStore';
import { useCartUIStore } from '@/features/shared/stores/cart-ui.store';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { CartSheet } from './CartSheet';

export default function NavbarCartIcon() {
  const { itemCount } = useCartStore();
  const { isOpen, setOpen } = useCartUIStore();

  return (
    <>
      <motion.div
        className="relative flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full"
          onClick={() => setOpen(true)}
        >
          <ShoppingCart size={20} className="text-muted-foreground" />

          {/* Badge con contador */}
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center p-0 text-[0.7rem]"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          )}

          {/* Animación de ping para llamar la atención */}
          {itemCount > 0 && (
            <motion.span
              className="absolute top-0 right-0 w-full h-full rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </Button>
      </motion.div>
      <CartSheet open={isOpen} onOpenChange={setOpen} />
    </>
  );
}
