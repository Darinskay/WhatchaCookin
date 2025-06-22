# OpenAI Integration Setup for WhatchaCookin

This guide will help you set up the OpenAI integration for AI-powered recipe generation in your WhatchaCookin app.

## Prerequisites

1. **OpenAI Account**: You need an OpenAI account with API access
2. **API Key**: Generate an API key from your OpenAI dashboard
3. **Credits**: Ensure you have sufficient credits in your OpenAI account

## Getting Your OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to the API section
4. Go to "API Keys" in your dashboard
5. Click "Create new secret key"
6. Copy the generated key (you won't be able to see it again!)

## Configuration

1. **Create Environment File**:
   ```bash
   cp .env.example .env
   ```

2. **Add Your API Key**:
   Open the `.env` file and replace `your_openai_api_key_here` with your actual API key:
   ```
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## Features

### 🥘 AI Recipe Generation
- **Fridge-to-Recipe**: Input ingredients you have, get personalized recipes
- **Smart Suggestions**: AI considers dietary restrictions and preferences
- **Multiple Options**: Generate 3 different recipe variations at once
- **Detailed Recipes**: Complete with ingredients, instructions, tips, and nutrition info

### 🎯 Customization Options
- **Cuisine Preferences**: Italian, Mediterranean, Asian, Mexican, and more
- **Cooking Time**: Quick (15 min), Medium (30 min), or Long (1 hour)
- **Difficulty Levels**: Easy, Medium, or Hard
- **Dietary Restrictions**: Vegetarian, Vegan, Gluten-Free, Keto, etc.
- **Serving Sizes**: 1-8 servings

### 💾 Recipe Management
- **Favorites**: Save recipes you love
- **History**: Access previously generated recipes
- **Sharing**: Share recipes via text or native sharing
- **Cooking Mode**: Interactive step-by-step cooking experience

## Usage

1. **Add Ingredients**: Type ingredients you have in your fridge
2. **Set Preferences**: Choose cuisine, time, difficulty (optional)
3. **Generate**: Click "Generate Recipe!" for one recipe or "Get 3 Recipe Options" for multiple
4. **Cook**: Follow the detailed instructions, check off steps as you go
5. **Save**: Add favorites to your personal collection

## API Usage and Costs

- **Model Used**: GPT-3.5-turbo (cost-effective and fast)
- **Estimated Cost**: ~$0.002-0.005 per recipe generation
- **Rate Limits**: Respects OpenAI's rate limits
- **Error Handling**: Graceful fallbacks if API is unavailable

## Troubleshooting

### Common Issues

1. **"Failed to generate recipe"**
   - Check your API key is correct
   - Verify you have credits in your OpenAI account
   - Check your internet connection

2. **"No response from OpenAI"**
   - OpenAI might be experiencing downtime
   - Check [OpenAI Status Page](https://status.openai.com/)

3. **Rate limit errors**
   - You're making too many requests too quickly
   - Wait a moment and try again

### Debug Mode

To see detailed error messages, open your browser's developer console (F12) and check for any error logs.

## Security Notes

⚠️ **Important**: 
- Never commit your actual API key to version control
- The current setup uses `dangerouslyAllowBrowser: true` for development
- **For production**, move API calls to a backend server to keep your API key secure
- Consider implementing usage limits to control costs

## Production Deployment

For production deployments:

1. **Backend API**: Create a backend service to handle OpenAI requests
2. **Environment Variables**: Use secure environment variable management
3. **Rate Limiting**: Implement user-based rate limiting
4. **Caching**: Cache common recipe requests to reduce API costs
5. **Error Monitoring**: Set up proper error tracking and monitoring

## Support

If you encounter issues:
1. Check this documentation first
2. Review the browser console for errors
3. Verify your OpenAI account status
4. Check the app's GitHub issues

## Features Roadmap

- 🔄 Recipe variations and modifications
- 📱 Offline recipe storage
- 🛒 Shopping list generation
- 👥 Recipe sharing with other users
- 🎨 Recipe image generation
- 🍽️ Meal planning integration

---

**Happy Cooking!** 🍳✨ 