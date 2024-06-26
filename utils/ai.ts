import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { OutputFixingParser, StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import z from 'zod';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe('is the journal entry negative? (i.e. does it contain negative emotions?).'),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.',
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.',
      ),
  }),
);

const getPrompt = async (content: any) => {
  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{formatInstructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { formatInstructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyzeEntry = async (content: any) => {
  const input = await getPrompt(content);
  const model = new ChatOpenAI({
    temperature: 0,
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  });
  const output = await model.invoke(input);

  try {
    return await parser.parse(output.content as string);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0, model: 'gpt-4o' }),
      parser,
    );
    const fix = await fixParser.parse(output.content as string);
    return fix;
  }
};
