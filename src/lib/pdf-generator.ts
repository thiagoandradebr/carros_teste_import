import { Budget, Customer, CompanySettings } from "@/types";
import { formatCurrency, formatDate } from "./utils";

// Carregar PDFMake do CDN
const loadPdfMake = async () => {
  if ((window as any).pdfMake) {
    return (window as any).pdfMake;
  }

  // Carregar script do PDFMake
  await new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

  // Carregar fontes do PDFMake
  await new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

  return (window as any).pdfMake;
};

// Função para carregar imagem como base64
const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Cores do tema
const colors = {
  primary: '#4263EB',
  primaryLight: '#EDF2FF',
  success: '#37B24D',
  error: '#F03E3E',
  warning: '#F59F00',
  text: '#495057',
  border: '#DEE2E6',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

// Função auxiliar para criar células de tabela
const createTableCell = (content: string, options: any = {}) => ({
  text: content,
  ...options,
});

// Função para calcular dias entre duas datas
const calculateDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia inicial
};

// Mapear status para texto amigável
const statusMap = {
  draft: 'Rascunho',
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

interface BudgetWithCustomer extends Budget {
  customer: Customer;
}

const styles = {
  header: {
    fontSize: 10,
    color: colors.text,
    background: colors.primaryLight,
    padding: 20,
    margin: [-40, -60, -40, 20],
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    color: colors.primary,
    margin: [0, 15, 0, 5],
  },
  tableHeader: {
    fontSize: 10,
    bold: true,
    color: colors.primary,
    margin: [5, 8, 5, 8],
  },
  tableNumber: {
    fontSize: 10,
    color: colors.text,
    alignment: 'center',
    margin: [5, 8, 5, 8],
  },
  sectionDivider: {
    canvas: [{
      type: 'line',
      x1: 0,
      y1: 0,
      x2: 515,
      y2: 0,
      lineWidth: 1,
      lineColor: colors.border,
    }],
  },
  badge: {
    approved: { background: colors.success, color: colors.white },
    rejected: { background: colors.error, color: colors.white },
    pending: { background: colors.warning, color: colors.white },
    draft: { background: colors.text, color: colors.white },
  },
};

const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phone;
};

