"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormData = {
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  pais: string;
  ciudad: string;
  cumpleanos: string;
  linkedin: string;
  grupo: string;
  estado_civil: string;
  situacion_familiar: string;
  situacion_laboral: string;
  tipo_trabajo: string;
  tipo_trabajo_otro: string;
  perfil_profesional: string;
  perfil_otro: string;
  momento_vida: string;
};

const STEPS = [
  "Datos personales",
  "Situación familiar",
  "Situación laboral",
  "Perfil profesional",
  "Momento de vida",
];

const ESTADOS_CIVILES = ["Soltero(a)", "Casado(a)", "Divorciado(a)", "Viudo(a)", "Conviviente", "Otro"];

const SITUACIONES_FAMILIARES = [
  "No tengo hijos",
  "Tengo hijos que viven conmigo",
  "Tengo hijos que viven de forma independiente",
  "Tengo hijos que viven en otra ciudad o país",
];

const SITUACIONES_LABORALES = [
  "Trabajo de manera dependiente",
  "Trabajo de manera independiente",
  "Actualmente no trabajo",
  "Otro",
];

const TIPOS_DEPENDIENTE = [
  "Trabajo en una empresa privada como profesional o especialista.",
  "Trabajo en una empresa privada ocupando un cargo de liderazgo o dirección.",
  "Trabajo en una entidad pública o gubernamental.",
  "Trabajo en una organización sin fines de lucro (ONG, asociación o fundación).",
  "Trabajo en un organismo internacional o de cooperación.",
  "Trabajo en una institución educativa (colegio, instituto o universidad).",
  "Trabajo en una startup o empresa en crecimiento.",
  "Trabajo en una empresa familiar.",
  "Otro",
];

const TIPOS_INDEPENDIENTE = [
  "Emprendedor: menor a 3 años",
  "Emprendedor: mayor a 3 años",
  "Fractional: trabajo en organizaciones de forma parcial o por proyectos, aportando conocimientos especializados sin formar parte del equipo a tiempo completo.",
  "Consultor",
  "Otro",
];

const PERFILES_PROFESIONALES = [
  "Convertirme en un líder o especialista que colabora con distintas organizaciones por proyectos o de forma parcial, aportando mi experiencia y conocimiento.",
  "Construir un negocio propio basado en mi experiencia profesional, ofreciendo servicios como consultoría, mentoría, coaching, capacitación u otros servicios especializados.",
  "Desarrollar un emprendimiento relacionado con mis hobbies, pasiones o intereses personales, creando productos, servicios o experiencias.",
  "Otro",
];

const MOMENTOS_VIDA = [
  "Estoy en una etapa de búsqueda y cambio. Siento que estoy explorando, cuestionando y probando nuevas posibilidades para entender mejor qué quiero.",
  "Tengo claridad sobre lo que quiero y estoy enfocado(a) en crecer, avanzar y lograr resultados. Me mueve construir, ejecutar y llevar mis objetivos al siguiente nivel.",
  "Estoy en un momento de pausa y redefinición. Estoy priorizando mi bienestar, buscando más equilibrio y tomando decisiones con mayor intención sobre cómo quiero vivir esta siguiente etapa.",
];

const PAISES = [
  "Perú", "Argentina", "Chile", "Colombia", "México", "Ecuador", "Bolivia",
  "Uruguay", "Paraguay", "Venezuela", "España", "Estados Unidos", "Otro",
];

const empty: FormData = {
  nombres: "", apellidos: "", dni: "", email: "", telefono: "",
  pais: "", ciudad: "", cumpleanos: "", linkedin: "", grupo: "",
  estado_civil: "", situacion_familiar: "", situacion_laboral: "",
  tipo_trabajo: "", tipo_trabajo_otro: "", perfil_profesional: "",
  perfil_otro: "", momento_vida: "",
};

function RadioGroup({ options, value, onChange, name }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            value === opt
              ? "border-lsm-dark bg-orange-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="mt-0.5 accent-orange-600 shrink-0"
          />
          <span className="text-sm text-gray-700 leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function Field({ label, required, children }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lsm-orange/20 focus:border-lsm-orange transition bg-white"
    />
  );
}

