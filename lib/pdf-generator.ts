import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MARGIN_MM = 15;
const SECTION_GAP_MM = 4;

function getContentWidthMm(): number {
  return PAGE_WIDTH_MM - MARGIN_MM * 2;
}

function getPageContentHeightMm(): number {
  return PAGE_HEIGHT_MM - MARGIN_MM * 2;
}

function canvasToHeightMm(canvas: HTMLCanvasElement, widthMm: number): number {
  return (canvas.height * widthMm) / canvas.width;
}

function sliceCanvas(
  canvas: HTMLCanvasElement,
  offsetY: number,
  sliceHeight: number
): HTMLCanvasElement {
  const slice = document.createElement("canvas");
  slice.width = canvas.width;
  slice.height = sliceHeight;
  const context = slice.getContext("2d");
  if (!context) {
    throw new Error("Failed to create canvas context for PDF slice");
  }
  context.drawImage(
    canvas,
    0,
    offsetY,
    canvas.width,
    sliceHeight,
    0,
    0,
    canvas.width,
    sliceHeight
  );
  return slice;
}

function addSectionToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  y: number
): number {
  const contentWidth = getContentWidthMm();
  const pageContentHeight = getPageContentHeightMm();
  const sectionHeightMm = canvasToHeightMm(canvas, contentWidth);
  const sliceHeightPx = Math.floor((pageContentHeight * canvas.width) / contentWidth);

  if (sectionHeightMm <= pageContentHeight) {
    if (y > MARGIN_MM && y + sectionHeightMm > PAGE_HEIGHT_MM - MARGIN_MM) {
      pdf.addPage();
      y = MARGIN_MM;
    }

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      MARGIN_MM,
      y,
      contentWidth,
      sectionHeightMm
    );
    return y + sectionHeightMm + SECTION_GAP_MM;
  }

  let offsetPx = 0;
  let cursorY = y;

  while (offsetPx < canvas.height) {
    const remainingPx = canvas.height - offsetPx;
    const currentSlicePx = Math.min(sliceHeightPx, remainingPx);
    const slice = sliceCanvas(canvas, offsetPx, currentSlicePx);
    const sliceHeightMm = canvasToHeightMm(slice, contentWidth);

    if (cursorY > MARGIN_MM && cursorY + sliceHeightMm > PAGE_HEIGHT_MM - MARGIN_MM) {
      pdf.addPage();
      cursorY = MARGIN_MM;
    }

    pdf.addImage(
      slice.toDataURL("image/png"),
      "PNG",
      MARGIN_MM,
      cursorY,
      contentWidth,
      sliceHeightMm
    );

    cursorY += sliceHeightMm;
    offsetPx += currentSlicePx;

    if (offsetPx < canvas.height) {
      pdf.addPage();
      cursorY = MARGIN_MM;
    }
  }

  return cursorY + SECTION_GAP_MM;
}

function createPdfRenderRoot(root: HTMLElement): HTMLElement {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.id = "pdf-content-render";
  clone.classList.add("pdf-render-mode");
  clone.style.position = "absolute";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  clone.style.background = "#ffffff";

  document.body.appendChild(clone);
  return clone;
}

export async function generatePDF(projectName: string): Promise<void> {
  const root = document.getElementById("pdf-content");
  if (!root) {
    throw new Error("PDF content element not found");
  }

  const renderRoot = createPdfRenderRoot(root);

  try {
    const sections = Array.from(renderRoot.querySelectorAll<HTMLElement>("[data-pdf-section]"));
    if (sections.length === 0) {
      throw new Error("No PDF sections found");
    }

    const pdf = new jsPDF("p", "mm", "a4");
    let y = MARGIN_MM;

    for (const section of sections) {
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 960,
      });

      y = addSectionToPdf(pdf, canvas, y);
    }

    pdf.save(`${projectName.replace(/\s+/g, "_")}_ImpactReport.pdf`);
  } finally {
    renderRoot.remove();
  }
}
