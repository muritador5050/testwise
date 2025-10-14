// Brand Colors
export const colors = {
  // Primary
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryLight: '#3b82f6',

  // Backgrounds
  pageBg: '#f0f4f8',
  cardBg: '#ffffff',
  sectionBg: '#e0e7ff',

  // Text
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',

  // Borders
  border: '#cbd5e1',

  // Status
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
};

// Common style combinations
export const bgStyles = {
  page: { bg: colors.pageBg },
  card: { bg: colors.cardBg, borderColor: colors.border, borderWidth: '1px' },
  section: { bg: colors.sectionBg },
};

export const buttonStyles = {
  primary: {
    bg: colors.primary,
    color: 'white',
    _hover: { bg: colors.primaryHover },
  },
  outline: {
    variant: 'outline',
    borderColor: colors.primary,
    color: colors.primary,
    _hover: { bg: colors.sectionBg },
  },
};

export const textStyles = {
  heading: { color: colors.textPrimary },
  body: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
};
