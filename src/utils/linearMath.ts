export type Vec2Like = [x: number, y: number];
export type NdArrayLike<Dims extends number[] = Vec2Like> = {
  /** shape */
  s: Dims;
  /** stride */
  t: Dims;
  /** offset */
  o: number;
  /** data */
  d: { readonly length: number; [n: number]: number };
};

export const Vec2 = {
  set(result: Vec2Like, x: number, y: number) {
    result[0] = x;
    result[1] = y;
    return result;
  },
  add(result: Vec2Like, a: Vec2Like, b: Vec2Like): Vec2Like {
    result[0] = a[0] + b[0];
    result[1] = a[1] + b[1];
    return result;
  },
  sub(result: Vec2Like, a: Vec2Like, b: Vec2Like): Vec2Like {
    result[0] = a[0] - b[0];
    result[1] = a[1] - b[1];
    return result;
  },
  mul(result: Vec2Like, a: Vec2Like, b: Vec2Like): Vec2Like {
    result[0] = a[0] * b[0];
    result[1] = a[1] * b[1];
    return result;
  },
  div(result: Vec2Like, a: Vec2Like, b: Vec2Like): Vec2Like {
    result[0] = a[0] / b[0];
    result[1] = a[1] / b[1];
    return result;
  },
  scale(result: Vec2Like, a: Vec2Like, b: number): Vec2Like {
    result[0] = a[0] * b;
    result[1] = a[1] * b;
    return result;
  },
};

export function ndarray<Dims extends number[] = Vec2Like>(shape: Dims, source?: number[]): NdArrayLike<Dims> {
  let stride = 1;
  source ||= new Array(shape.reduce((prod, val) => prod * val, 1)).fill(0);
  return {
    s: [...shape] as Dims,
    t: Array.from(shape, (_, i) => {
      const result = stride;
      stride *= shape[shape.length - i - 1] as number;
      return result;
    }).reverse() as Dims,
    o: 0,
    d: source,
  };
}
ndarray.from = function<Dims extends number[] = Vec2Like>(src: NdArrayLike<Dims>): NdArrayLike<Dims> {
  return {
    s: [...src.s] as Dims,
    t: [...src.t] as Dims,
    o: src.o,
    d: Array.from(src.d),
  };
}
ndarray.print = function (m: NdArrayLike<Vec2Like>) {
  const {
    s: [si, sj],
    t: [ti, tj],
    d,
    o
  } = m;
  const w = new Array(sj).fill(0);
  const table = Array.from({ length: si }, () => [] as string[]);
  for (let i = 0; i < si; ++i) {
    for (let j = 0; j < sj; ++j) {
      const str = (d[i * ti + j * tj + o] as number).toFixed(2);
      if (str.length > w[j]) {
        w[j] = str.length;
      }
      (table[i] as string[])[j] = str;
    }
  }
  console.log(table.map(row => `[${row.map((value, i) => value.padStart(w[i])).join(' ')}]`).join('\n'));
}

export function ident(n: number) {
  const result = ndarray([n, n] as const);
  const { d, t: [ti, tj] } = result;
  for (let i = 0; i < n; ++i) {
    d[i * ti + i * tj] = 1;
  }
  return result;
}

export function invert(m: NdArrayLike): NdArrayLike {
  if (m.s[0] != m.s[1]) throw new TypeError('Argument `m` is not a square matrix');

  m = ndarray.from(m);
  const {
    s: [size],
    t: [ti, tj],
    d,
    o,
  } = m;

  const I = ident(m.s[0]);
  const {
    t: [Iti, Itj],
    d: Id,
    o: Io
  } = I;
  const result: Vec2Like = [0, 0];
  // Forward
  const orderI = Array.from({ length: size }, (_, i) => i);
  const orderJ = Array.from({ length: size }, (_, i) => i);
  for (let k = 0; k < size; ++k) {
    selectMain(result, m, k);
    if (result[0] != k) {
      swap(m, 0, k, result[0]);
      swap(I, 0, k, result[0]);

      const tmp = orderJ[k] as number;
      orderJ[k] = orderJ[result[0]] as number;
      orderJ[result[0]] = tmp;
    }
    if (result[1] != k) {
      swap(m, 1, k, result[1]);
      swap(I, 1, k, result[1]);

      const tmp = orderI[k] as number;
      orderI[k] = orderI[result[1]] as number;
      orderI[result[1]] = tmp;
    }

    const base = d[k * ti + k * tj + o] as number;
    if (base === 1.0e-9) throw new EvalError("Singular matrix");
    for (let j = 0; j < size; ++j) {
      (d[k * ti + j * tj + o] as number) /= base;
      (Id[k * Iti + j * Itj + Io] as number) /= base;
    }
    for (let i = k + 1; i < size; ++i) {
      const K = (d[i * ti + k * tj + o] as number);
      for (let j = 0; j < size; ++j) {
        (d[i * ti + j * tj + o] as number) -= K * (d[k * ti + j * tj + o] as number);
        (Id[i * Iti + j * Itj + Io] as number) -= K * (Id[k * Iti + j * Itj + Io] as number);
      }
    }
  }
  // Backward
  for (let k = size; k-- > 1; ) {
    for (let i = k; i--;) {
      const K = (d[i * ti + k * tj + o] as number);
      for (let j = 0; j < size; ++j) {
        (d[i * ti + j * tj + o] as number) -= K * (d[k * ti + j * tj + o] as number);
        (Id[i * Iti + j * Itj + Io] as number) -= K * (Id[k * Iti + j * Itj + Io] as number);
      }
    }
  }
  // restore row order
  for (let i = size; i-- > 1;) {
    const j = orderI.indexOf(i);
    swap(I, 0, i, j);

    const tmp = orderI[i] as number;
    orderI[i] = orderI[j] as number;
    orderI[j] = tmp;
  }
  // for (let i = size; i-- > 1;) {
  //   const j = orderJ.indexOf(i);
  //   swap(I, 0, i, j);

  //   const tmp = orderJ[i] as number;
  //   orderJ[i] = orderJ[j] as number;
  //   orderJ[j] = tmp;
  // }

  return I;
}

function swap(m: NdArrayLike, dir: 0 | 1, a: number, b: number) {
  const {
    d,
    s: [si, sj],
    t: [ti, tj],
    o,
  } = m;
  let tmp = 0;
  if (dir == 0) {
    for (let j = 0; j < sj; ++j) {
      const aPtr = a * ti + j * tj + o;
      const bPtr = b * ti + j * tj + o;
      tmp = d[aPtr] as number;
      d[aPtr] = d[bPtr] as number;
      d[bPtr] = tmp;
    }
  } else {
    for (let i = 0; i < si; ++i) {
      const aPtr = i * ti + a * tj + o;
      const bPtr = i * ti + b * tj + o;
      tmp = d[aPtr] as number;
      d[aPtr] = d[bPtr] as number;
      d[bPtr] = tmp;
    }
  }
}

function selectMain(result: Vec2Like, m: NdArrayLike, start = 0): Vec2Like {
  const {
    d,
    s: [si, sj],
    t: [ti, tj],
    o,
  } = m;
  Vec2.set(result, start, start);
  let max = d[o] as number;
  for (let i = start; i < si; ++i) {
    for (let j = start; j < sj; ++j) {
      const v = Math.abs(d[i * ti + j * tj + o] as number);
      if (v > max) {
        max = v;
        Vec2.set(result, i, j);
      }
    }
  }
  return result;
}
