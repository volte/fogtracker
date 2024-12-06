import { LineReader } from '@/utils/lineReader';
import { mapParser, regexParser } from '@/utils/parser';

describe('lineReader', () => {
  describe('readLine', () => {
    it('reads lines', () => {
      const reader = new LineReader('foo\nbar\nbaz');
      expect(reader.readLine()).toBe('foo');
      expect(reader.readLine()).toBe('bar');
      expect(reader.readLine()).toBe('baz');
      expect(reader.readLine()).toBeUndefined();
    });
  });

  describe('parseLine', () => {
    it('parses lines', () => {
      const parser = mapParser(regexParser(/^(\w+) (\d+)$/), matches => ({
        name: matches[1],
        value: Number(matches[2]),
      }));
      const reader = new LineReader('foo 123\nbar 456');
      expect(reader.parseLine(parser)).toEqual({ name: 'foo', value: 123 });
      expect(reader.parseLine(parser)).toEqual({ name: 'bar', value: 456 });
      expect(reader.parseLine(parser)).toBeUndefined();
    });
  });
});
