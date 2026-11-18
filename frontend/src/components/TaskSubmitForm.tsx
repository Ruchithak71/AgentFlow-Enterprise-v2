import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Send } from 'lucide-react';

interface DocumentUploadWorkbenchProps {
  onUploadSubmit: (formData: FormData) => Promise<void>;
  onJsonSubmit: (payload: any) => Promise<void>;
  isSubmitting: boolean;
}

export const DocumentUploadWorkbench: React.FC<DocumentUploadWorkbenchProps> = ({
  onUploadSubmit,
  onJsonSubmit,
  isSubmitting
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vendorId, setVendorId] = useState('VEN-1001');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(4500.50);
  const [poNumber, setPoNumber] = useState('PO-1001');
  const [containsPII, setContainsPII] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const applyPreset = (preset: {
    vendorId: string;
    invoiceAmount: number;
    poNumber: string;
    containsPII: boolean;
    fileName: string;
  }) => {
    setVendorId(preset.vendorId);
    setInvoiceAmount(preset.invoiceAmount);
    setPoNumber(preset.poNumber);
    setContainsPII(preset.containsPII);
    // Create synthetic file representing sample invoice
    const blob = new Blob([`Invoice data for ${preset.vendorId} - Amount: $${preset.invoiceAmount}`], { type: 'application/pdf' });
    const file = new File([blob], preset.fileName, { type: 'application/pdf' });
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('vendorId', vendorId);
      formData.append('invoiceAmount', invoiceAmount.toString());
      formData.append('poNumber', poNumber);
      formData.append('containsPII', containsPII.toString());
      await onUploadSubmit(formData);
    } else {
      await onJsonSubmit({
        vendorId,
        invoiceAmount,
        poNumber,
        containsPII,
        pageCount: 2,
        taskType: 'INVOICE_AUDIT'
      });
    }
  };

  return (
    <div className="bg-cream border border-cream-dark rounded-2xl p-6 shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-steel" />
            Multimodal Document Audit Workbench
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Ingest invoice PDFs or commercial transaction files for real-time 4-Agent collaborative forensic review.
          </p>
        </div>
      </div>

      {/* 1-Click Scenario Presets */}
      <div className="mb-5">
        <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-2">
          Enterprise Test Scenarios (1-Click Sample Invoices):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset({
              vendorId: 'VEN-1001',
              invoiceAmount: 4500.50,
              poNumber: 'PO-1001',
              containsPII: false,
              fileName: 'INV_GlobalTech_4500_PO-1001.pdf'
            })}
            className="p-3 rounded-xl border border-cream-dark bg-cream-light hover:border-steel transition text-left group shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink group-hover:text-steel">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Clean Invoice
            </div>
            <p className="text-[10px] text-ink-muted mt-1">VEN-1001 • Matches PO-1001</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({
              vendorId: 'VEN-9982',
              invoiceAmount: 25000.00,
              poNumber: 'PO-9982',
              containsPII: false,
              fileName: 'INV_AcmeLogistics_25k_BLOCKED.pdf'
            })}
            className="p-3 rounded-xl border border-cream-dark bg-cream-light hover:border-rose-400 transition text-left group shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink group-hover:text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              Blocked Vendor
            </div>
            <p className="text-[10px] text-ink-muted mt-1">VEN-9982 • Blocked in SAP</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({
              vendorId: 'VEN-7700',
              invoiceAmount: 4850.00,
              poNumber: 'PO-7700',
              containsPII: false,
              fileName: 'INV_Apex_PriceMismatch_4850.pdf'
            })}
            className="p-3 rounded-xl border border-cream-dark bg-cream-light hover:border-amber-400 transition text-left group shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink group-hover:text-amber-700">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              Price Mismatch
            </div>
            <p className="text-[10px] text-ink-muted mt-1">Charges $97 vs PO $40</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset({
              vendorId: 'VEN-1001',
              invoiceAmount: 185000.00,
              poNumber: 'PO-1001',
              containsPII: true,
              fileName: 'INV_GlobalTech_185k_PII.pdf'
            })}
            className="p-3 rounded-xl border border-cream-dark bg-cream-light hover:border-steel transition text-left group shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink group-hover:text-steel">
              <FileText className="h-3.5 w-3.5 text-steel" />
              High-Exposure & PII
            </div>
            <p className="text-[10px] text-ink-muted mt-1">$185k • GDPR Enclave</p>
          </button>
        </div>
      </div>

      {/* Main Upload Dropzone & Metadata Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drag and Drop Box */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-steel bg-sky/30'
              : selectedFile
              ? 'border-steel bg-cream-light'
              : 'border-cream-dark bg-cream-light/60 hover:bg-cream-light hover:border-steel/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.json"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-full bg-sky/40 text-steel">
              <Upload className="h-6 w-6" />
            </div>
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-ink flex items-center justify-center gap-1.5">
                  <FileText className="h-4 w-4 text-steel" />
                  {selectedFile.name}
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Visual Extraction
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-ink">
                  Drag and drop an invoice PDF here, or <span className="text-steel underline">browse file</span>
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Supports Commercial Invoices, Receipts, Purchase Orders (.PDF, .PNG, .JPG)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              SAP Vendor ID
            </label>
            <input
              type="text"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
              className="w-full bg-cream-light border border-cream-dark rounded-xl px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:border-steel transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Invoice Amount ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(parseFloat(e.target.value) || 0)}
              required
              className="w-full bg-cream-light border border-cream-dark rounded-xl px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:border-steel transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Purchase Order (PO #)
            </label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              required
              className="w-full bg-cream-light border border-cream-dark rounded-xl px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:border-steel transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={containsPII}
              onChange={(e) => setContainsPII(e.target.checked)}
              className="h-4 w-4 rounded text-steel focus:ring-steel border-cream-dark"
            />
            <span className="text-xs font-medium text-ink">Contains Protected PII / GDPR Records</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-steel hover:bg-steel-dark text-white font-semibold px-5 py-2.5 rounded-xl shadow-md text-xs transition disabled:opacity-50"
          >
            <Send className={`h-4 w-4 ${isSubmitting ? 'animate-bounce' : ''}`} />
            {isSubmitting ? 'Running 4-Agent Pipeline...' : 'Dispatch Multi-Agent Audit'}
          </button>
        </div>
      </form>
    </div>
  );
};
