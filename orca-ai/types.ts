// ---------------------------------------------------
// LinkedIn Profile
// ---------------------------------------------------

export interface LinkedInEducation {
  degree?: string;
  field_of_study?: string;
  school?: string;
  school_linkedin_url?: string;
  date_range?: string;
  start_year?: number;
  end_year?: number;
}

export interface LinkedInExperience {
  title?: string;
  company?: string;
  company_linkedin_url?: string;
  description?: string;
  date_range?: string;
  duration?: string;
  start_month?: number;
  start_year?: number;
  end_month?: number | string;
  end_year?: number | string;
  is_current?: boolean;
  job_type?: string;
  location?: string;
}

export interface LinkedInCertification {
  name?: string;
  authority?: string;
  issued?: string;
  url?: string | null;
}

export interface LinkedInProfile {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  headline?: string;
  about?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin_url?: string;
  public_id?: string;
  profile_id?: string;
  profile_image_url?: string;
  connection_count?: number;
  follower_count?: number;
  job_title?: string;
  email?: string;
  phone?: string;
  company?: string;
  company_description?: string | null;
  company_domain?: string;
  company_employee_count?: number | null;
  company_employee_range?: string | null;
  company_industry?: string | null;
  company_linkedin_url?: string;
  company_logo_url?: string | null;
  company_website?: string | null;
  company_year_founded?: number | null;
  current_company_join_year?: number;
  current_company_join_month?: number;
  current_job_duration?: string;
  school?: string;
  skills?: string;
  educations?: LinkedInEducation[];
  experiences?: LinkedInExperience[];
  certifications?: LinkedInCertification[];
  languages?: string[];
  is_creator?: boolean;
  is_influencer?: boolean;
  is_premium?: boolean;
  is_verified?: boolean;
  urn?: string;
}

// ---------------------------------------------------
// LinkedIn Post
// ---------------------------------------------------

// People or companies mentioned/tagged in a post
export interface LinkedInPostAttribute {
  type?: 'profile' | 'company';
  public_id?: string;
  // Profile fields
  first?: string;
  last?: string;
  headline?: string;
  urn?: string;
  // Company fields
  company_id?: string;
  name?: string;
}

export interface LinkedInPostPoster {
  first?: string;
  last?: string;
  headline?: string;
  image_url?: string;
  linkedin_url?: string;
  public_id?: string;
  urn?: string;
}

export interface LinkedInPostVideo {
  duration?: number;
  stream_url?: string;
}

export interface LinkedInPostDocument {
  page_count?: number;
  title?: string;
  url?: string;
}

export interface LinkedInPostImage {
  url?: string;
}

export interface LinkedInPost {
  // Present when fetched via activity scraper with type="comments"
  highlighted_comments?: string[];
  text?: string;
  urn?: string;
  post_url?: string;
  posted?: string;
  time?: string;
  reshared?: boolean;
  poster?: LinkedInPostPoster;
  poster_linkedin_url?: string;
  attributes?: LinkedInPostAttribute[];
  images?: LinkedInPostImage[];
  video?: LinkedInPostVideo;
  document?: LinkedInPostDocument;
  // Article (shared link)
  article_title?: string;
  article_subtitle?: string;
  article_description?: string;
  article_target_url?: string;
  // Engagement counts
  num_reactions?: number;
  num_likes?: number;
  num_comments?: number;
  num_reposts?: number;
  num_empathy?: number;
  num_appreciations?: number;
  num_praises?: number;
  num_interests?: number;
  num_entertainments?: number;
  // Reshare data (present when reshared=true)
  resharer_comment?: string;
  repost_urn?: string;
  reposted?: string;
  repost_stats?: {
    num_reactions?: number;
    num_likes?: number;
    num_comments?: number;
    num_reposts?: number;
    num_empathy?: number;
    num_appreciations?: number;
    num_praises?: number;
    num_interests?: number;
    num_maybe?: number;
  };
}

// ---------------------------------------------------
// LinkedIn Post Comment
// ---------------------------------------------------

export interface LinkedInCommentAuthor {
  name?: string;
  headline?: string;
  image_url?: string;
  linkedin_url?: string;
  urn?: string;
}

export interface LinkedInPostComment {
  annotation?: string | null;
  commenter?: LinkedInCommentAuthor;
  created_at?: number;
  created_datetime?: string;
  permalink?: string;
  pinned?: boolean;
  replies?: LinkedInPostComment[];
  text?: string;
  thread_urn?: string | null;
}

// ---------------------------------------------------
// LinkedIn Post Reaction
// ---------------------------------------------------

export interface LinkedInReactor {
  name?: string;
  headline?: string;
  linkedin_url?: string;
  urn?: string;
}

export interface LinkedInPostReaction {
  following_state?: string | null;
  reactor?: LinkedInReactor;
  type?: string;
}

// ---------------------------------------------------
// Collected LinkedIn Data (baseline scraping output)
// ---------------------------------------------------

export interface TopPostEngagement {
  post: LinkedInPost;
  comments: LinkedInPostComment[];
  reactions: LinkedInPostReaction[];
}

export interface CollectedLinkedInData {
  profile: LinkedInProfile;
  posts: LinkedInPost[];
  comments: LinkedInPost[];
  reactions: LinkedInPost[];
  topPostsEngagement: TopPostEngagement[];
  /** Pagination tokens from the last baseline page per activity type. Present only when more pages exist. */
  activityPaginationTokens: { posts?: string; comments?: string; reactions?: string };
}

// ---------------------------------------------------
// Insights
// ---------------------------------------------------

export interface InsightDefinition {
  name: string;
  description: string;
}

export interface Insight {
  name: string;
  content: string;
}

export interface ProfileAnalysis {
  profileUrl: string;
  profileName: string;
  insights: Insight[];
}

export interface AnalysisStats {
  collectDurationMs: number;
  analysisDurationMs: number;
  totalDurationMs: number;
  toolCallCount: number;
  insightCount: number;
}

// ---------------------------------------------------
// Progress Events
// ---------------------------------------------------

export interface ProgressEvent {
  message: string;
}

export type OnProgress = (event: ProgressEvent) => void;

// ---------------------------------------------------
// LinkedIn API Credits
// ---------------------------------------------------

export interface LinkedInApiCredits {
  limit: number;
  remaining: number;
}
