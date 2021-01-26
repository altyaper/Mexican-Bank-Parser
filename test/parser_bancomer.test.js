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
      expect(objects[0]).to.be.eql({
        reference: '',
        description: 'AGUA Y SANEAMIENTO CHIH/JMA500421 GPO O2392975',
        charge: 150,
        payment: 0,
        balance: 360,
        hash: '4ac5d2c662fa9c014368dcaa704ce07e',
        date: new Date(2020, 0, 2, 0, 0, 0)
      });
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
      expect(payments[0].reference).to.be.eql('');
      expect(payments[0].description).to.be.eql('AGUA Y SANEAMIENTO CHIH/JMA500421 GPO O2392975');
      expect(payments[0].charge).to.be.eql(150);
    });

    it('should get the reference from TEF', () => {
      const description = 'TEF RECIBIDOBANAMEX/0183770760  002 03401210340121';
      const reference = parser.getTEFReference(description);
      expect(reference).to.be.eql('0340121');
    });

    it('should get the reference from SPEI', () => {
      const description = 'SPEI RECIBIDOBANAMEX/0183770760  002 03401210340121';
      const reference = parser.getTEFReference(description);
      expect(reference).to.be.eql('0340121');
    });

    it('should get the reference from DEPOSITO EFECTIVO PRACTIC', () => {
      const description = 'DEPOSITO EFECTIVO PRACTIC/**2875 0620122 0763 FOLIO:2594';
      const reference = parser.getPracticReference(description);
      expect(reference).to.be.eql('0620122');
    });

    it('should get the reference from DEPOSITO EN EFECTIVO', () => {
      const description = 'DEPOSITO EN EFECTIVO/000765500440121';
      const reference = parser.getCashReference(description);
      expect(reference).to.be.eql('0440121');
    });

    it('should get the reference from PAGO CUENTA DE TERCERO without reference', () => {
      const description = 'PAGO CUENTA DE TERCERO/ 9539256342 BNET 2761285653 0560121';
      const reference = parser.getCashReference(description);
      expect(reference).to.be.eql('0560121');
    });

    it('should get the reference from PAGO CUENTA DE TERCERO with reference', () => {
      const description = 'PAGO CUENTA DE TERCERO/ 9539256342 BNET 2761285653 0560121PAGO';
      const reference = parser.getThirdReference(description);
      expect(reference).to.be.eql('0560121');
    });

    it('should get the reference from PAGO CUENTA DE TERCERO with reference / option B', () => {
      const description = 'PAGO CUENTA DE TERCERO/ 9539256342 BNET 2761285653 PAGO0560121';
      const reference = parser.getThirdReference(description);
      expect(reference).to.be.eql('0560121');
    });

    it('should use the right reference extractor', () => {
      const tefDescription = 'TEF RECIBIDOBANAMEX/0183770760  002 03401210340121';
      const tefReference = parser.getBancomerReference(tefDescription);
      expect(tefReference).to.be.eql('0340121');

      const speiDescription = 'SPEI RECIBIDOSANTANDER/0183281785 014 0300121CUOTA ENERO';
      const speiReference = parser.getBancomerReference(speiDescription);
      expect(speiReference).to.be.eql('0300121');

      const practicDescription = 'DEPOSITO EFECTIVO PRACTIC/**2875 0620122 0763 FOLIO:2594';
      const practicReference = parser.getBancomerReference(practicDescription);
      expect(practicReference).to.be.eql('0620122');

      const cashDescription = 'DEPOSITO EN EFECTIVO/000765500440121';
      const cashReference = parser.getBancomerReference(cashDescription.trim());
      expect(cashReference).to.be.eql('0440121');

      const thirdDescriptionOne = 'PAGO CUENTA DE TERCERO/ 9534080480 BNET 1228079528 PAGO CUOTA ANUAL';
      const thirdWithoutReference = parser.getBancomerReference(thirdDescriptionOne);
      expect(thirdWithoutReference).to.be.eql('');

      const thirdDescriptionTwo = 'PAGO CUENTA DE TERCERO/ 9539256342 BNET 2761285653 0560121';
      const thirdWithReference = parser.getBancomerReference(thirdDescriptionTwo);
      expect(thirdWithReference).to.be.eql('0560121');
    });

    it('should set the balance correctly', () => {
      const items = ['13-01-2021	SPEI RECIBIDOBANAMEX/0183770760  002 03401210340121		800.00	68,215.34'];
      const objects = parser.getArrayPaymentsObject(items);
      expect(objects[0].balance).to.be.eql(68215.34);
    });
});
