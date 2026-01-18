# Learning Hub Content & Structure Plan

This plan describes how to organize and manage learning topics, sections, and articles using JSON files in the assets folder. This approach enables a simple CMS-like experience for adding and updating content.

## 1. Directory Structure (in `src/assets`)

- `topics.json` — List of all learning topics (Angular, React, .NET, etc.)
- `topics/` — Folder containing one JSON file per topic, e.g.:
  - `angular.json`
  - `react.json`
  - `dotnet.json`
  - `git.json`
  - `docker.json`

## 2. topics.json Example

```json
[
  {
    "id": "angular",
    "title": "Angular",
    "icon": "angular.svg"
  },
  {
    "id": "react",
    "title": "React",
    "icon": "react.svg"
  }
  // ...more topics
]
```

## 3. Topic File Example (e.g. `angular.json`)

```json
{
  "id": "angular",
  "title": "Angular",
  "sections": [
    {
      "id": "basics",
      "title": "Basics",
      "articles": [
        {
          "id": "intro",
          "title": "Introduction to Angular",
          "content": "...markdown or HTML content..."
        },
        {
          "id": "components",
          "title": "Components",
          "content": "..."
        }
      ]
    },
    {
      "id": "advanced",
      "title": "Advanced Topics",
      "articles": [
        // ...
      ]
    }
  ]
}
```

## 4. Dashboard Features
- List all topics with counts of sections and articles (read from JSON)
- Link to each topic's page

## 5. Topic Page Features
- List all sections and articles for the topic
- View article content
- (Future) Add/edit articles by updating JSON files

## 6. Next Steps
1. Create `src/assets/topics.json` and `src/assets/topics/` with sample data
2. Build Angular services to load and parse these JSON files
3. Create dashboard and topic pages to display content
4. Plan for future CMS-like editing (optional)

---

> Update this plan as your requirements grow!