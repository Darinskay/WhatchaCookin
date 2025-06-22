import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export interface Recipe {
  name: string;
  description: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  nutritionHighlights?: string[];
}

export interface RecipeRequest {
  ingredients: string[];
  dietaryRestrictions?: string[];
  cuisinePreference?: string;
  cookingTime?: string;
  difficulty?: string;
  servings?: number;
  macronutrientFocus?: string[];
}

export const generateRecipe = async (request: RecipeRequest): Promise<Recipe> => {
  try {
    const prompt = createRecipePrompt(request);
    console.log('Generating recipe with prompt for ingredients:', request.ingredients);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a friendly, helpful chef assistant who creates delicious recipes based on available ingredients. CRITICAL: You must respond with ONLY valid JSON format - no markdown, no explanations, no additional text. Be encouraging and enthusiastic about cooking within the JSON content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    console.log('Raw OpenAI response:', response);

    // Parse the JSON response with error handling
    const recipe = parseRecipeResponse(response);
    console.log('Successfully parsed recipe:', recipe.name);
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is missing or invalid. Please check your .env file.');
      } else if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your account billing.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
    }
    
    throw new Error('Failed to generate recipe. Please try again.');
  }
};

const createRecipePrompt = (request: RecipeRequest): string => {
  const {
    ingredients,
    dietaryRestrictions = [],
    cuisinePreference,
    cookingTime,
    difficulty,
    servings = 4,
    macronutrientFocus = []
  } = request;

  let prompt = `Create a delicious recipe using these available ingredients: ${ingredients.join(', ')}.

Requirements:
- Servings: ${servings}
${cookingTime ? `- Cooking time: ${cookingTime}` : ''}
${difficulty ? `- Difficulty level: ${difficulty}` : ''}
${cuisinePreference ? `- Cuisine style: ${cuisinePreference}` : ''}
${dietaryRestrictions.length > 0 ? `- Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
${macronutrientFocus.length > 0 ? `- Focus on these macronutrients: ${macronutrientFocus.join(', ')} - emphasize ingredients and cooking methods that highlight these nutrients` : ''}

IMPORTANT: Respond with ONLY a valid JSON object. No markdown formatting, no code blocks, no additional text.

JSON format (copy exactly):
{
  "name": "Recipe Name Here",
  "description": "Brief appetizing description here",
  "cookingTime": "30 minutes",
  "difficulty": "Easy",
  "servings": ${servings},
  "ingredients": [
    "1 cup ingredient with exact amount",
    "2 tbsp another ingredient with amount"
  ],
  "instructions": [
    "First step with clear instruction",
    "Second step with clear instruction"
  ],
  "tips": [
    "Helpful cooking tip here",
    "Another useful tip here"
  ],
  "nutritionHighlights": [
    "Key nutritional benefit",
    "Another health benefit"
  ]
}

Make the recipe friendly and encouraging. Focus on using the provided ingredients. Include common pantry items if needed. Ensure all strings are properly quoted and no trailing commas exist.`;

  return prompt;
};

export const generateMultipleRecipes = async (
  request: RecipeRequest,
  count: number = 3
): Promise<Recipe[]> => {
  try {
    const promises = Array(count).fill(null).map(() => generateRecipe({
      ...request,
      // Add some variation for different recipes
      cuisinePreference: request.cuisinePreference || getRandomCuisine(),
    }));

    const recipes = await Promise.all(promises);
    return recipes;
  } catch (error) {
    console.error('Error generating multiple recipes:', error);
    throw new Error('Failed to generate recipes. Please try again.');
  }
};

const getRandomCuisine = (): string => {
  const cuisines = ['Italian', 'Mediterranean', 'Asian', 'Mexican', 'American', 'Indian', 'French'];
  return cuisines[Math.floor(Math.random() * cuisines.length)];
};

const parseRecipeResponse = (response: string): Recipe => {
  try {
    // First, try to parse as-is
    return JSON.parse(response) as Recipe;
  } catch (error) {
    console.warn('Initial JSON parse failed, attempting to clean response:', error);
    
    try {
      // Clean the response by extracting JSON from markdown or other formatting
      let cleanedResponse = response.trim();
      
      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Find JSON object boundaries
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      // Fix common JSON issues
      cleanedResponse = cleanedResponse
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix unescaped quotes in strings
        .replace(/: "([^"]*)"([^",\]\}]*)"([^",\]\}]*)",/g, ': "$1\\"$2\\"$3",')
        // Fix malformed arrays
        .replace(/,\s*]/g, ']')
        .replace(/,\s*}/g, '}');
      
      return JSON.parse(cleanedResponse) as Recipe;
    } catch (secondError) {
      console.error('Failed to parse cleaned response:', secondError);
      
      // As a last resort, create a fallback recipe
      return createFallbackRecipe(response);
    }
  }
};

const createFallbackRecipe = (originalResponse: string): Recipe => {
  console.warn('Creating fallback recipe due to JSON parsing failure');
  console.log('Original response that failed to parse:', originalResponse);
  
  // Try to extract some useful information from the malformed response
  const lines = originalResponse.split('\n').filter(line => line.trim());
  
  // Try to extract recipe name
  let recipeName = "Custom Recipe";
  const nameMatch = originalResponse.match(/"name":\s*"([^"]+)"/);
  if (nameMatch) {
    recipeName = nameMatch[1];
  }
  
  // Try to extract description
  let description = "A delicious recipe created just for you!";
  const descMatch = originalResponse.match(/"description":\s*"([^"]+)"/);
  if (descMatch) {
    description = descMatch[1];
  }
  
  // Try to extract ingredients
  let ingredients = [
    "Please check the console for the original response",
    "This is a fallback recipe due to formatting issues"
  ];
  const ingredientsMatch = originalResponse.match(/"ingredients":\s*\[(.*?)\]/s);
  if (ingredientsMatch) {
    try {
      const ingredientsList = ingredientsMatch[1]
        .split(',')
        .map(item => item.trim().replace(/"/g, ''))
        .filter(item => item.length > 0);
      if (ingredientsList.length > 0) {
        ingredients = ingredientsList;
      }
    } catch (e) {
      console.warn('Failed to extract ingredients from malformed response');
    }
  }
  
  // Try to extract instructions
  let instructions = [
    "Please check the console for the original response",
    "This fallback was created due to JSON parsing issues",
    "Try generating a new recipe for better results"
  ];
  const instructionsMatch = originalResponse.match(/"instructions":\s*\[(.*?)\]/s);
  if (instructionsMatch) {
    try {
      const instructionsList = instructionsMatch[1]
        .split(',')
        .map(item => item.trim().replace(/"/g, ''))
        .filter(item => item.length > 0);
      if (instructionsList.length > 0) {
        instructions = instructionsList;
      }
    } catch (e) {
      console.warn('Failed to extract instructions from malformed response');
    }
  }
  
  return {
    name: recipeName,
    description: description,
    cookingTime: "30 minutes",
    difficulty: "Easy" as const,
    servings: 4,
    ingredients: ingredients,
    instructions: instructions,
    tips: [
      "This recipe was recovered from a malformed AI response",
      "Try generating a new recipe for better results",
      "Check the browser console for the original response"
    ],
    nutritionHighlights: [
      "Nutritional information not available in fallback mode"
    ]
  };
}; 