# LeadScout

LeadScout is a lead-discovery app that helps users find public discussions related to a product, topic, or idea.

Enter a search term to discover relevant Hacker News posts and comments, then open the original links to learn more.

## Features

- Search public Hacker News posts and comments
- View authors, dates, and links where available
- Display images when a direct image link is available
- Choose between 20 or 50 results per page
- Navigate results with Next and Previous controls
- Responsive cards with loading and hover animations

## Data source

Search results currently come from the Hacker News Algolia API. LinkedIn, Reddit, and X results are not yet integrated.

Search requests are sent from the user's browser to the API. Results depend on the provider's availability and usage limits. Search results are potential opportunities, not verified customer leads.

## Built with Turbofy

This repository contains Turbofy app source files. It is not currently a standalone website that can be run independently without the Turbofy platform.

## Future improvements

- Add more supported data sources
- Add caching and rate-limit handling
- Improve filtering and lead management
