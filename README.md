ভাই, নিচেরটা `README.md`-তে paste করো। এতে রঙিন flow diagram আছে, যাতে বোঝা যায় অ্যাপটা কীভাবে কাজ করে। **GitHub-এর Mermaid diagram স্থির থাকে**—এটা 3D animation নয়। Animation দেখাতে আলাদা GIF যোগ করতে হবে।


# 🎯 LeadScout

### Find conversations. Discover opportunities.

LeadScout helps you find public discussions related to a product, topic, or idea. Search once and explore relevant Hacker News posts and comments with links to their original sources.

---

## 🚀 How It Works

```mermaid
flowchart LR
    A["✍️ Enter a product<br/>or search topic"] --> B["🌐 Browser sends<br/>the search request"]
    B --> C["🔎 Hacker News<br/>Algolia API"]
    C --> D["📋 View posts<br/>and comments"]
    D --> E["🔗 Open the<br/>original link"]

    style A fill:#7c3aed,stroke:#a78bfa,color:#fff
    style B fill:#2563eb,stroke:#60a5fa,color:#fff
    style C fill:#0891b2,stroke:#22d3ee,color:#fff
    style D fill:#059669,stroke:#34d399,color:#fff
    style E fill:#ea580c,stroke:#fb923c,color:#fff

    linkStyle default stroke:#94a3b8,stroke-width:2px
```

### Example

1. Enter a topic such as **“SaaS”**.
2. LeadScout searches public Hacker News content.
3. Browse matching posts and comments.
4. Open the original links to explore the conversation.

---

## ✨ Features

- 🔍 Search by product name or topic
- 💬 Discover public posts and comments
- 👤 See the author and date when available
- 🔗 Open original posts and linked articles
- 🖼️ Display images when a direct image link is available
- 📄 Choose **20 or 50 results** per page
- ➡️ Navigate using **Next** and **Previous**
- 🎨 Responsive result cards with hover and loading animations

## 🌐 Data Source

LeadScout currently uses the **Hacker News Algolia API**.

Search requests go directly from the user's browser to the API. The provider may see the user's public IP address and search query.

> Results are public discussions and potential opportunities—not verified customer leads.

## 📌 Current Limitations

- Results currently come from Hacker News only.
- LinkedIn, Reddit, and X are not integrated yet.
- API availability and usage limits depend on the provider.
- Images are shown only when a suitable direct image link is available.

## 🛠️ Built with Turbofy

This repository contains **Turbofy app source files**. It is not currently a standalone website that can be run independently without the Turbofy platform.

## 🗺️ Future Improvements

- Add more data sources
- Add caching and rate-limit handling
- Improve filters and lead management
- Add a dedicated animated product walkthrough
