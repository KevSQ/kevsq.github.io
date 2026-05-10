export function statusLabel(status: 'budding' | 'evergreen'): string {
  return status === 'budding' ? '🌱 budding' : '🌳 evergreen';
}
