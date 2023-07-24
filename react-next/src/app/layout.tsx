export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' dir='ltr'>
      <head>
        <script src='https://cdn.tailwindcss.com'></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
