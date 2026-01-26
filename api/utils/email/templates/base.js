const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const joinLines = (lines) =>
  lines
    .filter(Boolean)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")

const BRAND = {
  name: "Daykeeper",
  primary: "#111827",
  primaryDark: "#111827",
  accent: "#9ca3af",
  background: "#f5f5f4",
  surface: "#ffffff",
  text: "#111827",
  muted: "#6b7280",
}

const renderButton = ({ label, url }) => {
  if (!label || !url) return ""
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 0;">
      <tr>
        <td align="center" bgcolor="${BRAND.primary}" style="border-radius: 8px;">
          <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 20px;font-family:Arial, sans-serif;font-size:14px;color:#ffffff;text-decoration:none;font-weight:600;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `
}

const renderCode = (code) => {
  if (!code) return ""
  return `
    <div style="margin: 18px 0 6px;font-family: 'Courier New', Courier, monospace;font-size: 20px;letter-spacing: 2px;font-weight: 700;color:${BRAND.primaryDark};">
      ${escapeHtml(code)}
    </div>
  `
}

const formatBodyHtml = (body) => {
  if (!body) return ""
  const escaped = escapeHtml(body)
  return escaped.replace(/\n/g, "<br />")
}

const renderSection = (title, body) => {
  if (!title && !body) return ""
  return `
    <div style="margin-top: 18px;">
      ${title ? `<div style="font-size:12px;font-weight:700;letter-spacing:0.6px;color:${BRAND.primaryDark};text-transform:uppercase;">${escapeHtml(title)}</div>` : ""}
      ${body ? `<div style="margin-top:6px;font-size:14px;line-height:1.6;color:${BRAND.text};">${formatBodyHtml(body)}</div>` : ""}
    </div>
  `
}

const renderAvatar = (avatarUrl) => {
  if (!avatarUrl) return ""
  return `
    <img src="${escapeHtml(avatarUrl)}" width="56" height="56" alt="" style="border-radius: 999px; border: 2px solid #e5e7eb; object-fit: cover; display: block;" />
  `
}

const buildEmail = ({
  preheader,
  title,
  greeting,
  intro,
  sections = [],
  code,
  cta,
  outro,
  footerNote,
  avatarUrl,
  logoUrl,
}) => {
  const heroLogo = logoUrl || process.env.DAYKEEPER_LOGO_URL
  const contentHtml = `
    <div style="padding: 28px 32px;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${heroLogo ? `<img src="${escapeHtml(heroLogo)}" width="56" height="56" alt="${BRAND.name}" style="border-radius: 999px; border: 1px solid #e5e7eb; object-fit: cover; display: block;" />` : renderAvatar(avatarUrl)}
        <div>
          <div style="font-size:12px;font-weight:700;letter-spacing:0.6px;color:${BRAND.accent};text-transform:uppercase;">${BRAND.name}</div>
          <div style="font-size:20px;font-weight:700;color:${BRAND.text};">${escapeHtml(title || "Account update")}</div>
        </div>
      </div>
      ${greeting ? `<div style="margin-top:20px;font-size:16px;font-weight:600;color:${BRAND.text};">${escapeHtml(greeting)}</div>` : ""}
      ${intro ? `<div style="margin-top:8px;font-size:14px;line-height:1.6;color:#374151;">${formatBodyHtml(intro)}</div>` : ""}
      ${renderCode(code)}
      ${sections.map((section) => renderSection(section.title, section.body)).join("")}
      ${cta ? renderButton(cta) : ""}
      ${outro ? `<div style="margin-top:18px;font-size:13px;line-height:1.6;color:${BRAND.muted};">${formatBodyHtml(outro)}</div>` : ""}
    </div>
  `

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title || BRAND.name)}</title>
      <style>
        body { margin:0; padding:0; background-color:${BRAND.background}; }
        img { border: 0; }
      </style>
    </head>
    <body>
      <div style="display:none;max-height:0;overflow:hidden;color:${BRAND.background};opacity:0;">${escapeHtml(preheader || `Your ${BRAND.name} account update`)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BRAND.background};padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:${BRAND.surface};border-radius:16px;box-shadow:0 10px 30px rgba(15, 23, 42, 0.08);overflow:hidden;">
              <tr>
                <td>
                  ${contentHtml}
                </td>
              </tr>
              <tr>
                <td style="padding: 0 32px 28px;">
                  <div style="border-top:1px solid #e5e7eb;margin-top:8px;padding-top:14px;font-size:12px;line-height:1.6;color:#9ca3af;">
                    ${escapeHtml(footerNote || "If you did not request this, you can safely ignore this email.")}
                  </div>
                </td>
              </tr>
            </table>
            <div style="margin-top:16px;font-size:11px;line-height:1.4;color:#9ca3af;">${BRAND.name} · This email was sent automatically.</div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `

  const text = joinLines([
    title,
    greeting,
    intro,
    code ? `Codigo: ${code}` : "",
    ...sections.map((section) => {
      const sectionText = section.text || section.body || ""
      return joinLines([section.title ? `${section.title}:` : "", sectionText])
    }),
    cta?.label && cta?.url ? `${cta.label}: ${cta.url}` : "",
    outro,
    footerNote || "If you did not request this, you can ignore this email.",
  ])

  return { html, text }
}

module.exports = {
  buildEmail,
  escapeHtml,
}
