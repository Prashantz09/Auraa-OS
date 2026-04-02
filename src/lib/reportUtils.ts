import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import type { Project, Client } from "@/lib/db";

// Helper to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
};

// Helper to format date
const formatDate = (ts?: number) => {
    if (!ts) return "N/A";
    return format(new Date(ts), "MMM d, yyyy");
};

/**
 * Generate a PDF Invoice for a project
 */
export const generateProjectInvoice = (project: Project, client: Client): jsPDF => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text("INVOICE", 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice Number: INV-${project.id.slice(0, 8).toUpperCase()}`, 14, 35);
    doc.text(`Date of Issue: ${format(new Date(), "MMM d, yyyy")}`, 14, 40);

    // --- Company Info (Auraa OS placeholder) ---
    doc.text("Auraa OS", pageWidth - 14, 25, { align: "right" });
    doc.text("123 Business Avenue", pageWidth - 14, 30, { align: "right" });
    doc.text("Tech District, CA 90210", pageWidth - 14, 35, { align: "right" });
    doc.text("billing@auraa.com", pageWidth - 14, 40, { align: "right" });

    doc.line(14, 45, pageWidth - 14, 45); // Horizontal line

    // --- Bill To ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Bill To:", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(client.clientName, 14, 62);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    if (client.email) doc.text(client.email, 14, 67);
    if (client.phone) doc.text(client.phone, 14, 72);

    // --- Project Details Table ---
    autoTable(doc, {
        startY: 85,
        head: [["Description", "Details"]],
        body: [
            ["Project Name", project.projectName],
            ["Project Status", project.status],
            ["Start Date", formatDate(project.createdDate)],
            ["Target Deadline", formatDate(project.deadline)],
        ],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [249, 250, 251], textColor: [55, 65, 81], fontStyle: "bold" },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 } },
    });

    // --- Financials Table ---
    const financialStartY = (doc as any).lastAutoTable.finalY + 15;

    autoTable(doc, {
        startY: financialStartY,
        head: [["Item Description", "Amount"]],
        body: [
            [`Project: ${project.projectName}`, formatCurrency(project.budget || 0)],
        ],
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: {
            1: { halign: "right", fontStyle: "bold" },
        },
    });

    // --- Total ---
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Total Due:", pageWidth - 60, finalY + 15);
    doc.text(formatCurrency(project.budget || 0), pageWidth - 14, finalY + 15, { align: "right" });

    // --- Footer ---
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", pageWidth / 2, doc.internal.pageSize.height - 20, { align: "center" });

    return doc;
};

/**
 * Generate a PDF Report for a project
 */
export const generateProjectReport = (project: Project, client: Client): jsPDF => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("PROJECT REPORT", 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), "PPpp")}`, 14, 32);

    doc.line(14, 38, pageWidth - 14, 38);

    // --- Client & Project Overview ---
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Overview", 14, 50);

    autoTable(doc, {
        startY: 55,
        body: [
            ["Client Name", client.clientName],
            ["Project Name", project.projectName],
            ["Status", project.status],
            ["Progress", `${project.progress || 0}%`],
            ["Start Date", formatDate(project.createdDate)],
            ["Deadline", formatDate(project.deadline)],
            ["Budget", formatCurrency(project.budget || 0)],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: "bold", fillColor: [248, 250, 252], cellWidth: 50 },
            1: { cellWidth: "auto" }
        },
    });

    // --- Progress Bar Visualization Simulation ---
    const progressY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text("Completion Status", 14, progressY);

    const barWidth = pageWidth - 28;
    const progress = project.progress || 0;
    const fillWidth = barWidth * (progress / 100);

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(14, progressY + 5, barWidth, 10, "FD");

    // Fill bar
    doc.setFillColor(37, 99, 235); // blue-600
    if (fillWidth > 0) {
        doc.rect(14, progressY + 5, fillWidth, 10, "F");
    }

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`${progress}% Complete`, 14, progressY + 20);

    return doc;
};


/**
 * Generate a single PDF Report containing all projects for a client
 */
export const generateAllProjectsReport = (projects: Project[], client: Client): jsPDF => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("ALL PROJECTS REPORT", 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), "PPpp")}`, 14, 32);

    doc.line(14, 38, pageWidth - 14, 38);

    // --- Client Overview ---
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Client: ${client.clientName}`, 14, 50);

    const active = projects.filter(p => p.status === "Working").length;
    const completed = projects.filter(p => p.status === "Completed").length;

    autoTable(doc, {
        startY: 55,
        body: [
            ["Total Projects", projects.length.toString()],
            ["Active Projects", active.toString()],
            ["Completed Projects", completed.toString()],
        ],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 50 },
            1: { cellWidth: "auto", fontStyle: "bold" }
        },
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;

    // --- Projects List ---
    projects.forEach((project, index) => {
        // Add new page if we are too close to the bottom
        if (currentY > doc.internal.pageSize.height - 40) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${project.projectName}`, 14, currentY);
        doc.setFont("helvetica", "normal");

        autoTable(doc, {
            startY: currentY + 5,
            head: [["Status", "Progress", "Start Date", "Deadline", "Budget"]],
            body: [
                [
                    project.status === "Working" ? "Active" : project.status,
                    `${project.progress || 0}%`,
                    formatDate(project.createdDate),
                    formatDate(project.deadline),
                    formatCurrency(project.budget || 0)
                ]
            ],
            theme: "grid",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [248, 250, 252], textColor: [55, 65, 81] }
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;
    });

    // --- Footer ---
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: "center" });
    }

    return doc;
};


/**
 * Generate a ZIP containing multiple PDFs
 */
export const downloadZip = async (
    filename: string,
    items: { name: string, pdf: jsPDF }[]
) => {
    const zip = new JSZip();

    items.forEach(item => {
        // Output PDF to ArrayBuffer and add to zip
        const arrayBuffer = item.pdf.output("arraybuffer");
        zip.file(item.name, arrayBuffer);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${filename}.zip`);
};
