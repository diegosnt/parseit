import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

const DATA_DIR = './public/data';
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');

// 🛡️ Definición del contrato (Esquema de un Examen Válido)
const ExamSchema = z.object({
  materia: z.string().min(2, "La materia es obligatoria."),
  titulo: z.string().min(2, "El título es obligatorio."),
  duracion: z.number().int().nonnegative(),
  preguntas_para_aprobar: z.number().int().positive(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha debe ser YYYY-MM-DD"),
  version: z.string().or(z.number()),
  preguntas: z.array(z.object({
    id: z.number().int(),
    pregunta: z.string().min(5, "La pregunta es demasiado corta."),
    opciones: z.array(z.string()).min(2, "Mínimo 2 opciones por pregunta."),
    respuesta_correcta: z.number().int().nonnegative()
  })).min(1, "El examen debe tener al menos una pregunta.")
}).refine(data => {
  // Validación extra: La respuesta_correcta debe ser un índice válido de opciones
  return data.preguntas.every(p => p.respuesta_correcta < p.opciones.length);
}, {
  message: "Alguna pregunta tiene un índice de respuesta_correcta fuera del rango de sus opciones."
});

async function generateCatalog() {
  console.log('🚀 Generando catálogo y validando integridad de datos...');
  
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'catalog.json' && f !== 'manifest.json');
    
    let hasErrors = false;

    const catalog = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const id = path.basename(file, '.json');
        
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const jsonData = JSON.parse(content);
          
          // 🛡️ VALIDACIÓN ESTRICTA (Shift-Left)
          const result = ExamSchema.safeParse(jsonData);
          
          if (!result.success) {
            console.error(`\n❌ ERROR DE VALIDACIÓN en "${file}":`);
            result.error.issues.forEach(issue => {
              const pathStr = issue.path.join(' -> ');
              console.error(`   - [${pathStr || 'Raíz'}]: ${issue.message}`);
            });
            hasErrors = true;
            return null;
          }

          const data = result.data;
          return {
            id,
            materia: data.materia,
            titulo: data.titulo
          };
        } catch (error) {
          console.error(`\n❌ ERROR CRÍTICO leyendo ${file}:`, error.message);
          hasErrors = true;
          return null;
        }
      })
    );

    if (hasErrors) {
      console.error('\n💥 El build falló porque hay exámenes con errores de formato.');
      console.error('Por favor corregí los JSONs antes de continuar.');
      process.exit(1);
    }

    const validCatalog = catalog.filter(Boolean);
    
    await fs.writeFile(CATALOG_FILE, JSON.stringify(validCatalog, null, 2));
    console.log(`✅ Catálogo generado con ${validCatalog.length} exámenes validados.`);
    
  } catch (error) {
    console.error('💥 Error fatal en el sistema de catálogo:', error);
    process.exit(1);
  }
}

generateCatalog();
