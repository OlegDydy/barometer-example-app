export function capitalize(str: string): string {
  return str.replace(/(?<=(?:^|[.?!;])\s+)([^\s\d.?!:@;,^%*()[\]{}+=/\\-])/g, (s) => s.toUpperCase());
}
