import { FileTypeInfo } from '../../types';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SchemaFAQPage {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

/**
 * Generate extension FAQs dynamically for any file format.
 */
export function generateExtensionFAQs(extInfo: FileTypeInfo): FAQItem[] {
  const ext = extInfo.extension.toUpperCase();
  const name = extInfo.name;
  const category = extInfo.category;
  const apps = extInfo.popularApps.map((a) => a.name).join(', ') || 'supported software';

  const faqs: FAQItem[] = [
    {
      question: `What is a .${ext} file?`,
      answer: `A .${ext} file is a ${name} associated with ${category}. ${extInfo.description}`,
    },
    {
      question: `How do I open a .${ext} file on Windows or Mac?`,
      answer: `You can open .${ext} files using ${apps}. If you do not have native software installed, you can use OpenAnyFile's free File Identifier or convert .${ext} to a standard format in your browser.`,
    },
    {
      question: `Is a .${ext} file safe to open?`,
      answer: `This format carries a safety rating of ${extInfo.dangerRating}. ${extInfo.dangerExplanation}`,
    },
    {
      question: `Can I convert a .${ext} file to other formats?`,
      answer: extInfo.conversions.length > 0
        ? `Yes! .${ext} can be converted to formats such as ${extInfo.conversions.map((c) => '.' + c.targetExtension).join(', ')} directly in your web browser.`
        : `Yes, you can convert .${ext} using OpenAnyFile's online file converter or standalone desktop suites.`,
    },
    {
      question: `What should I do if a .${ext} file is corrupted or won't open?`,
      answer: `If your .${ext} file displays an invalid header or signature error, check its magic bytes hex header (${extInfo.magicBytesHex}) using OpenAnyFile's Magic Byte Detector or follow our step-by-step file repair guide.`,
    },
  ];

  if (extInfo.faqs && extInfo.faqs.length > 0) {
    // Merge provided FAQs without duplication
    const existingQuestions = new Set(faqs.map((f) => f.question.toLowerCase()));
    extInfo.faqs.forEach((item) => {
      if (!existingQuestions.has(item.question.toLowerCase())) {
        faqs.push(item);
      }
    });
  }

  return faqs;
}

/**
 * Convert FAQ items array into Schema.org JSON-LD FAQPage structured data object.
 */
export function generateFAQSchema(faqs: FAQItem[]): SchemaFAQPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Schema.org TechArticle + SoftwareApplication schema for extension pages.
 */
export function generateExtensionSchema(extInfo: FileTypeInfo, canonicalUrl: string) {
  const faqs = generateExtensionFAQs(extInfo);
  const faqSchema = generateFAQSchema(faqs);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        url: canonicalUrl,
        headline: `How to Open, Convert, and Verify .${extInfo.extension} Files (${extInfo.name})`,
        description: extInfo.description,
        inLanguage: 'en-US',
        mainEntityOfPage: canonicalUrl,
        about: {
          '@type': 'ComputerLanguage',
          name: extInfo.extension,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonicalUrl}#software`,
        name: `${extInfo.name} (.${extInfo.extension})`,
        fileFormat: extInfo.mimeType,
        applicationCategory: extInfo.category,
        operatingSystem: 'Windows, macOS, Linux, iOS, Android',
      },
      faqSchema,
    ],
  };
}
