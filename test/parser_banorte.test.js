import path from 'path';
import fs from 'fs';
import ParserBanorte from '../lib/parser_banorte';
import { expect } from 'chai';

describe('ParserBanorte', () => {
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
      expect(finalObject[0].balance).to.be.eql('71,846.83');
      expect(finalObject[0].charge).to.be.eql('200.00');
      expect(finalObject[0].payment).to.be.eql('0');
      expect(finalObject[0].reference).to.be.eql('PAGO CUENTA DE TERCERO/ 0092658031 BNET vecino-F10-1    0179740198');
      expect(finalObject[0].hash).to.be.eql('7bb2c551b792f538e5055d9490a78b42');
    });

    it('should return the right date', () => {
      const date = parser.getBanorteDate('29-09-2017');
      const expectedDate = new Date('2017-09-29');
      expectedDate.setDate(29);
      expect(date.getDate()).to.be.eql(expectedDate.getDate());
    });
});
