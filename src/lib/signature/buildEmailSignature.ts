const SIGNATURE_DATA = {
	name: 'Liam Melkersson',
	title: 'Design & Web',
	photoUrl: 'https://liammelkersson.xyz/portrait-160.webp',
	email: 'liammelkersson@live.se',
	phone: '+46 76 163 44 25',
	phoneHref: 'tel:+46761634425',
	linkedinUrl: 'https://www.linkedin.com/in/liammelkersson',
	linkedinLabel: 'linkedin.com/in/liammelkersson',
	siteUrl: 'https://liammelkersson.xyz',
	siteLabel: 'liammelkersson.xyz'
} as const;

// Table + inline styles only — email clients ignore stylesheets and many
// (Outlook desktop chief among them) don't support flexbox/grid layout.
export const emailSignatureHtml = `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#111111;">
	<tr>
		<td style="padding-right:16px;vertical-align:top;">
			<img src="${SIGNATURE_DATA.photoUrl}" width="64" height="64" alt="${SIGNATURE_DATA.name}" style="display:block;width:64px;height:64px;border-radius:50%;object-fit:cover;" />
		</td>
		<td style="vertical-align:top;border-left:2px solid #dddddd;padding-left:16px;">
			<div style="font-size:15px;font-weight:bold;color:#111111;line-height:1.3;">${SIGNATURE_DATA.name}</div>
			<div style="font-size:13px;color:#666666;line-height:1.4;margin-top:2px;">${SIGNATURE_DATA.title}</div>
			<div style="font-size:12px;color:#666666;line-height:1.6;margin-top:8px;">
				<a href="mailto:${SIGNATURE_DATA.email}" style="color:#111111;text-decoration:none;">${SIGNATURE_DATA.email}</a>
				&nbsp;&middot;&nbsp;
				<a href="${SIGNATURE_DATA.phoneHref}" style="color:#111111;text-decoration:none;">${SIGNATURE_DATA.phone}</a>
				<br />
				<a href="${SIGNATURE_DATA.linkedinUrl}" style="color:#111111;text-decoration:none;">${SIGNATURE_DATA.linkedinLabel}</a>
				&nbsp;&middot;&nbsp;
				<a href="${SIGNATURE_DATA.siteUrl}" style="color:#111111;text-decoration:none;">${SIGNATURE_DATA.siteLabel}</a>
			</div>
		</td>
	</tr>
</table>`;

export const emailSignaturePlainText = `${SIGNATURE_DATA.name}
${SIGNATURE_DATA.title}
${SIGNATURE_DATA.email} | ${SIGNATURE_DATA.phone}
${SIGNATURE_DATA.linkedinLabel} | ${SIGNATURE_DATA.siteLabel}`;
