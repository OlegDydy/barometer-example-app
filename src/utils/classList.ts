export function cl(...classes: (string | false | undefined | null | Record<string, boolean | undefined | null>)[]): string {
  let result: string[] = [];

  for (const item of classes) {
    if (!item) continue;

    if (typeof item == 'string') {
      result.push(item);
      continue;
    }

    for (const klass in item) {
      const value = item[klass];
      if (!value) continue;

      result.push(klass);
    }
  }

  return result.join(' ');
}