// Função principal para gerar o PDF
export const generateBudgetPDF = async (budget: BudgetWithCustomer, companyInfo: CompanySettings): Promise<string> => {
  // Carregar PDFMake
  const pdfMake = await loadPdfMake();

  // Definir a fonte padrão
  pdfMake.fonts = {
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
  };

  // Criar o documento
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      fontSize: 10,
      color: colors.text,
    },
    header: {
      margin: [40, 20, 40, 0], // Removendo margem inferior do cabeçalho
      columns: [
        // Logo à esquerda
        {
          width: 'auto',
          stack: [
            companyInfo.logo ? {
              image: companyInfo.logo,
              width: 100,
              margin: [0, 0, 20, 0],
            } : null,
          ].filter(Boolean),
        },
        // Título à direita
        {
          width: '*',
          stack: [
            {
              text: 'ORÇAMENTO',
              fontSize: 24,
              bold: true,
              color: colors.primary,
              alignment: 'right',
            },
          ],
        },
      ],
    },
    footer: function(currentPage: number, pageCount: number) {
      return {
        columns: [
          {
            text: `Gerado em ${formatDate(new Date().toISOString())}`,
            alignment: 'left',
            fontSize: 8,
            color: colors.text,
            margin: [40, 0, 0, 20],
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'right',
            fontSize: 8,
            color: colors.text,
            margin: [0, 0, 40, 20],
          },
        ],
      };
    },
    content: [
      // Espaço após o cabeçalho
      {
        text: '',
        margin: [0, 50, 0, 0], // Reduzindo para 50 pontos
      },
      // Dados da Empresa
      {
        text: 'DADOS DA EMPRESA',
        ...styles.sectionTitle,
        margin: [0, 0, 0, 5],
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['*'],
          body: [
            [
              // Linha 1
              {
                columns: [
                  { text: companyInfo.name || 'Greco Blindados', bold: true },
                  { text: companyInfo.document, alignment: 'right' },
                ],
              },
            ],
            [
              // Linha 2
              {
                columns: [
                  { text: companyInfo.phone },
                  { text: companyInfo.email, alignment: 'right' },
                ],
              },
            ],
            [
              // Linha 3
              {
                text: `${companyInfo.address}, ${companyInfo.city}`,
              },
            ],
          ],
        },
        margin: [0, 0, 0, 15], // Ajustando margem após dados da empresa
      },

      // Dados do Cliente
      {
        text: 'DADOS DO CLIENTE',
        ...styles.sectionTitle,
      },
      {
        margin: [0, 0, 0, 15],
        columns: [
          {
            width: '*',
            stack: [
              { text: 'Nome:', bold: true, margin: [0, 0, 0, 2] },
              { text: budget.customer.name, fontSize: 12 },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'Telefone:', bold: true, margin: [0, 0, 0, 2] },
              { text: formatPhoneNumber(budget.customer.phone) || 'Não informado', fontSize: 12 },
            ],
          },
        ],
      },

      // Dados do Orçamento
      {
        text: 'DADOS DO ORÇAMENTO',
        ...styles.sectionTitle,
      },
      {
        margin: [0, 0, 0, 15],
        columns: [
          {
            width: '*',
            stack: [
              { text: 'Número:', bold: true, margin: [0, 0, 0, 2] },
              { text: budget.id.slice(0, 6).toUpperCase(), fontSize: 12 },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'Data:', bold: true, margin: [0, 0, 0, 2] },
              { text: formatDate(budget.createdAt), fontSize: 12 },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'Valor Total:', bold: true, margin: [0, 0, 0, 2] },
              {
                text: formatCurrency(budget.totalAmount),
                fontSize: 16,
                bold: true,
                color: colors.primary,
              },
            ],
          },
        ],
      },

      // Tabela de Veículos
      {
        text: 'VEÍCULOS',
        ...styles.sectionTitle,
      },
      {
        margin: [0, 0, 0, 15],
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
          keepWithHeaderRows: 1,
          dontBreakRows: true,
          body: [
            [
              { text: '#', style: 'tableHeader', alignment: 'center' },
              { text: 'Veículo', style: 'tableHeader' },
              { text: 'Diária', style: 'tableHeader', alignment: 'right' },
              { text: 'Início', style: 'tableHeader', alignment: 'center' },
              { text: 'Fim', style: 'tableHeader', alignment: 'center' },
              { text: 'Dias', style: 'tableHeader', alignment: 'center' },
              { text: 'Total', style: 'tableHeader', alignment: 'right' },
            ],
            ...budget.vehicles.map((vehicle, index) => [
              { text: (index + 1).toString(), style: 'tableNumber', alignment: 'center' },
              { text: vehicle.vehicleName, margin: [5, 8, 5, 8] },
              { text: formatCurrency(vehicle.dailyRate), alignment: 'right', margin: [5, 8, 5, 8] },
              { text: formatDate(vehicle.startDate), alignment: 'center', margin: [5, 8, 5, 8] },
              { text: formatDate(vehicle.endDate), alignment: 'center', margin: [5, 8, 5, 8] },
              { text: calculateDays(vehicle.startDate, vehicle.endDate).toString(), alignment: 'center', margin: [5, 8, 5, 8] },
              { text: formatCurrency(vehicle.dailyRate * calculateDays(vehicle.startDate, vehicle.endDate)), alignment: 'right', margin: [5, 8, 5, 8], bold: true },
            ]),
          ],
        },
        layout: {
          fillColor: function(rowIndex: number) {
            return rowIndex === 0 ? colors.primary : (rowIndex % 2 ? colors.background : null);
          },
          hLineWidth: function(i: number, node: any) {
            return i === 0 || i === node.table.body.length ? 1 : 0.5;
          },
          vLineWidth: function(i: number, node: any) {
            return i === 0 || i === node.table.widths.length ? 1 : 0.5;
          },
          hLineColor: function() { return colors.border; },
          vLineColor: function() { return colors.border; },
        },
      },

      // Regra de Horas Extras (se aplicável)
      budget.overtimeRule ? {
        text: '* Horas extras ou frações equivalem a 10% da tarifa diária',
        fontSize: 10,
        italics: true,
        bold: true,
        color: colors.primary,
        margin: [0, 5, 0, 15],
      } : null,

      // Resumo Financeiro
      {
        text: 'RESUMO FINANCEIRO',
        ...styles.sectionTitle,
      },
      {
        margin: [0, 0, 0, 15],
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Total de Diárias', alignment: 'left' },
              { text: formatCurrency(budget.totalAmount - (budget.extraCosts?.reduce((acc, cost) => acc + cost.totalValue, 0) || 0)), alignment: 'right', bold: true },
            ],
            [
              { text: 'Total de Custos Extras', alignment: 'left' },
              { text: formatCurrency(budget.extraCosts?.reduce((acc, cost) => acc + cost.totalValue, 0) || 0), alignment: 'right', bold: true },
            ],
          ],
        },
        layout: 'noBorders',
      },
      {
        margin: [0, 10, 0, 0],
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 515,
            h: 40,
            r: 4,
            fillOpacity: 0.1,
            color: colors.primary,
          },
        ],
      },
      {
        margin: [10, -30, 10, 0],
        columns: [
          {
            text: 'Valor Total',
            fontSize: 16,
            bold: true,
            width: '*',
          },
          {
            text: formatCurrency(budget.totalAmount),
            fontSize: 20,
            bold: true,
            color: colors.primary,
            width: 150,
            alignment: 'right',
          },
        ],
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: colors.white,
        fillColor: colors.primary,
        margin: [5, 8, 5, 8],
      },
      tableNumber: {
        fontSize: 10,
        color: colors.text,
        alignment: 'center',
        margin: [5, 8, 5, 8],
      },
    },
  };

  // Gerar o PDF como blob URL
  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
    } catch (error) {
      reject(error);
    }
  });
};
