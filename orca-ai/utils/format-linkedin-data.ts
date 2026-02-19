import { CollectedLinkedInData } from '../types';

// Truncates text at a word boundary and appends … so the LLM knows it was cut.
const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
};

/**
 * Formats CollectedLinkedInData into a readable string for LLM consumption.
 * Pure formatting — no prompt instructions, no fallback placeholders.
 * Omits fields that have no data rather than showing placeholders.
 */
export const formatLinkedInData = (data: CollectedLinkedInData): string => {
  const sections: string[] = [];

  // Profile
  const p = data.profile;
  const profileFields = [
    p.full_name && `- Name: ${p.full_name}`,
    p.headline && `- Headline: ${p.headline}`,
    p.location && `- Location: ${p.location}`,
    p.company && `- Company: ${p.company}${p.job_title ? ` (${p.job_title})` : ''}`,
    p.about && `- About: ${p.about}`,
    p.connection_count != null && `- Connections: ${p.connection_count}`,
    p.follower_count != null && `- Followers: ${p.follower_count}`,
    p.linkedin_url && `- LinkedIn URL: ${p.linkedin_url}`,
  ].filter(Boolean);
  sections.push(`## Profile\n${profileFields.join('\n')}`);

  // Posts
  if (data.posts.length > 0) {
    const postsList = data.posts
      .map((post, i) => {
        const header = [`### Post ${i + 1}`];
        if (post.posted) header.push(`(${post.posted})`);
        if (post.urn) header.push(`[URN: ${post.urn}]`);
        if (post.post_url) header.push(`[URL: ${post.post_url}]`);

        const lines = [header.join(' ')];
        if (post.text) lines.push(post.text);
        lines.push(
          `Reactions: ${post.num_reactions ?? 0} | Comments: ${post.num_comments ?? 0} | Reposts: ${post.num_reposts ?? 0}`,
        );
        return lines.join('\n');
      })
      .join('\n\n');
    sections.push(`## Posts (${data.posts.length})\n${postsList}`);
  }

  // Comments
  if (data.comments.length > 0) {
    const commentsList = data.comments
      .map((c, i) => {
        const header = [`### Comment ${i + 1}`];
        if (c.posted) header.push(`(${c.posted})`);

        const posterName = [c.poster?.first, c.poster?.last].filter(Boolean).join(' ');
        const posterUrl = c.poster?.linkedin_url || c.poster_linkedin_url;
        const posterRef = posterName && posterUrl ? `${posterName} (${posterUrl})` : posterName;
        const lines = [header.join(' ')];
        if (c.post_url) lines.push(`Post URL: ${c.post_url}`);
        if (posterRef && c.text) lines.push(`On post by ${posterRef}: "${truncate(c.text, 200)}"`);
        if (c.highlighted_comments?.length) lines.push(`Their comment: ${c.highlighted_comments.join(' | ')}`);
        return lines.join('\n');
      })
      .join('\n\n');
    sections.push(`## Comments (${data.comments.length})\n${commentsList}`);
  }

  // Reactions
  if (data.reactions.length > 0) {
    const reactionsList = data.reactions
      .map((r, i) => {
        const header = [`### Reaction ${i + 1}`];
        if (r.posted) header.push(`(${r.posted})`);

        const posterName = [r.poster?.first, r.poster?.last].filter(Boolean).join(' ');
        const posterUrl = r.poster?.linkedin_url || r.poster_linkedin_url;
        const posterRef = posterName && posterUrl ? `${posterName} (${posterUrl})` : posterName;
        const lines = [header.join(' ')];
        if (r.post_url) lines.push(`Post URL: ${r.post_url}`);
        if (posterRef && r.text) lines.push(`Reacted to post by ${posterRef}: "${truncate(r.text, 200)}"`);
        return lines.join('\n');
      })
      .join('\n\n');
    sections.push(`## Reactions (${data.reactions.length})\n${reactionsList}`);
  }

  // Top posts engagement
  if (data.topPostsEngagement.length > 0) {
    data.topPostsEngagement.forEach((tpe, i) => {
      const heading = data.topPostsEngagement.length > 1 ? `## Top Post #${i + 1} Deep Dive` : '## Top Post Deep Dive';
      const lines = [heading];

      if (tpe.post.post_url) lines.push(`URL: ${tpe.post.post_url}`);
      if (tpe.post.text) lines.push(`Post: "${truncate(tpe.post.text, 300)}"`);
      lines.push(`Reactions: ${tpe.post.num_reactions ?? 0} | Comments: ${tpe.post.num_comments ?? 0}`);

      if (tpe.comments.length > 0) {
        lines.push(`\n### Comments on Post (${tpe.comments.length})`);
        tpe.comments.forEach((c) => {
          const name = c.commenter?.name;
          const url = c.commenter?.linkedin_url;
          const nameRef = name && url ? `${name} (${url})` : name;
          const text = c.text ? truncate(c.text, 150) : undefined;
          if (nameRef && text) lines.push(`- ${nameRef}: "${text}"`);
        });
      }

      if (tpe.reactions.length > 0) {
        lines.push(`\n### Reactions on Post (${tpe.reactions.length})`);
        tpe.reactions.forEach((r) => {
          const name = r.reactor?.name;
          const url = r.reactor?.linkedin_url;
          const type = r.type;
          const nameRef = name && url ? `${name} (${url})` : name;
          if (nameRef) lines.push(`- ${nameRef}${type ? ` [${type}]` : ''}`);
        });
      }

      sections.push(lines.join('\n'));
    });
  }

  return sections.join('\n\n---\n\n');
};
