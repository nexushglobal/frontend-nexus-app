import { CTASection } from '@/features/landing/components/CTASection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { FooterSection } from '@/features/landing/components/FooterSection';
import HeroSection from '@/features/landing/components/HeroSection';
import { LeadFormSection } from '@/features/landing/components/LeadFormSection';
import { StatsSection } from '@/features/landing/components/StatsSection';
import { TestimonialsSection } from '@/features/landing/components/TestimonialsSection';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NEXUS H GLOBAL',
  alternateName: 'Nexus Global Network',
  url: 'https://nexus-h-global.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://nexus-h-global.com/imgs/logo.png',
  },
  description:
    'Invierte en bienes raíces, desarrolla tu educación financiera y construye tu negocio inmobiliario con NEXUS H GLOBAL. Más de 10 años de experiencia respaldando tu camino hacia la libertad financiera.',
  sameAs: [
    'https://facebook.com/nexushglobal',
    'https://twitter.com/nexushglobal',
    'https://linkedin.com/company/nexushglobal',
    'https://instagram.com/nexushglobal',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    areaServed: 'PE',
    availableLanguage: ['Spanish'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PE',
    addressRegion: 'Lima',
  },
  founder: {
    '@type': 'Organization',
    name: 'Huertas Inmobiliaria',
  },
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    value: '50+',
  },
  foundingDate: '2014',
  industry: 'Real Estate Investment',
  knowsAbout: [
    'Bienes Raíces',
    'Inversión Inmobiliaria',
    'Educación Financiera',
    'Marketing Multinivel',
    'Desarrollo de Negocios',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios NEXUS H GLOBAL',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Inversión en Bienes Raíces',
          description:
            'Invierte en proyectos inmobiliarios consolidados como El Olivar, Apolo, Oasis y Flamant con cero inicial',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'EducationalOrganization',
          '@id': '#nexus-academy',
          name: 'Nexus Academy',
          description:
            'Certificaciones en Marketing Digital, IA, Ventas Especializadas y las 13 leyes del éxito para emprendedores inmobiliarios',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Modelo de Negocio MLM',
          description:
            'Múltiples formas de generar ingresos: comisiones por membresías, ventas de lotes y bonos por consolidación de equipos',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150+',
    bestRating: '5',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NEXUS H GLOBAL',
  url: 'https://nexus-h-global.com',
  description:
    'Tu camino hacia la libertad financiera a través de bienes raíces y educación financiera',
  inLanguage: 'es-PE',
  isPartOf: {
    '@type': 'Organization',
    name: 'NEXUS H GLOBAL',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://nexus-h-global.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://nexus-h-global.com',
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-dvh">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <LeadFormSection />
        <FooterSection />
      </div>
    </>
  );
}
