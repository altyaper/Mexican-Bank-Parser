import path from 'path';
import fs from 'fs';
import ParserBanorte from '../lib/parser_banorte';
import { expect } from 'chai';

describe.only('ParserBanorte', () => {
    var content;
    var parser;
    beforeEach((done) => {
      fs.readFile(path.resolve('./test/files/banorte.exp'), 'utf8', (error, data) => {
        content = data;
        parser = new ParserBanorte(content);
        done();
      });
    });

    it('should return the right object for santander rows', () => {
      const finalObject = parser.parse();
      const expectedDate = new Date();
      expectedDate.setDate(29);
      expectedDate.setFullYear(2017);
      expectedDate.setMonth(8);
      expect(finalObject).to.be.an('array');
      expect(finalObject[0]).to.be.an('object');
      expect(finalObject[0]).to.be.eql({
        date: expectedDate,
        balance: '71,846.83',
        charge: '200.00',
        payment: '0',
        reference: 'PAGO CUENTA DE TERCERO/ 0092658031 BNET vecino-F10-1    0179740198'
      });
    });

    it('should return the right date', () => {
      const date = parser.getBanorteDate('29-09-2017');
      const expectedDate = new Date('2017-09-29');
      expectedDate.setDate(29);
      expect(date.getDate()).to.be.eql(expectedDate.getDate());
    });
});
