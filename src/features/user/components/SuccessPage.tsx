'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, Home, LogIn, Mail } from 'lucide-react';
import Link from 'next/link';

export function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>

              {/* Success Message */}
              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-foreground"
                >
                  ¡Registro Exitoso!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  Tu cuenta ha sido creada correctamente en Nexus H. Global
                </motion.p>
              </div>

              {/* Information Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Verifica tu correo electrónico
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Hemos enviado un enlace de verificación a tu correo.
                      Revisa tu bandeja de entrada y spam.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Button asChild className="w-full">
                  <Link href="/">
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Volver al Inicio
                  </Link>
                </Button>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-muted-foreground"
              >
                <p>
                  ¿Necesitas ayuda? Contacta a nuestro{' '}
                  <Link
                    href="/soporte"
                    className="text-primary hover:underline"
                  >
                    equipo de soporte
                  </Link>
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
