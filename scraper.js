// Import required libraries
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Define the scraping route
app.get('/scrape', async (req, res) => {
  try {
    // Fetch the HTML of the Times Now homepage
    const { data } = await axios.get('https://timesofindia.indiatimes.com/');
    
    // Load the HTML into cheerio
    const $ = cheerio.load(data);
    let articles = [];

    // Select the news articles (update the selector based on the actual structure)
    $('.news-card').each((i, el) => {
      const title = $(el).find('.title').text().trim(); // Adjust the class name as needed
      const link = $(el).find('a').attr('href'); // Get the href attribute for the link
      const description = $(el).find('.description').text().trim(); // Get the description
      
      // Push the article data into the articles array
      if (title && link) { // Ensure title and link are not empty
        articles.push({ title, link, description });
      }
    });

    // Send the scraped articles as JSON response
    res.json(articles);
  } catch (error) {
    console.error('Error occurred while scraping:', error);
    res.status(500).send('Error occurred while scraping');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});