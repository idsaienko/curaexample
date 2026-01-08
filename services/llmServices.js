const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Takes a free-text nursing report and returns structured JSON
 */
async function extractReportData(reportText) {
  if (!reportText || !reportText.trim()) {
    throw new Error("Report text is required");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
          Du bist ein medizinischer Assistent.
          Analysiere einen Pflegebericht und extrahiere strukturierte Daten.

          Gib AUSSCHLIESSLICH gültiges JSON im folgenden Format zurück:

          {
            "mealSchedules": [],
            "movements": [],
            "ausscheidungen": []
          }

          Regeln:
          - Keine erklärenden Texte
          - Keine Markdown-Formatierung
          - Leere Arrays, wenn nichts gefunden wurde
          `
      },
      {
        role: "user",
        content: reportText
      }
    ]
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("LLM returned empty response");
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Invalid JSON from LLM:", content);
    throw new Error("LLM returned invalid JSON");
  }
}

module.exports = {
  extractReportData
};
