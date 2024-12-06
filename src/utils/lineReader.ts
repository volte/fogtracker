export interface LineReaderOptions {
  map?: (line: string) => string;

  filter?: (line: string) => boolean;
}

export class LineReader {
  private readonly _lines: string[];
  private _index = 0;
  private _options: LineReaderOptions;

  constructor(text: string, options?: Partial<LineReaderOptions>) {
    this._lines = text.split('\n');
    this._options = {
      map: line => line,
      filter: _ => true,
      ...options,
    };
  }

  readLine(): string | undefined {
    if (this._index >= this._lines.length) {
      return undefined;
    }
    while (this._index < this._lines.length) {
      const line = this._lines[this._index++]!;
      const mappedLine = this._options.map?.(line) || line;
      if (this._options.filter?.(mappedLine)) {
        return mappedLine;
      }
    }
    return undefined;
  }

  skipLines(count: number): void {
    this._index += count;
  }

  get lineNumber(): number {
    return this._index;
  }

  get isEOF(): boolean {
    return this._index >= this._lines.length;
  }
}
