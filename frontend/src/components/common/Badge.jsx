import React from 'react';
import { Clock, CheckCircle2, FileText, CheckCheck, XCircle, IndianRupee, AlertTriangle, ShieldCheck, UserX } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const configs = {
    SUBMITTED: {
      label: 'Submitted',
      bg: '#F0F5F8',
      text: '#426B85',
      border: '#D0DEE5',
      Icon: FileText
    },
    UNDER_VERIFICATION: {
      label: 'Under Verification',
      bg: '#FEF8EC',
      text: '#B7791F',
      border: '#FBE3B5',
      Icon: Clock
    },
    VERIFIED: {
      label: 'Verified',
      bg: '#EAF5EF',
      text: '#287C5A',
      border: '#BCE3D2',
      Icon: ShieldCheck
    },
    UNDER_APPROVAL: {
      label: 'Under Approval',
      bg: '#F2F0F7',
      text: '#665C8A',
      border: '#D6D1E6',
      Icon: Clock
    },
    APPROVED: {
      label: 'Approved',
      bg: '#EAF5EF',
      text: '#287C5A',
      border: '#BCE3D2',
      Icon: CheckCheck
    },
    PAYMENT_PENDING: {
      label: 'Payment Pending',
      bg: '#FEF8EC',
      text: '#B7791F',
      border: '#FBE3B5',
      Icon: AlertTriangle
    },
    PAYMENT_PROCESSED: {
      label: 'Payment Processed',
      bg: '#EAF5EF',
      text: '#287C5A',
      border: '#BCE3D2',
      Icon: IndianRupee
    },
    PAID: {
      label: 'Payment Processed',
      bg: '#EAF5EF',
      text: '#287C5A',
      border: '#BCE3D2',
      Icon: IndianRupee
    },
    REJECTED: {
      label: 'Rejected',
      bg: '#FDF2F2',
      text: '#B84040',
      border: '#F6C6C6',
      Icon: XCircle
    },
    NOT_ELIGIBLE: {
      label: 'Not Eligible',
      bg: '#F4F3F1',
      text: '#6B625A',
      border: '#D6D3D0',
      Icon: UserX
    },
    DRAFT: {
      label: 'Draft',
      bg: '#F0F5F8',
      text: '#426B85',
      border: '#D0DEE5',
      Icon: Clock
    },
    ACTIVE: {
      label: 'Active',
      bg: '#EAF5EF',
      text: '#287C5A',
      border: '#BCE3D2',
      Icon: CheckCircle2
    }
  };

  const normalized = status ? status.toUpperCase().replace(/\s+/g, '_') : 'SUBMITTED';
  const config = configs[normalized] || configs.SUBMITTED;
  const IconComponent = config.Icon;

  const isLiveState = ['UNDER_VERIFICATION', 'UNDER_APPROVAL', 'PAYMENT_PENDING'].includes(normalized);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs transition-transform duration-200 hover:scale-105"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border
      }}
    >
      {isLiveState ? (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: config.text }}></span>
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: config.text }}></span>
        </span>
      ) : (
        <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      <span>{config.label}</span>
    </span>
  );
};
