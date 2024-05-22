const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");  // Import fs module to handle file deletion

const classNames = [
  "Espaço Acotirene",
  "Espaço Aqualtune",
  "Espaço Caá-Pueira",
  "Espaço Ganga Zumba",
  "Espaço Quilombo dos Palmares",
  "Espaço Zumbi",
  "Espaço Onjó Cruzambe",
  "Espaço Oxile das Ervas",
  "Espaço Muxima de Palmares",
  "Espaço Atalaia Acaiene",
  "Espaço Ocas indígenas",
  "Espaço Batucajé",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp and file extension
  },
});

const upload = multer({ storage: storage });
let model;

async function loadModel() {
  const modelPath = "file://" + path.join(__dirname, "../assets/symbol-model.json");
  model = await tf.loadLayersModel(modelPath);
}
loadModel();

exports.predictImage = [
  upload.single("image"),
  async (req, res) => {
    if (!model) {
      return res.status(500).send("Modelo de machine learning não carregado.");
    }
    try {
      const imageBuffer = await sharp(req.file.path)
        .resize(224, 224)
        .toBuffer();
      const tensor = tf.node
        .decodeImage(imageBuffer, 3)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims();
      const predictions = await model.predict(tensor);
      const probabilities = predictions.dataSync();
      const highestProbIndex = probabilities.indexOf(Math.max(...probabilities));

      if (probabilities[highestProbIndex] > 0.5) {
        const className = classNames[highestProbIndex];
        res.json({ recognized: true, className: className });
      } else {
        res.status(400).json({ error: "Imagem não reconhecida" });
      }
    } catch (error) {
      console.error("Erro ao processar a imagem:", error);
      res.status(500).json({
        error: "Erro ao processar a imagem",
        message: error.message,
      });
    } finally {
      // Delete the image file after processing
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Failed to delete image file:", err);
        } else {
          console.log("Successfully deleted image file:", req.file.path);
        }
      });
    }
  },
];
