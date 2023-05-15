import { useEffect } from 'react';

import { BlogSEO } from '@/components/SEO';

import { useTheme } from '../../../../themes';
import { getPostData } from '../../../data';

export default async function Post(props) {
  const { post, settings, me } = await getPostData(props.params.slug);
  const { Post } = useTheme(settings?.theme);
  const { name = '', avatar = '' } =
    post.author?.__typename === 'Author' ? post.author : {};

  const authorDetails = [
    {
      name,
      avatar,
      occupation: me.occupation,
      company: me.company_name,
      email: settings.site_email,
      twitter: me.social?.twitter,
      linkedin: me.social?.linkedin,
      github: me.social?.github,
      banner: settings.banner?.src,
      logo: settings.site_logo?.src,
    },
  ];
  return (
    <>
      <BlogSEO
        url={`${settings.site_url}${post.slug}`}
        date={post.publishedAt}
        title={post.title}
        summary={post.excerpt ?? ''}
        lastmod={post.updatedAt}
        images={post.cover_image.src ? [post.cover_image.src] : []}
        slug={post.slug ?? ''}
        tags={
          post.tags?.__typename === 'TagsNode'
            ? post.tags.rows.map((t) => t.name)
            : []
        }
        fileName={post.title}
        site_name={settings.site_title}
        authorDetails={authorDetails}
      />
      <Post post={post} settings={settings} me={me} />
    </>
  );
}