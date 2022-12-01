import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`Write me 4 detailed chapter titles for a short story with the title below:

Title: 
`

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 200,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();
  console.log(basePromptOutput)

  const secondPrompt = 
  `
  Take the chapter titles and the title of the short story below and generate a short story as if a cat were telling it.

  Title: ${req.body.userInput}

  Chapter Titles: ${basePromptOutput.text}

  Story:
  `
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.7,
		// I also increase max_tokens.
    max_tokens: 1000,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });};

export default generateAction;
