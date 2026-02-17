export function generateEmailSubject(businessName: string): string {
  return `New website design concept for ${businessName}`
}

export function generateEmailBody(
  businessName: string,
  pitchUrl: string,
  senderName: string
): string {
  return `Hi there,

I came across ${businessName} and was really impressed by what you do. I took the liberty of creating a modern website redesign concept specifically for your business.

You can view the live preview here:
${pitchUrl}

This is a free, no-obligation preview — I'd love to hear what you think. If you're interested in discussing it further or would like any changes, just reply to this email.

Best regards,
${senderName}`
}

export function generateGmailComposeUrl(
  to: string,
  subject: string,
  body: string
): string {
  const params = new URLSearchParams({
    view: 'cm',
    to,
    su: subject,
    body,
  })
  return `https://mail.google.com/mail/?${params.toString()}`
}
