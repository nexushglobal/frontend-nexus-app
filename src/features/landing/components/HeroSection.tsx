'use client';
import { Button } from '@/components/ui/button';
import { LoginSheet } from '@/features/auth/components/LoginSheet';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20"></div>
      <div className="container mx-auto px-2 sm:px-4 py-10 sm:py-16 relative z-10">
        <div className="text-center max-w-full sm:max-w-3xl mx-auto space-y-10 sm:space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1 shadow-sm"
          >
            <span className="text-xs font-medium text-primary">
              +10 años liderando el mercado
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36">
              <Image
                src="/imgs/isotipo_negro.png"
                alt="Nexus H Global"
                width={80}
                height={80}
                priority
                className="absolute inset-0 dark:opacity-0 transition-all duration-300 sm:w-28 sm:h-28 md:w-36 md:h-36"
              />
              <Image
                src="/imgs/isotipo_blanco.png"
                alt="Nexus H Global"
                width={80}
                height={80}
                className="absolute inset-0 opacity-0 dark:opacity-100 transition-all duration-300 sm:w-28 sm:h-28 md:w-36 md:h-36"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight mb-3 sm:mb-4">
              NEXUS H GLOBAL
            </h1>
            <p className="text-base sm:text-2xl md:text-3xl text-muted-foreground font-medium">
              Tu portal hacia la{' '}
              <span className="text-primary font-semibold">
                libertad financiera
              </span>{' '}
              en el sector inmobiliario más exclusivo y rentable
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-sm sm:text-base md:text-lg text-muted-foreground border-t border-border pt-4 sm:pt-6"
          >
            <span className="flex items-center gap-2">
              <strong className="text-primary font-bold text-lg sm:text-xl md:text-2xl">
                +4,000
              </strong>
              Lotes Vendidos
            </span>
            <span className="hidden sm:inline text-border text-xl">|</span>
            <span className="flex items-center gap-2">
              <strong className="text-primary font-bold text-lg sm:text-xl md:text-2xl">
                +10,000
              </strong>
              Lotes en Cartera
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={scrollToForm}
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg font-bold px-8 sm:px-14 py-4 sm:py-6 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground shadow-xl hover:shadow-primary/25 transition-all duration-200"
              >
                COMENZAR
                <ArrowRight className="h-6 w-6 sm:h-7 sm:w-7 ml-2 sm:ml-3" />
              </Button>
            </motion.div>
            <LoginSheet>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg font-bold px-8 sm:px-14 py-4 sm:py-6 rounded-2xl border-2 border-primary hover:border-primary-hover hover:bg-primary/10 hover:shadow-lg transition-all duration-200"
                >
                  <LogIn className="h-6 w-6 sm:h-7 sm:w-7 mr-2 sm:mr-3" />
                  INGRESAR
                </Button>
              </motion.div>
            </LoginSheet>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
            className="pt-4 sm:pt-6"
          >
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              Desarrolladora Inmobiliaria · Financiera Propia · Nexus Academy
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
