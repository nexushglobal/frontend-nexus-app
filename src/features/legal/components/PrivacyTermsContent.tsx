'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export function PrivacyTermsContent() {
  const [termsContent, setTermsContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTerms() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/terms');

        if (!response.ok) {
          throw new Error(
            'No se pudo cargar el archivo de términos y condiciones',
          );
        }

        const data = await response.json();
        setTermsContent(data.content);
      } catch (error) {
        console.error('Error cargando términos y condiciones:', error);
        setError(
          'Error al cargar los términos y condiciones. Por favor, inténtelo de nuevo más tarde.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al Inicio
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Política de Privacidad y Términos
              </h1>
              <p className="text-muted-foreground">Nexus H.Global</p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-8"
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h3 className="text-lg font-medium text-foreground">
                Cargando términos y condiciones...
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Por favor espera mientras obtenemos el contenido completo del documento legal.
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h3 className="text-lg font-medium text-foreground">
                Error al cargar el contenido
              </h3>
              <p className="text-sm text-center text-muted-foreground max-w-md">
                {error}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="prose prose-gray dark:prose-invert prose-headings:font-semibold prose-headings:text-primary prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3 border-b border-border/30 pb-4">
                      <Scale className="w-7 h-7 text-primary flex-shrink-0" />
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4 pb-2 border-b border-border/20">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium text-foreground mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-muted-foreground space-y-2 mb-4 ml-6">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="list-disc">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {termsContent}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Link>
          </Button>
          <Button asChild>
            <Link href="/#contact-form">
              Contactar un Asesor
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
