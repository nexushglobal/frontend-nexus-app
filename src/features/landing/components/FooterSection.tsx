'use client';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const socialLinks = [
  {
    icon: Facebook,
    href: 'https://www.facebook.com/profile.php?id=61567779184876',
    name: 'Facebook',
  },
  {
    icon: Instagram,
    href: 'https://www.instagram.com/nexushglobal/',
    name: 'Instagram',
  },
];

export function FooterSection() {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative w-[150px] h-10">
                <Image
                  src="/imgs/logo_negro.png"
                  alt="Nexus Global Network"
                  width={150}
                  height={40}
                  priority
                  className="absolute inset-0 dark:opacity-0 transition-opacity duration-200"
                />
                <Image
                  src="/imgs/logo_blanco_color.png"
                  alt="Nexus Global Network"
                  width={150}
                  height={40}
                  className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-200"
                />
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              Tu camino hacia la libertad financiera a través de bienes raíces,
              educación y negocios. Más de 10 años construyendo sueños
              inmobiliarios en el Perú.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+51 935 348 783</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>soporte@nexushglobal.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Lima, Perú</span>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-right"
          >
            <h4 className="font-semibold text-foreground mb-4">
              Síguenos en redes sociales
            </h4>
            <div className="flex gap-4 justify-center md:justify-end">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-all duration-200 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Nexus Global Network. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy-terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Política de Privacidad y Términos
              </Link>
              <Link
                href="/libro_de_reclamaciones"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Libro de Reclamaciones
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
