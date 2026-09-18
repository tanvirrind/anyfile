import React, { useEffect, useMemo } from 'react';

export interface BreadcrumbItemSchema {
  name: string;
  path: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  schemaData?: object;
  breadcrumbs?: BreadcrumbItemSchema[];
  category?: string;
  robots?: string;
  image?: string;
  imageAlt?: string;
  ogType?: 'website' | 'article';
}

const BASE_URL = 'https://www.anyfilex.com';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  schemaData,
  breadcrumbs,
  category,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  image = 'https://www.anyfilex.com/og-image.png',
  imageAlt = 'AnyFileX - Universal File Format Platform',
  ogType = 'website',
}) => {
  const fullTitle = title.includes('AnyFileX') ? title : `${title} | AnyFileX`;
  const cleanCanonicalPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const fullCanonicalUrl = `${BASE_URL}${cleanCanonicalPath === '/' ? '/' : cleanCanonicalPath}`;

  // Generate Breadcrumbs structured data
  const generatedBreadcrumbList = useMemo(() => {
    let items: BreadcrumbItemSchema[] = [];

    if (breadcrumbs && breadcrumbs.length > 0) {
      items = breadcrumbs;
    } else {
      // Auto-generate breadcrumb hierarchy from canonicalPath
      items.push({ name: 'Home', path: '/' });

      const segments = cleanCanonicalPath.split('/').filter(Boolean);
      if (segments.length === 1) {
        const seg = segments[0];
        const segTitle =
          seg === 'file-extensions' || seg === 'extensions' ? 'Extensions' :
          seg === 'converters' ? 'Converters' :
          seg === 'tools' ? 'Tools & Forensics' :
          seg === 'software' ? 'Software Directory' :
          seg === 'troubleshoot' || seg === 'repair' ? 'File Repair Center' :
          seg === 'guides' ? 'Educational Guides' :
          seg === 'blog' ? 'Engineering Blog' :
          seg === 'about' ? 'About AnyFileX' :
          seg === 'contact' ? 'Contact Support' :
          seg === 'assistant' ? 'AI Assistant' :
          seg.charAt(0).toUpperCase() + seg.slice(1);
        items.push({ name: segTitle, path: seg === 'extensions' ? '/file-extensions' : seg === 'repair' ? '/troubleshoot' : `/${seg}` });
      } else if (segments.length >= 2) {
        const [parent, child] = segments;
        if (parent === 'extension' || parent === 'extensions' || parent === 'file-extensions' || parent === 'file-extension') {
          items.push({ name: 'Extensions', path: '/file-extensions' });
          items.push({ name: `.${child.toUpperCase()} Format`, path: cleanCanonicalPath });
        } else if (parent === 'converter' || parent === 'converters') {
          items.push({ name: 'Converters', path: '/converters' });
          items.push({ name: child.split('-to-').map((s) => s.toUpperCase()).join(' to ') + ' Converter', path: cleanCanonicalPath });
        } else if (parent === 'category' || parent === 'categories') {
          items.push({ name: 'Categories', path: '/file-extensions' });
          items.push({ name: `${child.charAt(0).toUpperCase() + child.slice(1)} Category`, path: cleanCanonicalPath });
        } else if (parent === 'tools' || parent === 'tool') {
          items.push({ name: 'Tools', path: '/tools' });
          items.push({ name: child.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '), path: cleanCanonicalPath });
        } else if (parent === 'software') {
          items.push({ name: 'Software', path: '/software' });
          items.push({ name: child.charAt(0).toUpperCase() + child.slice(1), path: cleanCanonicalPath });
        } else if (parent === 'repair' || parent === 'troubleshoot' || parent === 'troubleshooting') {
          items.push({ name: 'Repair Guides', path: '/troubleshoot' });
          items.push({ name: child.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '), path: cleanCanonicalPath });
        } else if (parent === 'guide' || parent === 'guides' || parent === 'resources') {
          items.push({ name: 'Guides', path: '/guides' });
          items.push({ name: child.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '), path: cleanCanonicalPath });
        } else if (parent === 'compare' || parent === 'comparison' || parent === 'comparisons') {
          items.push({ name: 'Comparisons', path: '/compare' });
          items.push({ name: child.split('-').map((s) => s.toUpperCase()).join(' vs '), path: cleanCanonicalPath });
        } else if (parent === 'blog') {
          items.push({ name: 'Blog', path: '/blog' });
          items.push({ name: child.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '), path: cleanCanonicalPath });
        } else {
          items.push({ name: parent.charAt(0).toUpperCase() + parent.slice(1), path: `/${parent}` });
          items.push({ name: child.charAt(0).toUpperCase() + child.slice(1), path: cleanCanonicalPath });
        }
      }
    }

    return {
      '@type': 'BreadcrumbList',
      '@id': `${fullCanonicalUrl}#breadcrumb`,
      itemListElement: items.map((item, index) => {
        const itemUrl = item.path.startsWith('http')
          ? item.path
          : `${BASE_URL}${item.path === '/' ? '/' : item.path.startsWith('/') ? item.path : `/${item.path}`}`;
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: itemUrl || `${BASE_URL}/`,
        };
      }),
    };
  }, [cleanCanonicalPath, fullCanonicalUrl, breadcrumbs]);

  // Complete Schema.org Structured Data graph combining Organization, WebSite, Breadcrumbs, and Page Entities
  const completeSchemaGraph = useMemo(() => {
    const orgSchema = {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'AnyFileX',
      url: `${BASE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        '@id': `${BASE_URL}/#logo`,
        url: `${BASE_URL}/favicon.svg`,
        caption: 'AnyFileX - Universal File Format Platform',
        width: 512,
        height: 512,
      },
      image: `${BASE_URL}/favicon.svg`,
      sameAs: [
        'https://twitter.com/anyfilex',
        'https://github.com/anyfilex',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        url: `${BASE_URL}/contact`,
      },
    };

    const webSiteSchema = {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'AnyFileX',
      alternateName: ['anyfilex.com'],
      url: `${BASE_URL}/`,
      description: 'Open Any File in Seconds with AnyFileX. Universal file extension intelligence, magic bytes inspection, converters, and repair tools.',
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      inLanguage: 'en-US',
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/file-extensions?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      ],
    };

    const webPageSchema = {
      '@type': 'WebPage',
      '@id': `${fullCanonicalUrl}#webpage`,
      url: fullCanonicalUrl,
      name: fullTitle,
      description: description,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'AnyFileX',
        url: `${BASE_URL}/`,
      },
      breadcrumb: {
        '@id': `${fullCanonicalUrl}#breadcrumb`,
      },
      inLanguage: 'en-US',
    };

    // Extract any existing page-level schema entities passed via schemaData
    const pageEntities: any[] = [];
    if (schemaData) {
      const dataObj = schemaData as any;
      if (Array.isArray(dataObj['@graph'])) {
        pageEntities.push(...dataObj['@graph']);
      } else if (dataObj['@type']) {
        const { '@context': _ctx, ...rest } = dataObj;
        pageEntities.push(rest);
      }
    }

    const isHomePage = cleanCanonicalPath === '/';
    const graph: any[] = [orgSchema];
    if (isHomePage) {
      graph.push(webSiteSchema);
    }
    graph.push(webPageSchema, generatedBreadcrumbList, ...pageEntities);

    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    };
  }, [cleanCanonicalPath, fullCanonicalUrl, fullTitle, description, generatedBreadcrumbList, schemaData]);

  const schemaString = useMemo(() => JSON.stringify(completeSchemaGraph), [completeSchemaGraph]);

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentVal);
    };

    // 2. Application and Brand Identity Signals
    setMetaTag('name', 'application-name', 'AnyFileX');
    setMetaTag('name', 'apple-mobile-web-app-title', 'AnyFileX');
    setMetaTag('name', 'publisher', 'AnyFileX');
    setMetaTag('name', 'author', 'AnyFileX');
    setMetaTag('property', 'article:publisher', `${BASE_URL}/`);

    // 3. Standard Meta Description
    setMetaTag('name', 'description', description);

    // 4. Robots & Crawler Directives
    setMetaTag('name', 'robots', robots);
    setMetaTag('name', 'googlebot', robots);
    setMetaTag('name', 'bingbot', robots);
    setMetaTag('http-equiv', 'X-Robots-Tag', robots.includes('noindex') ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Link Publisher
    let publisherLink = document.querySelector('link[rel="publisher"]');
    if (!publisherLink) {
      publisherLink = document.createElement('link');
      publisherLink.setAttribute('rel', 'publisher');
      document.head.appendChild(publisherLink);
    }
    publisherLink.setAttribute('href', `${BASE_URL}/`);

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', 'AnyFileX');
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:image:secure_url', image);
    setMetaTag('property', 'og:image:type', 'image/png');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', imageAlt);

    // 6. Twitter Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@AnyFileX');
    setMetaTag('name', 'twitter:creator', '@AnyFileX');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
    setMetaTag('name', 'twitter:image:alt', imageAlt);

    // 7. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 8. Inject JSON-LD Schema Markup with Organization, WebSite, Breadcrumbs, and Page Schemas
    let scriptTag = document.getElementById('anyfilex-jsonld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'anyfilex-jsonld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = schemaString;

    return () => {
      if (scriptTag) {
        scriptTag.textContent = '';
      }
    };
  }, [fullTitle, description, fullCanonicalUrl, schemaString, robots, image, imageAlt, ogType]);

  return null;
};

