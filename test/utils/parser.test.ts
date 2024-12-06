import { mapParser, regexParser } from '@/utils/parser';

describe('parser', () => {
  describe('regexParser', () => {
    it('parses input', () => {
      const parser = regexParser(/^(\w+) (\d+)$/);
      expect(parser.parse('foo 123')).toEqual(['foo 123', 'foo', '123']);
    });

    it('throws on failed parse', () => {
      const parser = regexParser(/(\d+)/);
      expect(() => parser.parse('foo')).toThrow(`does not match the expected pattern /(\\d+)/`);
    });
  });

  describe('mapParser', () => {
    it('maps input', () => {
      const parser = mapParser(regexParser(/^(\w+) (\d+)$/), matches => ({
        name: matches[1],
        value: Number(matches[2]),
      }));
      expect(parser.parse('foo 123')).toEqual({ name: 'foo', value: 123 });
    });

    it('throws on failed parse', () => {
      const parser = mapParser(
        regexParser(/^(\w+) (\d+)$/),
        matches => ({
          name: matches[1],
          value: Number(matches[2]),
        }),
        _ => new Error('failed to parse { name, value }')
      );
      expect(() => parser.parse('foo')).toThrow(`failed to parse { name, value }`);
    });
  });
});
