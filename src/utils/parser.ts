/**
 * General parser interface.
 */
export interface Parser<T> {
  /**
   * Parses the given input and returns the result.
   * @param input The input to parse.
   */
  parse(input: string): T;
}

/**
 * Type of the result of a parser.
 */
export type ParserResult<P extends Parser<unknown>> = P extends Parser<infer T> ? T | undefined : never;

/**
 * A parser that matches a regular expression and returns the matches.
 * @param regex The regular expression to match.
 */
export const regexParser = (regex: RegExp): Parser<string[]> => ({
  parse: input => {
    const matches = input.match(regex);
    if (matches === null) {
      throw new Error(`does not match the expected pattern ${regex}`);
    }
    return [...matches];
  },
});

/**
 * A parser that maps the result of another parser.
 * @param inputParser The parser to map.
 * @param map The mapping function.
 * @param mapError An optional error mapping function.
 */
export const mapParser = <T, R>(
  inputParser: Parser<T>,
  map: (value: T) => R,
  mapError?: (error: Error) => Error
): Parser<R> => ({
  parse: input => {
    try {
      return map(inputParser.parse(input));
    } catch (error) {
      if (mapError) {
        throw mapError(error);
      }
      throw error;
    }
  },
});
