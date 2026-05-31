const SITE_URL = 'https://digitalshed.bookable.online'
const BRAND_NAME = 'The Digital Shed'

export default function Head() {
  const title = `${BRAND_NAME} · Battle`
  const description =
    'A monthly workshop in Battle, East Sussex for anyone stuck on something digital. Bring a real problem, leave with it working.'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'EducationalOrganization'],
        '@id': `${SITE_URL}/#organization`,
        name: BRAND_NAME,
        url: SITE_URL,
        description:
          'A free monthly digital fix-it workshop in Battle, East Sussex. Learn about websites, AI, digital marketing, business automation, and more.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Battle Memorial Hall',
          addressLocality: 'Battle',
          addressRegion: 'East Sussex',
          addressCountry: 'GB',
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Battle, East Sussex',
        },
        email: 'martin@bookable.online',
        priceRange: 'Free',
        knowsAbout: [
          'Web development',
          'Artificial intelligence',
          'Digital marketing',
          'Business automation',
          'Online safety',
          'Digital skills training',
        ],
        parentOrganization: {
          '@type': 'Organization',
          name: 'Bookable',
          url: 'https://bookable.online',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Event',
        name: 'Job Searching in the Age of AI',
        description:
          'Learn about how employers look at CVs, and how you can use AI to improve your CV and search for jobs.',
        startDate: '2026-07-08T18:30:00+01:00',
        endDate: '2026-07-08T20:30:00+01:00',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        isAccessibleForFree: true,
        location: {
          '@type': 'Place',
          name: 'Battle Memorial Hall',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Battle',
            addressRegion: 'East Sussex',
            addressCountry: 'GB',
          },
        },
        organizer: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Event',
        name: 'Website Basics',
        description:
          'Creating a basic website for your hobby, business or side-gig. Marketing, SEO, and getting found by Google and AI.',
        startDate: '2026-08-12T18:30:00+01:00',
        endDate: '2026-08-12T20:30:00+01:00',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        isAccessibleForFree: true,
        location: {
          '@type': 'Place',
          name: 'Battle Memorial Hall',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Battle',
            addressRegion: 'East Sussex',
            addressCountry: 'GB',
          },
        },
        organizer: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Event',
        name: 'Online Safety',
        description:
          'Scams, fraud, and protecting yourself and your data.',
        startDate: '2026-09-09T18:30:00+01:00',
        endDate: '2026-09-09T20:30:00+01:00',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        isAccessibleForFree: true,
        location: {
          '@type': 'Place',
          name: 'Battle Memorial Hall',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Battle',
            addressRegion: 'East Sussex',
            addressCountry: 'GB',
          },
        },
        organizer: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={BRAND_NAME} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`${SITE_URL}/`} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
