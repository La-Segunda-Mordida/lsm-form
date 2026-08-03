import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const id = `LSM-${Date.now()}`;
    const fecha = new Date().toISOString();

    const row = [
      id,
      fecha,
      data.nombres,
      data.apellidos,
      data.dni,
      data.email,
      data.telefono,
      data.pais,
      data.ciudad,
      data.cumpleanos,
      data.linkedin || "",
      data.grupo || "",
      data.estado_civil,
      data.situacion_familiar,
      data.situacion_laboral,
      data.tipo_trabajo || "",
      data.tipo_trabajo_otro || "",
      data.perfil_profesional || "",
      data.perfil_otro || "",
      data.momento_vida || "",
      data.acepta_nda || "",
      data.acepta_imagen || "",
      Array.isArray(data.sectores) ? data.sectores.join("; ") : (data.sectores || ""),
      data.sectores_otro || "",
      data.ultimo_cargo || "",
      data.acepta_permanencia || "",
      data.fractional || "",
    ];

    await appendToSheet([row]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