function SelectInput({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lsm-orange/20 focus:border-lsm-orange transition bg-white"
    >
      {children}
    </select>
  );
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setE = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const tiposTrabajo =
    form.situacion_laboral === "Trabajo de manera dependiente"
      ? TIPOS_DEPENDIENTE
      : form.situacion_laboral === "Trabajo de manera independiente"
      ? TIPOS_INDEPENDIENTE
      : [];

  function validateStep(): string {
    if (step === 0) {
      if (!form.nombres.trim()) return "Ingresa tu nombre";
      if (!form.apellidos.trim()) return "Ingresa tus apellidos";
      if (!form.dni.trim()) return "Ingresa tu DNI";
      if (!form.email.trim()) return "Ingresa tu email";
      if (!form.telefono.trim()) return "Ingresa tu teléfono";
      if (!form.pais) return "Selecciona tu país";
      if (!form.ciudad.trim()) return "Ingresa tu ciudad";
      if (!form.cumpleanos) return "Ingresa tu fecha de nacimiento";
      if (!form.estado_civil) return "Selecciona tu estado civil";
    }
    if (step === 1 && !form.situacion_familiar) return "Selecciona una opción";
    if (step === 2 && !form.situacion_laboral) return "Selecciona una opción";
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  }

  function back() {
    setError("");
    setStep((s) => s - 1);
    window.scrollTo(0, 0);
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push("/success");
    } catch {
      setError("Ocurrió un error al guardar. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-lsm-cream py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="La Segunda Mordida"
            width={72}
            height={72}
            className="mx-auto mb-3"
            priority
          />
          <h1 className="font-[family-name:var(--font-anton)] text-2xl tracking-wide text-gray-900 uppercase">
            La Segunda Mordida
          </h1>
          <p className="text-sm text-gray-500 mt-1">Registro de miembros</p>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Paso {step + 1} de {STEPS.length}</span>
            <span className="font-medium text-gray-600">{STEPS[step]}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-lsm-orange rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">
            {STEPS[step]}
          </h2>

          {/* Step 0 — Datos personales */}
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombres" required>
                  <TextInput placeholder="Juan" value={form.nombres} onChange={setE("nombres")} />
                </Field>
                <Field label="Apellidos" required>
                  <TextInput placeholder="Pérez" value={form.apellidos} onChange={setE("apellidos")} />
                </Field>
              </div>
              <Field label="DNI / Documento" required>
                <TextInput placeholder="12345678" value={form.dni} onChange={setE("dni")} />
              </Field>
              <Field label="Email" required>
                <TextInput type="email" placeholder="juan@email.com" value={form.email} onChange={setE("email")} />
              </Field>
              <Field label="Teléfono" required>
                <TextInput type="tel" placeholder="+51 999 999 999" value={form.telefono} onChange={setE("telefono")} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="País" required>
                  <SelectInput value={form.pais} onChange={setE("pais")}>
                    <option value="">Seleccionar</option>
                    {PAISES.map((p) => <option key={p}>{p}</option>)}
                  </SelectInput>
                </Field>
                <Field label="Ciudad" required>
                  <TextInput placeholder="Lima" value={form.ciudad} onChange={setE("ciudad")} />
                </Field>
              </div>
              <Field label="Fecha de nacimiento" required>
                <TextInput type="date" value={form.cumpleanos} onChange={setE("cumpleanos")} />
              </Field>
              <Field label="Estado civil" required>
                <RadioGroup
                  options={ESTADOS_CIVILES}
                  value={form.estado_civil}
                  onChange={set("estado_civil")}
                  name="estado_civil"
                />
              </Field>
              <Field label="LinkedIn">
                <TextInput placeholder="linkedin.com/in/tu-perfil" value={form.linkedin} onChange={setE("linkedin")} />
              </Field>
              <Field label="Grupo / Cohorte">
                <TextInput placeholder="Grupo A" value={form.grupo} onChange={setE("grupo")} />
              </Field>
            </>
          )}

          {/* Step 1 — Situación familiar */}
          {step === 1 && (
            <Field label="¿Cuál de las siguientes opciones describe mejor tu situación familiar?" required>
              <RadioGroup
                options={SITUACIONES_FAMILIARES}
                value={form.situacion_familiar}
                onChange={set("situacion_familiar")}
                name="situacion_familiar"
              />
            </Field>
          )}

          {/* Step 2 — Situación laboral */}
          {step === 2 && (
            <div className="space-y-5">
              <Field label="¿Cuál es tu situación laboral actual?" required>
                <RadioGroup
                  options={SITUACIONES_LABORALES}
                  value={form.situacion_laboral}
                  onChange={(v) => {
                    set("situacion_laboral")(v);
                    set("tipo_trabajo")("");
                    set("tipo_trabajo_otro")("");
                  }}
                  name="situacion_laboral"
                />
              </Field>

              {tiposTrabajo.length > 0 && (
                <Field label="¿Cuál de las siguientes opciones te representa mejor?">
                  <RadioGroup
                    options={tiposTrabajo}
                    value={form.tipo_trabajo}
                    onChange={set("tipo_trabajo")}
                    name="tipo_trabajo"
                  />
                  {form.tipo_trabajo === "Otro" && (
                    <TextInput
                      className="mt-2"
                      placeholder="Especifica..."
                      value={form.tipo_trabajo_otro}
                      onChange={setE("tipo_trabajo_otro")}
                    />
                  )}
                </Field>
              )}
            </div>
          )}

          {/* Step 3 — Perfil profesional */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-xs text-gray-400 -mt-2">Opcional</p>
              <Field label="¿Cuál de los siguientes caminos te gustaría explorar o desarrollar en los próximos años?">
                <RadioGroup
                  options={PERFILES_PROFESIONALES}
                  value={form.perfil_profesional}
                  onChange={set("perfil_profesional")}
                  name="perfil_profesional"
                />
                {form.perfil_profesional === "Otro" && (
                  <TextInput
                    className="mt-2"
                    placeholder="Especifica..."
                    value={form.perfil_otro}
                    onChange={setE("perfil_otro")}
                  />
                )}
              </Field>
            </div>
          )}

          {/* Step 4 — Momento de vida */}
          {step === 4 && (
            <Field label="Si tuvieras que describir tu etapa actual, ¿cuál de estas opciones se acerca más a ti?">
              <RadioGroup
                options={MOMENTOS_VIDA}
                value={form.momento_vida}
                onChange={set("momento_vida")}
                name="momento_vida"
              />
            </Field>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                onClick={back}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Atrás
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="flex-1 bg-lsm-orange text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-lsm-dark transition"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 bg-lsm-orange text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-lsm-dark transition disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Enviar registro"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          La Segunda Mordida © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
