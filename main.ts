import { OpenAI } from "openai";
// import { z } from "zod";
// import { zodToJsonSchema } from "zod-to-json-schema";

const prettify = (obj: any) => JSON.stringify(obj, undefined, 2);

const apiKey = process.env.API_KEY;

const openaiClient = new OpenAI({
  apiKey,
});

const main = async () => {
  // const jsonSchema = zodToJsonSchema(schema);
  // console.log("jsonSchema", JSON.stringify(jsonSchema, undefined, 2));

  const res = await openaiClient.chat.completions
    .create({
      max_tokens: 500,
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: "ダミーのアンケートへの回答データを5人分生成してください",
        },
      ],
    })
    .catch((err) => {
      console.error(err.message);
      return undefined;
    });

  console.log(prettify(res));
  // console.log(prettify(schema.safeParse(functionCall)));
};

main();
