"use client";

import { motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const params = useParams<{ referrerCode: string }>();
  const searchParams = useSearchParams();
  const position = searchParams.get("lado");
  const referrerCode = params.referrerCode;

  return (
    <div className=" flex flex-col">


      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Únete a Nexus H. Global
            </h1>
            <p className="text-muted-foreground mt-2">
              {referrerCode !== "new" ? (
                <>
                  Te estás registrando con el código de referido:{" "}
                  <span className="font-semibold">{referrerCode}</span>
                  {position && (
                    <>
                      {" "}
                      en el lado{" "}
                      <span className="font-semibold">
                        {position === "izquierda" ? "izquierdo" : "derecho"}
                      </span>
                    </>
                  )}
                  {!position && (
                    <>
                      {" "}
                      en el lado{" "}
                      <span className="font-semibold">
                        derecho (por defecto)
                      </span>
                    </>
                  )}
                </>
              ) : (
                "Crea tu cuenta para acceder a la plataforma"
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >

          </motion.div>
        </div>
      </main>

      <footer className="border-t py-6 px-4 text-center text-muted-foreground text-sm">
        <p>
          © {new Date().getFullYear()} Nexus Global Network. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
