import { NotificationType } from '../constants';
import { getUserById, notificationByAuthorUserAndType } from '../db';
import { sendEmail } from './email';
import { getEmailTemplate } from './emailTemplate';

interface sendNotificationEmailProps {
  userId: string;
  authorId: string;
  authorFullName: string;
  notificationType: string;
  postId?: string;
  appUrl: string;
}

export const sendNotificationEmail = async ({
  userId,
  authorId,
  authorFullName,
  notificationType,
  postId,
  appUrl,
}: sendNotificationEmailProps): Promise<void> => {
  // We don't want to send an email with the same content to the user.
  // However, we want to send an email when a user receives a like or comment on different posts.
  let searchWithPostId = null;
  if (notificationType === NotificationType.COMMENT || notificationType === NotificationType.LIKE) {
    searchWithPostId = postId;
  }
  // Check if a user has already got a similar notification email.
  const hasUnseenNotificationTypeFromAuthor = await notificationByAuthorUserAndType(
    userId,
    authorId,
    notificationType,
    searchWithPostId
  );

  if (hasUnseenNotificationTypeFromAuthor) {
    return;
  }

  const user = await getUserById(userId);

  const emailContent = {
    to: user.email,
    subject: '',
    html: '',
  };

  const emailTemplateOptions = {
    greeting: `Hey ${user.fullName}`,
    description: '',
    ctaLink: `${appUrl}/notifications`,
    ctaText: 'See all notifications',
  };

  switch (notificationType) {
    case NotificationType.COMMENT:
      emailContent.subject = `${authorFullName} has commented on your post.`;
      emailTemplateOptions.description = `<a href="${appUrl}/profile/${authorId}">${authorFullName}</a> has commented on your <a href="${appUrl}/post/${postId}">Post</a>.`;
      break;
    case NotificationType.LIKE:
      emailContent.subject = `${authorFullName} has liked your post.`;
      emailTemplateOptions.description = `<a href="${appUrl}/profile/${authorId}">${authorFullName}</a> has liked your <a href="${appUrl}/post/${postId}">Post</a>.`;
      break;
    case NotificationType.FOLLOW:
      emailContent.subject = `${authorFullName} has started following you.`;
      emailTemplateOptions.description = `<a href="${appUrl}/profile/${authorId}">${authorFullName}</a> has started following you.`;
      break;
    case NotificationType.MESSAGE:
      emailContent.subject = `${authorFullName} has messaged you.`;
      emailTemplateOptions.description = `<a href="${appUrl}/profile/${authorId}">${authorFullName}</a> has <a href="${appUrl}/messages/${authorId}">messaged</a> you.`;
      break;
    default:
      return;
  }

  if (!emailContent.subject) {
    return;
  }

  const template = await getEmailTemplate(emailTemplateOptions);
  emailContent.html = template;

  try {
    await sendEmail(emailContent);
  } catch (error) {
    console.log('Sending email failed:', error);
  }
};
