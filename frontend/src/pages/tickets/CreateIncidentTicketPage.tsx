import React, { useState } from 'react';
import TicketForm from '../../components/tickets/TicketForm';
import { ticketService } from '../../services/ticketService';
import { AlertTriangle } from 'lucide-react';

const CreateIncidentTicketPage: React.FC = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (payload: any, files: File[]) => {
    await ticketService.createTicket(payload, files);
    setMessage({ type: 'success', text: 'Incident ticket created successfully! 🎉' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="bg-white rounded-[28px] shadow-xl p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Incident Ticket</h1>
                <p className="text-gray-600 mt-1">Report issues with attachments and contact details for quick resolution.</p>
              </div>
            </div>
            <div className="rounded-3xl bg-orange-50 border border-orange-100 p-4 text-sm text-orange-700">
              Tip: Provide clear details and photos for faster response.
            </div>
          </div>

          {message && (
            <div
              role="alert"
              className={`mb-6 p-4 rounded-3xl flex items-center gap-3 text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-900 border border-green-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              <span className="text-lg">{message.type === 'success' ? '✓' : '⚠'}</span>
              <span>{message.text}</span>
            </div>
          )}

          <TicketForm onSubmit={handleSubmit} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to create a good ticket</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3 items-start">
                <span className="mt-1 text-orange-600">1.</span>
                <span>Use a clear, descriptive title.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-1 text-orange-600">2.</span>
                <span>Choose the right category and priority.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-1 text-orange-600">3.</span>
                <span>Describe the issue in detail with photos if possible.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-1 text-orange-600">4.</span>
                <span>Provide accurate location and contact info.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-3">Emergency?</h2>
            <p className="text-sm leading-6">For critical issues affecting safety or operations, call campus security or IT support directly.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateIncidentTicketPage;
