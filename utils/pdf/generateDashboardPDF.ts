import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DashboardMeta {
  platform?: string;
  country?: string;
  logo?: string;
}

export async function generateDashboardPDF(ref: React.RefObject<HTMLElement>, meta: DashboardMeta = {}) {
  if (!ref.current) {
    throw new Error('Report reference is not available');
  }

  try {
    // Ensure all images and dynamic content are loaded before capturing
    // This helps with ensuring cached/localStorage data is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Step 1: Use html2canvas to rasterize the dashboard with high quality settings
    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false, // Reduce console noise
      width: ref.current.scrollWidth,
      height: ref.current.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });

    // Step 2: Create PDF instance
    const pdf = new jsPDF('p', 'pt', 'a4');
    
    // Step 3: Calculate PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Header height (space reserved for header content)
    const headerHeight = 80;
    const contentStartY = headerHeight + 20;
    const availableHeight = pdfHeight - contentStartY - 20; // 20pt bottom margin
    
    // Calculate canvas dimensions and scaling
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasAspectRatio = canvasHeight / canvasWidth;
    
    // Scale canvas to fit PDF width
    const scaledWidth = pdfWidth - 40; // 20pt margins on each side
    const scaledHeight = scaledWidth * canvasAspectRatio;
    
    // Step 4: Add header function
    const addHeader = (pageNum: number = 1) => {
      // Add logo if provided
      if (meta.logo) {
        try {
          pdf.addImage(meta.logo, 'PNG', 20, 20, 40, 40);
        } catch (error) {
          console.warn('Could not add logo to PDF:', error);
        }
      }
      
      // Add title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Social Dashboard Report', meta.logo ? 80 : 20, 35);
      
      // Add date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Generated: ${currentDate}`, meta.logo ? 80 : 20, 50);
      
      // Add platform and country info if available
      const metaInfo = [];
      if (meta.platform) metaInfo.push(`Platform: ${meta.platform}`);
      if (meta.country) metaInfo.push(`Country: ${meta.country}`);
      
      if (metaInfo.length > 0) {
        pdf.text(metaInfo.join(' | '), meta.logo ? 80 : 20, 65);
      }
      
      // Add page number if multiple pages
      if (pageNum > 1) {
        pdf.setFontSize(10);
        pdf.text(`Page ${pageNum}`, pdfWidth - 50, 30);
      }
      
      // Add separator line
      pdf.setLineWidth(0.5);
      pdf.line(20, headerHeight, pdfWidth - 20, headerHeight);
    };

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png');
    
    // Step 5: Handle multiple pages if content is too tall
    if (scaledHeight <= availableHeight) {
      // Content fits on one page
      addHeader();
      pdf.addImage(imgData, 'PNG', 20, contentStartY, scaledWidth, scaledHeight);
    } else {
      // Content needs to be split across multiple pages
      const totalPages = Math.ceil(scaledHeight / availableHeight);
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (pageNum > 1) {
          pdf.addPage();
        }
        
        addHeader(pageNum);
        
        // Calculate the portion of the image for this page
        const sourceY = (pageNum - 1) * (canvasHeight * availableHeight / scaledHeight);
        const sourceHeight = Math.min(
          canvasHeight * availableHeight / scaledHeight,
          canvasHeight - sourceY
        );
        
        // Create a temporary canvas for this page's content
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = sourceHeight;
        
        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvasWidth, sourceHeight,
            0, 0, canvasWidth, sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageScaledHeight = scaledWidth * (sourceHeight / canvasWidth);
          
          pdf.addImage(pageImgData, 'PNG', 20, contentStartY, scaledWidth, pageScaledHeight);
        }
      }
    }
    
    // Step 6: Save the PDF
    pdf.save('dashboard-report.pdf');
    
    return {
      success: true,
      pages: Math.ceil(scaledHeight / availableHeight) || 1,
      message: 'PDF generated successfully'
    };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
