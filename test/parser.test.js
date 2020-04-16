import ParserBanamex from '../lib/parser_banamex';
import ParserBanorte from '../lib/parser_banorte';
import ParserBancomer from '../lib/parser_bancomer';
import ParserSantander from '../lib/parser_santander';
import Banks from '../lib/';
import { expect } from 'chai';

describe('Parser factory', () => {
  it('should return a ParserBanamex instance', () => {
      const c = new Banks['banamex']();
      expect(c).instanceOf(ParserBanamex);
  });

  it('should return a ParserBanorte instance', () => {
    const c = new Banks['banorte']();
    expect(c).instanceOf(ParserBanorte);
  });

  it('should return a ParserSantander instance', () => {
    const c = new Banks['santander']();
    expect(c).instanceOf(ParserSantander);
  });

  it('should return a ParserSantander instance', () => {
    const c = new Banks['bancomer']();
    expect(c).instanceOf(ParserBancomer);
  });
});
