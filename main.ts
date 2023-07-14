import { Configuration, OpenAIApi } from "openai";
import { ChatCompletionRequestMessageRoleEnum } from "openai/api";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { configDotenv } from "dotenv";

configDotenv();

const prettify = (obj: any) => JSON.stringify(obj, undefined, 2);

const apiKey = process.env.API_KEY;

const configuration = new Configuration({
  apiKey,
});

const openaiClient = new OpenAIApi(configuration);

const schema = z.object({
  questions: z.array(
    z.object({
      name: z.string(),
      email: z.string().email(),
      role: z.enum(["admin", "user"]),
    })
  ),
});

const main = async () => {
  const jsonSchema = zodToJsonSchema(schema);
  console.log("jsonSchema", JSON.stringify(jsonSchema, undefined, 2));

  const res = await openaiClient
    .createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: "ダミーのデータを5人分生成してください",
        },
      ],
      functions: [
        {
          name: "createUserData",
          parameters: jsonSchema,
        },
      ],
    })
    .catch((err) => {
      console.error(err.message);
      return undefined;
    });

  const functionCall = JSON.parse(
    res?.data.choices.at(0)?.message?.function_call?.arguments
  );

  console.log(prettify(functionCall));
  // console.log(prettify(schema.safeParse(functionCall)));
};

main();
