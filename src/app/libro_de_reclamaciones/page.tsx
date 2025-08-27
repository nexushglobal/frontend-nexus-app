import { ComplaintForm } from "@/features/complaints/components/ComplaintForm";
import Image from "next/image";

export default function ComplaintBookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-layout-content to-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-6">
              <Image
                src="/imgs/logo_libro_reclam.jpg"
                alt="Libro de Reclamaciones"
                width={200}
                height={120}
                className="mx-auto rounded-lg shadow-md"
                priority
              />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Libro de Reclamaciones
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Su opinión es muy importante para nosotros. Utilice este formulario 
              para registrar sus quejas o reclamos, y nos comprometemos a darle 
              una respuesta oportuna y satisfactoria.
            </p>
          </div>

          <div className="bg-card border rounded-xl shadow-lg p-8">
            <ComplaintForm />
          </div>
        </div>
      </div>
    </div>
  );
}