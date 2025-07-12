export interface SuggestedQuestionsCategory {
  title: string;
  icon: string;
  color: string;
  count: number;
  questions: string[];
}

// Fallback interface for backward compatibility
export interface SuggestedQuestion extends SuggestedQuestionsCategory {}

export const suggestedQuestionsData: SuggestedQuestionsCategory[] = [
  {
    title: "GEO Grid Insights",
    icon: "map-pin",
    color: "#007cf3",
    count: 12,
    questions: [
      "Can you list all pins with area name, coordinates, and our rank at each pin?",
      "Which pins have missing or invalid rank data?",
      "Can you provide a clean table of pin data ready for mapping?",
      "How many pins show our business ranking in top 3?",
      "Which pins show our business ranked below position 3?",
      "What percentage of pins are underperforming?",
      "Can you calculate the % of pins ranking in top 3?",
      "Can you generate an executive summary of the GEO Grid scan?",
      "Can you highlight the strongest and weakest locations?",
      "Can you provide a plain-English summary of results?",
      "Can you list the top 3 recurring competitors across the grid?",
      "Can you export the rankings in CSV or JSON format?"
    ]
  },
  {
    title: "Clustering & Location Strategy",
    icon: "milestone",
    color: "#d68300",
    count: 9,
    questions: [
      "Can you group underperforming pins into clusters within 2 km?",
      "Can you list clusters with main hub and sublocations?",
      "Which cluster has the highest number of underperforming pins?",
      "Can you generate coordinates for each cluster center?",
      "Can you provide a distance matrix between the clusters?",
      "Can you generate SEO-friendly URLs for each cluster?",
      "Can you create a URL map showing main and sublocations?",
      "Can you suggest internal linking logic for these silo URLs?",
      "Can you provide sample URL slugs for each area?"
    ]
  },
  {
    title: "Competitor & Visibility Planning",
    icon: "bar-chart-3",
    color: "#d60000",
    count: 6,
    questions: [
      "Can you identify common competitors at these weak locations?",
      "Can you provide suggestions for improving visibility in these areas?",
      "Identify and list the top 3 competitors who appear most frequently in the top 3 positions where we underperform.",
      "share me proper plan to rank on underperforming locations",
      "Provide 3 high-level recommendations on how to improve visibility in these underperforming areas.",
      "Can you match these URLs with the business category?"
    ]
  },
  {
    title: "Content Recommendations",
    icon: "file-text",
    color: "#7e18c7",
    count: 11,
    questions: [
      "Can you generate content outlines for each underperforming location?",
      "What H1 and H2 headings do you recommend for under performing pin pages",
      "Can you suggest local FAQs to include?",
      "Can you provide section titles for service, reviews, and directions?",
      "Can you format this as a table ready for a content writer?",
      "Can you provide draft content blocks mentioning local POIs?",
      "What landmarks should be referenced for each location?",
      "Can you generate location-specific CTAs?",
      "Can you suggest opening paragraphs for these pages?",
      "Can you format content blocks for website upload?",
      "Can you provide draft content blocks mentioning local POIs?"
    ]
  },
  {
    title: "Review Analysis & Timing",
    icon: "message-square",
    color: "#3e8302",
    count: 10,
    questions: [
      "Can you list top positive keywords from reviews?",
      "Can you list top negative keywords from reviews?",
      "Can you identify common themes in customer reviews?",
      "Can you suggest how to incorporate these keywords in content?",
      "Can you summarize sentiment trends from reviews?",
      "What are the busiest times across all locations?",
      "Can you list peak hours by day of week?",
      "Can you recommend optimal posting times based on this?",
      "Can you suggest time slots for promotions or ads?",
      "Can you compare current popular times with historical data?"
    ]
  }
];