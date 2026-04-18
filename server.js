import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * Función para mezclar un array (Algoritmo Fisher-Yates).
 */
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Endpoint para listar los exámenes disponibles.
 */
app.get('/api/examenes', async (req, res) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const files = await readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const examenes = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dataDir, file);
        const data = await readFile(filePath, 'utf8');
        const json = JSON.parse(data);
        return {
          id: file.replace('.json', ''),
          materia: json.materia,
          titulo: json.titulo
        };
      })
    );
    res.json(examenes);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron listar los exámenes.' });
  }
});

/**
 * Endpoint para obtener un examen específico por su ID (nombre de archivo).
 */
app.get('/api/examen/:id', async (req, res) => {
  try {
    const examId = req.params.id;
    
    // 🔒 Seguridad: Sanitizar el ID para evitar Path Traversal
    const sanitizedId = examId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!sanitizedId || sanitizedId !== examId) {
      return res.status(400).json({ error: 'ID de examen no válido.' });
    }

    const dataPath = path.join(__dirname, 'data', `${sanitizedId}.json`);
    const rawData = await readFile(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Si el JSON es solo un array de preguntas, lo envolvemos en un objeto genérico
    let examen = Array.isArray(data) ? {
      materia: "Examen Genérico",
      titulo: examId,
      duracion: 0,
      preguntas_para_aprobar: Math.ceil(data.length * 0.6),
      fecha: new Date().toISOString().split('T')[0],
      total_preguntas: data.length,
      version: 1,
      preguntas: data
    } : data;

    // Mezclar las preguntas y opciones
    const shuffledQuestions = shuffle(examen.preguntas).map(pregunta => {
      const opcionesConId = pregunta.opciones.map((texto, index) => ({
        texto,
        id: index
      }));

      return {
        ...pregunta,
        opciones: shuffle(opcionesConId)
      };
    });

    res.json({
      ...examen,
      preguntas: shuffledQuestions
    });
  } catch (error) {
    console.error('Error al cargar el examen:', error);
    res.status(404).json({ error: 'Examen no encontrado.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ParseIt - Servidor dinámico listo en http://localhost:${PORT}`);
});
