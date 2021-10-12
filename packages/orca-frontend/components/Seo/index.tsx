import React, { FC } from 'react';
import NextHead from 'next/head';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Config } from '../../utils';
import { DefaultCommunity } from '../../constants';

interface SeoProps {
  title?: string;
  image?: string;
  url?: string;
}

const Seo: FC<SeoProps> = ({ title, image, url }) => {
  const settings = useSelector((state: RootState) => state.settings);

  const metaTitle = title ? `${title} | ${settings.communityName}` : settings.communityName;
  const metaImage = image || DefaultCommunity.communitySocialImage;
  const metaUrl = url || window.location.href;

  return (
    <NextHead>
      <title key="title">{metaTitle}</title>

      {process.env.NODE_ENV === 'production' && (
        <>
          <script
            key="google-tag-manager"
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${Config.GOOGLE_ANALYTICS_ID}`}
          />
          <script
            key="google-analytics-snippet"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${Config.GOOGLE_ANALYTICS_ID}', { page_path: '${window.location.pathname}' });
            `,
            }}
          />
        </>
      )}

      <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

      <meta key="og-title" property="og:title" content={metaTitle} />
      <meta key="og-image" property="og:image" content={metaImage} />
      <meta key="og-url" property="og:url" content={metaUrl}></meta>
      <meta key="twitter-card" name="twitter:card" content="summary_large_image" />
    </NextHead>
  );
};

export default Seo;
