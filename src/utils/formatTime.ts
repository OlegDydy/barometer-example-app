const long = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'long',
  weekday: 'long',
  day: 'numeric',
  hour12: false,
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'longOffset',
});
const short = new Intl.DateTimeFormat('ru', {
  month: 'short',
  weekday: 'short',
  dayPeriod: 'short',
  hour12: true,
  hour: 'numeric',
  timeZoneName: 'short',
});

export function strftime(format: string, time: Date | number | string) {
  if (typeof time == 'number' || typeof time == 'string') {
    time = new Date(time);
  }
  const parts = extractParts(time);

  return format.replace(/%(-?[\w%])/g, (sub, part) => parts[part] || sub);
}

const DAY = 24 * 3_600_000;
const WEEK = 7 * DAY;

function extractParts(time: Date) {
  const result: Record<string, string> = {
    '%': '%',
    a: '',
    A: '',
    w: '',
    d: '',
    '-d': '',
    b: '',
    B: '',
    m: '',
    '-m': '',
    y: '',
    Y: '',
    H: '',
    '-H': '',
    I: '',
    '-I': '',
    p: '',
    M: '',
    '-M': '',
    S: '',
    '-S': '',
    f: '',
    z: '',
    Z: '',
    j: '',
    '-j': '',
    U: '',
    '-U': '',
    W: '',
    '-W': '',
    c: '',
    x: '',
    X: '',
  };
  const beginningOfTheYear = new Date(time.getFullYear(), 0, 1);
  const firstMonday = new Date(beginningOfTheYear);
  const firstSunday = new Date(beginningOfTheYear);
  firstMonday.setDate(1 + ((7 - ((firstMonday.getDay() + 6) % 7)) % 7));
  firstSunday.setDate(1 + ((7 - firstSunday.getDay()) % 7));

  result['-m'] = (time.getMonth() + 1).toString();
  result.m = result['-m'].padStart(2, '0');
  result.w = time.getDay().toString();
  result.c = time.toLocaleString();
  result.x = time.toLocaleDateString();
  result.X = time.toLocaleTimeString();
  result.f = `${(time.valueOf() % 1000).toString().padStart(3, '0')}000`;

  const dayOfYear = Math.trunc((time.valueOf() - beginningOfTheYear.valueOf()) / DAY) + 1;
  result['-j'] = dayOfYear.toString();
  result.j = result['-j'].padStart(3, '0');

  const U = Math.trunc((time.valueOf() - firstSunday.valueOf()) / WEEK) + 1;
  result['-U'] = U.toString();
  result.U = result['-U'].padStart(2, '0');

  const W = Math.trunc((time.valueOf() - firstMonday.valueOf()) / WEEK) + 1;
  result['-W'] = W.toString();
  result.W = result['-W'].padStart(2, '0');

  for (const part of long.formatToParts(time)) {
    switch (part.type) {
      case 'year':
        result.Y = part.value;
        result.y = part.value.slice(-2);
        break;
      case 'month':
        result.B = part.value;
        break;
      case 'weekday':
        result.A = part.value;
        break;
      case 'day':
        result.d = part.value.padStart(2, '0');
        result['-d'] = part.value;
        break;
      case 'hour':
        result.H = part.value.padStart(2, '0');
        result['-H'] = part.value;
        break;
      case 'minute':
        result.M = part.value.padStart(2, '0');
        result['-M'] = part.value;
        break;
      case 'second':
        result.S = part.value.padStart(2, '0');
        result['-S'] = part.value;
        break;
      case 'timeZoneName':
        result.z = part.value.replace(/[^\d+-]/g, '');
        break;
    }
    for (const part of short.formatToParts(time)) {
      switch (part.type) {
        case 'month':
          result.b = part.value;
          break;
        case 'weekday':
          result.a = part.value;
          break;
        case 'dayPeriod':
          result.p = part.value;
          break;
        case 'hour':
          result.I = part.value.padStart(2, '0');
          result['-I'] = part.value;
          break;
        case 'timeZoneName':
          result.Z = part.value;
          break;
      }
    }
  }

  return result;
}

(globalThis as any)['ts'] = extractParts;
