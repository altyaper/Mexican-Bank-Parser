import path from 'path';
import fs from 'fs';
import ParserBancomer from '../lib/parser_bancomer';
import { expect } from 'chai';

describe('ParserBancomer', () => {
    var content;
    var parser;
    beforeEach((done) => {
      fs.readFile(path.resolve('./test/files/bancomer.exp'), 'utf8', (error, data) => {
        content = data;
        parser = new ParserBancomer(content, '1');
        done();
      });
    });

    it('should parse a bancomer file', () => {
      expect(parser.split()).to.be.an('array');
    });

    it('should retrieve the array from the line', () => {
      const line = '29-09-2017	PAGO CUENTA DE TERCERO/ 0092658031 BNET vecino-F10-1    0179740198	200.00		71,846.83';
      const object = parser.getPaymentObject(line);
      expect(object[0]).to.be.eql('29-09-2017');
      expect(object[1]).to.be.eql('PAGO CUENTA DE TERCERO/ 0092658031 BNET vecino-F10-1    0179740198');
      expect(object[2]).to.be.eql('200.00');
      expect(object[3]).to.be.eql('');
      expect(object[4]).to.be.eql('71,846.83');
    });

    it('should retrieve an array of objects from the content file', () => {
      const items = ['02-01-2020	AGUA Y SANEAMIENTO CHIH/JMA500421 GPO O2392975	150.00		360.00'];
      const objects = parser.getArrayPaymentsObject(items);
      expect(objects[0].reference).to.be.eql('AGUA Y SANEAMIENTO CHIH/JMA500421 GPO O2392975');
      expect(objects[0].charge).to.be.eql('150.00');
      expect(objects[0].payment).to.be.eql('0');
      expect(objects[0].balance).to.be.eql('360.00');
      expect(objects[0].hash).to.be.eql('4ac5d2c662fa9c014368dcaa704ce07e');
    });

    it('should parse dates correctly', () => {
      const items = ['30-01-2020	CE00000000000000011978/310455G 11941                         0984078		114.00	999.00'];
      const objects = parser.getArrayPaymentsObject(items);
      const expectedDate = new Date('01-30-2020');
      expect(objects[0].date).to.be.eql(expectedDate);
    });

    it('should parse a file', () => {
      const payments = parser.parse(content);
      expect(payments).to.be.an('array');
      expect(payments).to.be.length(7);
      expect(payments[0].reference).to.be.eql('AGUA Y SANEAMIENTO CHIH/JMA500421 GPO O2392975');
      expect(payments[0].charge).to.be.eql('150.00');
    });
});
