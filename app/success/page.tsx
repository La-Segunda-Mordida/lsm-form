import Link from "next/link";
import Image from "next/image";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-lsm-cream flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image
          src="/logo.png"
          alt="La Segunda Mordida"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-lsm-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-anton)] text-2xl uppercase tracking-wide text-gray-900 mb-3">
          ¡Registro completado!
        </h1>
        <p className="text-gray-500 mb-8">
          Tu información ha sido guardada correctamente en nuestra base de datos.
        </p>
        <Link
          href="/"
          className="inline-block bg-lsm-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-lsm-dark transition-colors"
        >
          Nuevo registro
        </Link>
      </div>
    </div>
  );
}
