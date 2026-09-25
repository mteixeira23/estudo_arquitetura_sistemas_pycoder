import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT

def build_pdf():
    desktop_path = r"C:\Users\marcos.teixeira\Desktop\Manual_Modulo_8_Prontuario_Saude.pdf"
    
    doc = SimpleDocTemplate(
        desktop_path,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#059669'),
        alignment=TA_LEFT,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#0284c7'),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#047857'),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        alignment=TA_LEFT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0f172a'),
        alignment=TA_LEFT
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#065f46')
    )

    story = []

    # Header Banner
    story.append(Paragraph("🏥 Guia Operacional & Arquitetural — Módulo 8", title_style))
    story.append(Paragraph("<b>Prontuário Saúde, PTI & Emergências Médicas</b> — Fundação Doutor Jesus (SGI / MROSC Bahia)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#10b981'), spaceAfter=15))

    # Section 1
    story.append(Paragraph("1. Visão Geral & Objetivo do Módulo 8", h1_style))
    story.append(Paragraph(
        "O <b>Módulo 8 (Prontuário Saúde)</b> é o núcleo clínico e multiprofissional do Sistema de Gestão Integrada (SGI). "
        "Ele centraliza todo o histórico de saúde, acompanhamento psicossocial, tratamentos e urgências dos dependentes químicos acolhidos na Fundação Dr. Jesus.",
        body_style
    ))
    story.append(Paragraph(
        "Este módulo foi projetado para atender aos exigentes padrões da <b>Resolução RDC nº 29/2011 da ANVISA</b> "
        "(que regulamenta os requisitos de segurança sanitária, equipe mínima e plano terapêutico em Comunidades Terapêuticas no Brasil) "
        "e assegurar a <b>prestação de contas auditável perante o MROSC e Secretarias de Estado (SJDH / SESAB)</b>.",
        body_style
    ))

    # Callout Box
    callout_data = [[Paragraph("💡 <b>Dica de Uso:</b> Ao abrir o Módulo 8, selecione primeiro o acolhido desejado no topo. O prontuário ajustará instantaneamente todas as 6 sub-abas para exibir o histórico completo desse acolhido específico.", callout_style)]]
    callout_table = Table(callout_data, colWidths=[520])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#a7f3d0')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(Spacer(1, 5))
    story.append(callout_table)
    story.append(Spacer(1, 12))

    # Section 2
    story.append(Paragraph("2. Sequência Lógica & Operacional das 6 Sub-Abas", h1_style))
    
    subtabs_info = [
        ("1. 👤 Resumo do Prontuário & Ficha Clínica", [
            "<b>Objetivo:</b> Identificação instantânea do acolhido e visão geral 360° da sua saúde.",
            "<b>Componentes:</b> Foto médica, Código FDJ, CPF, NIS, Alojamento/Leito e Alertas de Dietas/Alergias (ex: Intolerante a Lactose).",
            "<b>Cartões Sintéticos:</b> Status do PTI, total de medicamentos prescritos e data da última evolução clínica."
        ]),
        ("2. 🎯 Plano Terapêutico Individualizado (PTI - RDC 29 ANVISA)", [
            "<b>Objetivo:</b> Planejamento, execução e avaliação continuada das etapas de recuperação do acolhido.",
            "<b>Fase 1 (0 a 3 meses):</b> Desintoxicação & Adaptação — Estabilização física, rotina comunitária e descontinuação do uso.",
            "<b>Fase 2 (3 a 6 meses):</b> Conscientização & Laborterapia — Responsabilidade, capacitação na Padaria/Horta e apoio psicossocial.",
            "<b>Fase 3 (6 a 9 meses):</b> Reinserção Social & Familiar — Fortalecimento de vínculos, passeios terapêuticos e autonomia.",
            "<b>Comissão Multidisciplinar:</b> Modal 'Avaliar & Evoluir Fase do PTI' para pareceres técnicos formais de transição."
        ]),
        ("3. 💊 Aprazamento & Prescrição de Medicamentos (Enfermagem)", [
            "<b>Objetivo:</b> Controle rigoroso da medicação prescrita por médicos/psiquiatras e ministrada pela Enfermagem.",
            "<b>Horários de Aprazamento:</b> Separação por turnos (08:00 - Manhã, 12:00 - Almoço, 18:00 - Noite, 22:00 - Dormir).",
            "<b>Confirmação Rastreável:</b> Botão 'Confirmar Dose' com registro do enfermeiro responsável para auditoria MROSC."
        ]),
        ("4. 📝 Feed de Evoluções Multidisciplinares", [
            "<b>Objetivo:</b> Prontuário unificado com os pareceres técnicos de toda a equipe de atendimento.",
            "<b>Especialidades Integradas:</b> Psicologia (CRP), Enfermagem (COREN), Serviço Social (CRESS), Psiquiatria e Medicina Geral (CRM).",
            "<b>Filtros Rápidos:</b> Visualização cronológica por especialidade ou feed consolidado."
        ]),
        ("5. 🦷 Odontologia Terapêutica & Autoestima", [
            "<b>Objetivo:</b> Restauração da saúde bucal e da autoestima do acolhido como elemento central de dignidade e reinserção.",
            "<b>Local de Atendimento:</b> Gabinete Odontológico próprio na sede da Fundação Dr. Jesus.",
            "<b>Procedimentos:</b> Restaurações estéticas, próteses dentárias, raspagens e cirurgias terapêuticas."
        ]),
        ("6. 🚑 Regulação SAMU 192 & Emergências Hospitalares", [
            "<b>Objetivo:</b> Gestão de ocorrências graves de saúde que exigem transferência para a rede pública SUS (UPA / Hospital).",
            "<b>Fluxo de Urgência:</b> Atendimento de enfermagem na sede ➔ Chamado SAMU 192 ➔ Transporte na Ambulância UTI Móvel FDJ."
        ])
    ]

    for title, items in subtabs_info:
        story.append(Paragraph(title, h2_style))
        for item in items:
            story.append(Paragraph(f"• {item}", bullet_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))

    # Section 3: Auditability Table
    story.append(Paragraph("3. Benefícios Governamentais & Auditabilidade MROSC", h1_style))

    table_data = [
        [Paragraph("Requisito Legal / MROSC", table_header_style), Paragraph("Implementação no Módulo 8 SGI", table_header_style)],
        [Paragraph("ANVISA RDC 29/2011", table_cell_style), Paragraph("PTI individualizado com fases 1, 2 e 3 e parecer multidisciplinar.", table_cell_style)],
        [Paragraph("Auditabilidade de Medicamentos", table_cell_style), Paragraph("Registro de prescritor (CRM), dosagem, horário e confirmação de enfermagem.", table_cell_style)],
        [Paragraph("Integração Transporte SUS", table_cell_style), Paragraph("Encaminhamento direto de atendimentos externos para a frota do Módulo 7.", table_cell_style)],
        [Paragraph("Proteção de Dados do Paciente", table_cell_style), Paragraph("Prontuário único indexado pelo código do acolhido (ex: FDJ-2026-0891).", table_cell_style)]
    ]

    table = Table(table_data, colWidths=[200, 320])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#059669')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))

    story.append(table)
    story.append(Spacer(1, 20))

    # Footer note
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#94a3b8'), spaceAfter=10))
    footer_style = ParagraphStyle('FooterText', fontName='Helvetica', fontSize=8, leading=10, textColor=colors.HexColor('#64748b'), alignment=TA_CENTER)
    story.append(Paragraph("Documento gerado automaticamente pelo SGI — Fundação Doutor Jesus | Sistema MROSC Bahia", footer_style))

    # Build PDF
    doc.build(story)
    print(f"PDF successfully generated at: {desktop_path}")

if __name__ == '__main__':
    build_pdf()
