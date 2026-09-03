import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const nombrePlantilla = "Mujeres 1 - Avanzado (4 días)";

  // 1. Buscar si ya existe una plantilla con este nombre para actualizarla o crearla
  let rutina = await prisma.rutina.findFirst({
    where: { nombre: nombrePlantilla, es_plantilla: true }
  });

  if (rutina) {
    console.log(`Actualizando plantilla existente: ${nombrePlantilla} (ID: ${rutina.id})`);
    // Borrar días anteriores para reemplazar limpiamente
    await prisma.diaRutina.deleteMany({
      where: { rutinaId: rutina.id }
    });
  } else {
    console.log(`Creando nueva plantilla: ${nombrePlantilla}`);
    rutina = await prisma.rutina.create({
      data: {
        nombre: nombrePlantilla,
        genero: "F",
        nivel: "avanzado",
        es_plantilla: true,
      }
    });
  }

  const rutinaId = rutina.id;

  // --- DÍA 1: Lunes pierna cuádriceps ---
  const dia1 = await prisma.diaRutina.create({
    data: {
      rutinaId,
      nombre_dia: "Lunes - Pierna cuádriceps",
      orden: 0
    }
  });

  await prisma.ejercicio.createMany({
    data: [
      {
        dia_rutinaId: dia1.id,
        orden: 0,
        tipo: "normal",
        nombre: "Extensión cuádriceps pesados",
        series: 5,
        rango_reps: "15-20",
        rir: "falló rir 1",
        video_url: "/videos/avanzadomujeres/Extension_cuadriceps-fem.mp4"
      },
      {
        dia_rutinaId: dia1.id,
        orden: 1,
        tipo: "normal",
        nombre: "Hack pesada",
        series: 3,
        rango_reps: "15-25",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Hack_pesada-fem.mp4"
      },
      {
        dia_rutinaId: dia1.id,
        orden: 2,
        tipo: "normal",
        nombre: "Prensa",
        series: 4,
        rango_reps: "8-15 reps",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Prensa-fem.mp4"
      },
      {
        dia_rutinaId: dia1.id,
        orden: 3,
        tipo: "normal",
        nombre: "Sentadilla Smith muy pesada",
        series: 4,
        rango_reps: "6-13 reps",
        rir: "rir 1 o falló",
        video_url: "/videos/avanzadomujeres/Sentadilla smith muy pesada.mp4"
      },
      {
        dia_rutinaId: dia1.id,
        orden: 4,
        tipo: "superset",
        nombre: "Aductores + Gemelos",
        movimientos: ["Aductores", "Gemelos"],
        series_texto: "5 series",
        reps_por_movimiento: ["16-25", "16-25"],
        rir: "rir 1 o falló",
        video_url: "/videos/avanzadomujeres/Aductores-fem.mp4"
      },
      {
        dia_rutinaId: dia1.id,
        orden: 5,
        tipo: "normal",
        nombre: "Avanzadas o desplante posterior sobre apoyo",
        series: 2,
        rango_reps: "20 reps o 40 pasos",
        rir: "rir 1 o falló",
        video_url: "/videos/avanzadomujeres/Avanzada_desplane_posterior-fem.mp4"
      }
    ]
  });

  // --- DÍA 2: Martes glúteo - espalda - hombro ---
  const dia2 = await prisma.diaRutina.create({
    data: {
      rutinaId,
      nombre_dia: "Martes - Glúteo, Espalda y Hombro",
      orden: 1
    }
  });

  await prisma.ejercicio.createMany({
    data: [
      {
        dia_rutinaId: dia2.id,
        orden: 0,
        tipo: "normal",
        nombre: "Hip thrust + banda",
        series: 4,
        rango_reps: "12-15 (20-25)",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Hip_thrust_mas_banda-fem.mp4"
      },
      {
        dia_rutinaId: dia2.id,
        orden: 1,
        tipo: "normal",
        nombre: "Pateo posterior",
        series: 4,
        rango_reps: "15-20 reps + 6 parciales en contracción",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Pateo_posterior-fem.mp4"
      },
      {
        dia_rutinaId: dia2.id,
        orden: 2,
        tipo: "normal",
        nombre: "Sentadilla búlgara mancuernas o Smith",
        series: 4,
        rango_reps: "10-15 reps",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Sentadilla_bulgara-fem.mp4"
      },
      {
        dia_rutinaId: dia2.id,
        orden: 3,
        tipo: "superset",
        nombre: "Peso muerto rumano barra + Sumo con mancuerna",
        movimientos: ["Peso muerto rumano barra", "Sumo con mancuerna"],
        series_texto: "3 series",
        reps_por_movimiento: ["12-15 reps", "12-15 reps"],
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Peso_muerto_rumano-fem.mp4"
      },
      {
        dia_rutinaId: dia2.id,
        orden: 4,
        tipo: "normal",
        nombre: "Jalón al pecho máquina",
        series: 5,
        rango_reps: "15-20",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Jalon_pecho_maquina-fem.mp4"
      },
      {
        dia_rutinaId: dia2.id,
        orden: 5,
        tipo: "normal",
        nombre: "Remo sentado",
        series: 5,
        rango_reps: "15-20",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Remo_sentado-fem.mp4"
      },
      {
        dia_rutinaId: dia2.id,
        orden: 6,
        tipo: "normal",
        nombre: "Curl bíceps mancuernas o poleas",
        series: 5,
        rango_reps: "15-20",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Curl_biseps_polea-fem.mp4"
      },
      {
        dia_rutinaId: dia2.id,
        orden: 7,
        tipo: "normal",
        nombre: "Extensión tríceps",
        series: 5,
        rango_reps: "15-20",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Extension_triceps-fem.mp4"
      }
    ]
  });

  // --- DÍA 3: Miércoles pierna femoral ---
  const dia3 = await prisma.diaRutina.create({
    data: {
      rutinaId,
      nombre_dia: "Miércoles - Pierna femoral",
      orden: 2
    }
  });

  await prisma.ejercicio.createMany({
    data: [
      {
        dia_rutinaId: dia3.id,
        orden: 0,
        tipo: "normal",
        nombre: "Hack invertida",
        series: 5,
        rango_reps: "15-30",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Hack_pesada-fem.mp4"
      },
      {
        dia_rutinaId: dia3.id,
        orden: 1,
        tipo: "normal",
        nombre: "Femoral sentado",
        series: 4,
        rango_reps: "15-30",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Femora_sentado-fem.mp4"
      },
      {
        dia_rutinaId: dia3.id,
        orden: 2,
        tipo: "normal",
        nombre: "Buenos días",
        series: 4,
        rango_reps: "10-15 reps",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Peso_muero_mancuerna_piernas_rigidas-fem.mp4"
      },
      {
        dia_rutinaId: dia3.id,
        orden: 3,
        tipo: "superset",
        nombre: "Sumo en máquina + Gemelos",
        movimientos: ["Sumo en máquina", "Gemelos"],
        series_texto: "5 series",
        reps_por_movimiento: ["10-15 reps", "10-15 reps"],
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Sumo_maquina-fem.mp4"
      },
      {
        dia_rutinaId: dia3.id,
        orden: 4,
        tipo: "superset",
        nombre: "Sentadilla Sissy + Subir al banco",
        movimientos: ["Sentadilla Sissy", "Subir al banco con mancuernas"],
        series_texto: "4 series",
        reps_por_movimiento: ["15-20 reps", "15-20 reps"],
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Subir_banco_mancuernas-fem.mp4"
      },
      {
        dia_rutinaId: dia3.id,
        orden: 5,
        tipo: "normal",
        nombre: "Prensa femoral",
        series: 4,
        rango_reps: "10-15 reps",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Prensa_femoral-fem.mp4"
      },
      {
        dia_rutinaId: dia3.id,
        orden: 6,
        tipo: "normal",
        nombre: "Abdomen",
        series: 4,
        rango_reps: "10-15 reps",
        rir: "rir 1-2",
        video_url: null
      }
    ]
  });

  // --- DÍA 4: Jueves pierna- pecho ---
  const dia4 = await prisma.diaRutina.create({
    data: {
      rutinaId,
      nombre_dia: "Jueves - Pierna y Pecho",
      orden: 3
    }
  });

  await prisma.ejercicio.createMany({
    data: [
      {
        dia_rutinaId: dia4.id,
        orden: 0,
        tipo: "drop_set",
        nombre: "Extensión cuádriceps",
        series: 2,
        pesos: 5,
        series_texto: "2 series (Drop set de 5 pesos mínimo)",
        rango_reps: "Drop set 5 pesos",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Extension_cuadriceps-fem.mp4"
      },
      {
        dia_rutinaId: dia4.id,
        orden: 1,
        tipo: "superset",
        nombre: "Aductores + Sentadilla frontal",
        movimientos: ["Aductores", "Sentadilla frontal"],
        series_texto: "4 series",
        reps_por_movimiento: ["15-20", "15-20"],
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Sentadilla_frontal-fem.mp4"
      },
      {
        dia_rutinaId: dia4.id,
        orden: 2,
        tipo: "normal",
        nombre: "Sumo en banco doble A",
        series: 3,
        rango_reps: "15 a 20",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Sumo_mancuerna-fem.mp4"
      },
      {
        dia_rutinaId: dia4.id,
        orden: 3,
        tipo: "superset",
        nombre: "Hack series apagadas + Zancada en hack",
        movimientos: ["Hack series apagadas", "Zancada en hack"],
        series_texto: "5 series",
        reps_por_movimiento: ["8-20", "8-20"],
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Hack_pesada-fem.mp4"
      },
      {
        dia_rutinaId: dia4.id,
        orden: 4,
        tipo: "drop_set",
        nombre: "Pecho bajo en máquina",
        series: 5,
        pesos: 7,
        series_texto: "5 series (7 pesos)",
        rango_reps: "7 pesos",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Pecho_bajo_maquina-fem.mp4"
      },
      {
        dia_rutinaId: dia4.id,
        orden: 5,
        tipo: "normal",
        nombre: "Elevación frontal",
        series: 5,
        rango_reps: "12-17 reps",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Elevacion_frontal-fem.mp4"
      },
      {
        dia_rutinaId: dia4.id,
        orden: 6,
        tipo: "normal",
        nombre: "Tríceps tras nuca",
        series: 5,
        rango_reps: "12-17 reps",
        rir: "rir 1-2",
        video_url: "/videos/avanzadomujeres/Triceps_trasnuca-fem.mp4"
      },
      {
        dia_rutinaId: dia4.id,
        orden: 7,
        tipo: "normal",
        nombre: "Press militar",
        series: 5,
        rango_reps: "12-17 reps",
        rir: "rir 1-2",
        video_url: "/videos/Press militar.mp4"
      }
    ]
  });

  console.log("¡Plantilla Mujeres 1 - Avanzado (4 días) creada y vinculada con éxito!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
