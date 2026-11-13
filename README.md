# 🎯 LeadScout

### Find conversations. Discover opportunities.

<p align="center">
  <img
    src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=21&duration=2500&pause=900&color=8B5CF6&center=true&vCenter=true&width=750&lines=1.+User+enters+a+search+topic;2.+Browser+sends+the+search+request;3.+Hacker+News+API+finds+matches;4.+Posts+and+comments+appear;5.+User+opens+the+original+link"
    alt="Animated LeadScout search flow"
  />
</p>

---

## 💡 What is LeadScout?

LeadScout helps you discover public discussions related to a product, topic, or idea.

Enter a search term and explore relevant Hacker News posts and comments—all in one place.

---

## ⚡ How It Works

<table align="center">
  <tr>
    <td align="center">

### 🟣 1. Enter a topic

Type a product name or topic, such as **SaaS**.

    </td>
  </tr>
  <tr><td align="center">⬇️</td></tr>
  <tr>
    <td align="center">

### 🔵 2. Search

Your browser sends the search request to the Hacker News Algolia API.

    </td>
  </tr>
  <tr><td align="center">⬇️</td></tr>
  <tr>
    <td align="center">

### 🟠 3. Explore results

LeadScout displays matching public posts and comments.

    </td>
  </tr>
  <tr><td align="center">⬇️</td></tr>
  <tr>
    <td align="center">

### 🟢 4. Open the source

Visit the original post or linked article to learn more.

    </td>
  </tr>
</table>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 Search | Find public discussions by product or topic |
| 💬 Posts & comments | Browse matching Hacker News content |
| 👤 Details | See authors and dates when available |
| 🔗 Source links | Open original posts and linked articles |
| 🖼️ Images | See images when a direct image link is available |
| 📄 Pagination | Choose 20 or 50 results per page |
| 🎨 Responsive cards | Browse results with hover and loading animations |

---

## 🌐 Data Source

LeadScout currently uses the **Hacker News Algolia API**.

Search requests are sent directly from the user's browser to the API. The provider may see the user's public IP address and search query.

> Search results are public discussions and potential opportunities—not verified customer leads.

## 📌 Current Limitations

- Results currently come from Hacker News only.
- LinkedIn, Reddit, and X are not integrated yet.
- API availability and usage limits depend on the provider.
- Images appear only when a suitable direct image link is available.

## 🛠️ Built with Turbofy

This repository contains **Turbofy app source files**. It is not currently a standalone website that can run independently without the Turbofy platform.

## 🗺️ Future Improvements

- Add more data sources
- Add caching and rate-limit handling
- Improve filters and lead management
