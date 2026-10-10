"""Regenerate public/files/sonny-nguyen-resume.pdf from src/data/resume.js.

Run from the repo root (needs Node and `pip install reportlab`):

    node -e "import('./src/data/resume.js').then(m => console.log(JSON.stringify(m.resume)))" | python scripts/resume_pdf.py
"""
import json
import sys
from xml.sax.saxutils import escape

from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import KeepTogether, ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = 'public/files/sonny-nguyen-resume.pdf'
INK, GREY = '#252525', '#6b6b66'

# The built-in PDF fonts only cover Latin-1, so swap the few typographic
# characters that fall outside it for ones that are in it.
def t(s):
    return escape(s.replace('’', "'").replace('—', '-'))

name = ParagraphStyle('name', fontName='Times-Bold', fontSize=24, leading=28, textColor=INK)
sub = ParagraphStyle('sub', fontName='Helvetica', fontSize=10.5, leading=14, textColor=INK)
meta = ParagraphStyle('meta', fontName='Helvetica', fontSize=9, leading=13, textColor=GREY)
h2 = ParagraphStyle('h2', fontName='Times-Bold', fontSize=13.5, leading=16, textColor=INK, spaceBefore=10, spaceAfter=4)
head = ParagraphStyle('head', fontName='Helvetica', fontSize=9.5, leading=13, textColor=INK)
when = ParagraphStyle('when', parent=head, alignment=TA_RIGHT, textColor=GREY, fontSize=9)
body = ParagraphStyle('body', fontName='Helvetica', fontSize=9.2, leading=12.6, textColor=INK)

def entry(title, org, dates, bullets, width):
    row = Table(
        [[Paragraph(f'<b>{t(title)}</b>  <font color="{GREY}">{t(org)}</font>', head), Paragraph(t(dates), when)]],
        colWidths=[width - 1.35 * inch, 1.35 * inch],
    )
    row.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 2)]))
    items = ListFlowable(
        [ListItem(Paragraph(t(b), body), leftIndent=12) for b in bullets],
        bulletType='bullet', start='•', bulletFontSize=8, leftIndent=12,
    )
    return KeepTogether([row, items, Spacer(1, 6)])

def main():
    r = json.load(sys.stdin)
    doc = SimpleDocTemplate(OUT, pagesize=letter, leftMargin=0.7 * inch, rightMargin=0.7 * inch, topMargin=0.6 * inch, bottomMargin=0.55 * inch, title=f"{r['name']} - Resume", author=r['name'])
    w = doc.width
    flow = [Paragraph(t(r['name']), name), Paragraph(t(r['title']), sub), Paragraph(f"{t(r['location'])} · {t(r['email'])}", meta)]
    flow.append(Paragraph('Experience', h2))
    for x in r['experience']:
        flow.append(entry(x['role'], f"{x['org']} · {x['where']}", x['when'], x['bullets'], w))
    flow.append(Paragraph('Education', h2))
    for e in r['education']:
        flow.append(entry(e['degree'], e['school'], e['when'], e['detail'], w))
    flow.append(Paragraph('Skills', h2))
    for s in r['skills']:
        flow.append(Paragraph(f"<b>{t(s['group'])}:</b> " + ' · '.join(t(i) for i in s['items']), body))
        flow.append(Spacer(1, 3))
    doc.build(flow)
    print('wrote', OUT)

if __name__ == '__main__':
    main()
