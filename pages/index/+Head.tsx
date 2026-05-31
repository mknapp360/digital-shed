const SITE_URL = 'https://digitalshed.bookable.online'
const BRAND_NAME = 'The Digital Shed'

export default function Head() {
  const title = `${BRAND_NAME} · Battle`
  const description =
    'A monthly workshop in Battle, East Sussex for anyone stuck on something digital. Bring a real problem, leave with it working.'

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
    </>
  )
}
