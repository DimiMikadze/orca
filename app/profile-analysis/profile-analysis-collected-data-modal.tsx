'use client';

import type { CollectedLinkedInData } from '@/orca-ai/types';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type Section = 'profile' | 'posts' | 'comments' | 'reactions' | 'engagement';

interface CollectedDataModalProps {
  data: CollectedLinkedInData;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onClose: () => void;
}

const TABS: { key: Section; label: (data: CollectedLinkedInData) => string }[] = [
  { key: 'profile', label: () => 'Profile' },
  { key: 'posts', label: (d) => `Posts (${d.posts.length})` },
  { key: 'comments', label: (d) => `Comments (${d.comments.length})` },
  { key: 'reactions', label: (d) => `Reactions (${d.reactions.length})` },
  {
    key: 'engagement',
    label: (d) => {
      const count = d.topPostsEngagement.reduce((sum, tpe) => sum + tpe.comments.length + tpe.reactions.length, 0);
      return `Audience Engagements (${count})`;
    },
  },
];

export const ProfileAnalysisCollectedDataModal = ({
  data,
  activeSection,
  onSectionChange,
  onClose,
}: CollectedDataModalProps) => {
  const { profile, posts, comments, reactions, topPostsEngagement } = data;
  const firstName = profile.first_name || profile.full_name?.split(' ')[0] || 'Profile';

  const profileUrl = profile.linkedin_url?.replace(/\/$/, '');

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent showCloseButton={false} className='sm:max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0' aria-describedby={undefined}>
        <DialogTitle className='sr-only'>Collected LinkedIn Data</DialogTitle>
        {/* Header */}
        <div className='flex items-center px-6 pt-5 pb-4 border-b border-border shrink-0'>
          <div className='flex gap-1 flex-wrap'>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onSectionChange(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === tab.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-background-light'
                }`}
              >
                {tab.label(data)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className='overflow-y-auto px-6 py-5'>
          {activeSection === 'profile' && (
            <div>
              <p className='text-foreground'>
                {profile.full_name} — {profile.headline}
              </p>
              <p className='text-foreground-secondary text-sm'>
                {profile.job_title} at {profile.company} · {profile.location}
              </p>
              <p className='text-foreground-secondary text-sm'>
                {profile.connection_count} connections · {profile.follower_count} followers
              </p>
              {profile.about && (
                <p className='whitespace-pre-wrap mt-3 text-sm text-foreground-secondary'>{profile.about}</p>
              )}
              {profile.experiences && profile.experiences.length > 0 && (
                <div className='mt-3 text-sm text-foreground-secondary'>
                  {profile.experiences.map((exp, i) => (
                    <p key={i}>
                      {exp.title} at {exp.company} ({exp.date_range})
                    </p>
                  ))}
                </div>
              )}
              {profile.educations && profile.educations.length > 0 && (
                <div className='mt-3 text-sm text-foreground-secondary'>
                  {profile.educations.map((edu, i) => (
                    <p key={i}>
                      {edu.degree}
                      {edu.field_of_study ? ` in ${edu.field_of_study}` : ''} — {edu.school} ({edu.date_range})
                    </p>
                  ))}
                </div>
              )}
              {profile.skills && <p className='mt-3 text-sm text-foreground-secondary'>Skills: {profile.skills}</p>}
            </div>
          )}

          {activeSection === 'posts' && (
            <div>
              {posts.map((post, i) => (
                <div key={i} className='mb-4 pb-4 border-b border-border last:border-0'>
                  <p className='whitespace-pre-wrap text-sm text-foreground-secondary'>{post.text}</p>
                  {post.article_title && (
                    <p className='text-foreground-secondary text-xs mt-1'>Article: {post.article_title}</p>
                  )}
                  <p className='text-foreground-secondary text-xs mt-2'>
                    {post.posted}
                    {post.reshared ? ' · reshared' : ''} · {post.num_reactions ?? 0} reactions ·{' '}
                    {post.num_comments ?? 0} comments · {post.num_reposts ?? 0} reposts
                  </p>
                  {post.post_url && (
                    <a
                      href={post.post_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary text-xs hover:underline'
                    >
                      View post
                    </a>
                  )}
                </div>
              ))}
              {posts.length === 0 && <p className='text-sm text-foreground-secondary'>No posts collected.</p>}
            </div>
          )}

          {activeSection === 'comments' && (
            <div>
              {comments.map((item, i) => (
                <div key={i} className='mb-4 pb-4 border-b border-border last:border-0'>
                  {item.highlighted_comments?.[0] && (
                    <p className='text-sm text-foreground-secondary'>{item.highlighted_comments[0]}</p>
                  )}
                  <p className='text-foreground-secondary text-xs mt-1'>
                    on post by {item.poster?.first} {item.poster?.last}: {item.text?.slice(0, 120)}
                    {(item.text?.length ?? 0) > 120 ? '...' : ''}
                  </p>
                  <p className='text-foreground-secondary text-xs'>
                    {item.posted} · {item.num_reactions ?? 0} reactions · {item.num_comments ?? 0} comments
                  </p>
                  {item.post_url && (
                    <a
                      href={item.post_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary text-xs hover:underline'
                    >
                      View post
                    </a>
                  )}
                </div>
              ))}
              {comments.length === 0 && <p className='text-sm text-foreground-secondary'>No comments collected.</p>}
            </div>
          )}

          {activeSection === 'reactions' && (
            <div>
              {reactions.map((item, i) => (
                <div key={i} className='mb-4 pb-4 border-b border-border last:border-0'>
                  <p className='text-foreground-secondary text-xs'>
                    Post by {item.poster?.first} {item.poster?.last}
                  </p>
                  <p className='text-sm text-foreground-secondary'>
                    {item.text?.slice(0, 200)}
                    {(item.text?.length ?? 0) > 200 ? '...' : ''}
                  </p>
                  <p className='text-foreground-secondary text-xs mt-1'>
                    {item.posted} · {item.num_reactions ?? 0} reactions · {item.num_comments ?? 0} comments
                  </p>
                  {item.post_url && (
                    <a
                      href={item.post_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary text-xs hover:underline'
                    >
                      View post
                    </a>
                  )}
                </div>
              ))}
              {reactions.length === 0 && <p className='text-sm text-foreground-secondary'>No reactions collected.</p>}
            </div>
          )}

          {activeSection === 'engagement' && (
            <div className='space-y-8'>
              {topPostsEngagement.length === 0 && (
                <p className='text-sm text-foreground-secondary'>No engagement data collected.</p>
              )}
              {topPostsEngagement.map((tpe, postIndex) => {
                const postComments = tpe.comments.filter((c) => {
                  const commenterUrl = c.commenter?.linkedin_url?.replace(/\/$/, '');
                  return !profileUrl || !commenterUrl || commenterUrl !== profileUrl;
                });
                const postLabel = topPostsEngagement.length > 1 ? `Top Post #${postIndex + 1}` : 'Top Post';

                return (
                  <div key={postIndex} className='space-y-6'>
                    {topPostsEngagement.length > 1 && (
                      <p className='text-xs font-semibold text-foreground-secondary uppercase tracking-wide'>
                        {postLabel}
                      </p>
                    )}
                    {postComments.length > 0 && (
                      <section>
                        <h3 className='font-semibold text-foreground mb-3'>
                          Comments on {firstName}&apos;s {postLabel} ({postComments.length})
                        </h3>
                        {postComments.map((comment, i) => (
                          <div key={i} className='mb-3 pb-3 border-b border-border last:border-0'>
                            <p className='text-sm text-foreground-secondary'>
                              <strong className='text-foreground'>{comment.commenter?.name ?? 'Unknown'}</strong>:{' '}
                              {comment.text}
                            </p>
                            <p className='text-foreground-secondary text-xs mt-1'>
                              {comment.commenter?.headline} · {comment.created_datetime}
                            </p>
                            {comment.permalink && (
                              <a
                                href={comment.permalink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-primary text-xs hover:underline'
                              >
                                View comment
                              </a>
                            )}
                          </div>
                        ))}
                      </section>
                    )}
                    {tpe.reactions.length > 0 && (
                      <section>
                        <h3 className='font-semibold text-foreground mb-3'>
                          Reactions to {firstName}&apos;s {postLabel} ({tpe.reactions.length})
                        </h3>
                        {tpe.reactions.map((reaction, i) => (
                          <p key={i} className='mb-1 text-sm text-foreground-secondary'>
                            <strong className='text-foreground'>{reaction.reactor?.name ?? 'Unknown'}</strong> (
                            {reaction.type}) <span className='text-xs'>{reaction.reactor?.headline}</span>
                            {reaction.reactor?.linkedin_url && (
                              <>
                                {' · '}
                                <a
                                  href={reaction.reactor.linkedin_url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-primary text-xs hover:underline'
                                >
                                  Profile
                                </a>
                              </>
                            )}
                          </p>
                        ))}
                      </section>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
