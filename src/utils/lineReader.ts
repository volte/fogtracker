import { Parser, ParserResult } from '@/utils/parser';

/**
 * Options for constructing the `LineReader`.
 */
export interface LineReaderOptions {
  /**
   * If given, will transform each line by the function before returning it.
   */
  map?: (line: string) => string;

  /**
   * If given, will only return lines that pass the filter.
   * If `map` is specified, the filter will be applied to the mapped lines.
   */
  filter?: (line: string) => boolean;
}

/**
 * Helper utility to read a string line by line.
 */
export class LineReader {
  private readonly lines: string[];
  private index = 0;
  private options: LineReaderOptions;

  /**
   * Creates a new line reader.
   * @param text The text to read.
   * @param options Options to configure the `LineReader`.
   */
  constructor(text: string, options?: Partial<LineReaderOptions>) {
    this.lines = text.split('\n');
    this.options = {
      map: line => line,
      filter: _ => true,
      ...options,
    };
  }

  /**
   * Reads the next line. If there are no more lines, returns `undefined`.
   */
  readLine(): string | undefined {
    if (this.index >= this.lines.length) {
      return undefined;
    }
    while (this.index < this.lines.length) {
      const line = this.lines[this.index++];
      const mappedLine = this.options.map(line);
      if (this.options.filter(mappedLine)) {
        return mappedLine;
      }
    }
    return undefined;
  }

  /**
   * Parses the next line using the given parser.
   * Returns the parsed value, or `undefined` if there are no more lines.
   * Throws an error if the line cannot be parsed successfully.
   * @param parser The parser to use.
   */
  parseLine<P extends Parser<unknown>>(parser: P): ParserResult<P> {
    const line = this.readLine();
    if (line === undefined) {
      return undefined;
    }
    return parser.parse(line) as ParserResult<P>;
  }

  /**
   * Returns true if there are no more lines to read.
   */
  isEOF(): boolean {
    return this.index >= this.lines.length;
  }
}
