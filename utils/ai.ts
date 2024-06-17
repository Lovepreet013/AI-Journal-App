import { OpenAI } from "@langchain/openai"
import {z} from "zod"
import {StructuredOutputParser} from "langchain/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import {loadQARefineChain} from "langchain/chains"
import { OpenAIEmbeddings } from "@langchain/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const parser = StructuredOutputParser.fromZodSchema(  //Our Prompt for the JSON that we want from the AI
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
    sentimentScore: z
    .number()
    .describe(
      'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
    ),
  })
)

const getPrompt = async (content) => { //this is the whole prompt that we are giving to AI
    const format_instructions = parser.getFormatInstructions()

    const prompt = new PromptTemplate({ //Here we are giving prompt to AI and telling that input variable is what that will be replaced when formatting the template and partialVariables: Variables that are provided upfront and included in the template.

        template : `Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}`,
        inputVariables : ['entry'],   //this name and name in format function must be same
        partialVariables : {format_instructions}
    })

    const input = await prompt.format({ //Here we are initializing the replacing process i.e entry and format instructions.
        entry : content
    })

    // console.log(input)
    return input
}


export const analyze = async (content) => {
    const input = await getPrompt(content)

    const model = new OpenAI({ temperature : 0, modelName : 'gpt-3.5-turbo'})
    const result = await model.invoke(input)
    // console.log(result)

    try{
        return parser.parse(result) //parse the result according to the parser which is schema for type check
    }catch(e){
        console.log(e)
    }
}

export const qa = async (question, entries) => {
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: { source: entry.id, date: entry.createdAt },
      })
  )
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const chain = loadQARefineChain(model)
  const embeddings = new OpenAIEmbeddings()
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
  const relevantDocs = await store.similaritySearch(question)
  const res = await chain.invoke({
    input_documents: relevantDocs,
    question,
  })

  return res.output_text
}