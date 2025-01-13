const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const BASE_URL = "http://localhost:3000/api";

describe("Teste de API Automatizado", () => {
  let token;

  beforeAll(async () => {});

  test("POST /login - Deve logar e retornar um token", async () => {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: "teste@exemplo.com",
      password: "senha123",
    });

    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();

    token = response.data.token;
  });

  test("POST /laboratorios/novo - Deve criar um novo laboratório", async () => {
    const formData = new FormData();
    formData.append("nome", "Laboratório de Teste");
    formData.append("descricao", "Descrição do laboratório");
    formData.append("capacidade", 50);

    const imagePath = "./jest/image/image.png";
    const imageStream = fs.createReadStream(imagePath);

    formData.append("foto", imageStream, "image.png");
    const response = await axios.post(
      `${BASE_URL}/laboratorios/novo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders(),
        },
      }
    );

    expect(response.status).toBe(201);
    expect(response.data.message).toBe("Laboratório criado com sucesso");
    expect(response.data.laboratorio.nome).toBe("Laboratório de Teste");
  });

  test("GET /laboratorios - should fetch all laboratories on weekdays", async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if ([0, 6].includes(dayOfWeek)) {
      try {
        await axios.get(`${BASE_URL}/laboratorios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        expect(error.response.status).toBe(403);
        expect(error.response.data.error).toBe(
          "Esta rota só pode ser acessada em dias úteis."
        );
      }
    } else {
      const response = await axios.get(`${BASE_URL}/laboratorios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.laboratorios).toBeInstanceOf(Array);
    }
  });
  test("GET /laboratorios/pdf - should generate and return a PDF file", async () => {
    const response = await axios.get(`${BASE_URL}/laboratorios/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      responseType: "arraybuffer",
    });

    console.log(response.headers);

    expect(response.status).toBe(200);

    const pdfBuffer = Buffer.from(response.data);
    fs.writeFileSync("laboratorio_test.pdf", pdfBuffer);

    const pdfFileExists = fs.existsSync("laboratorio_test.pdf");
    expect(pdfFileExists).toBe(true);

    fs.unlinkSync("laboratorio_test.pdf");
  });
});
