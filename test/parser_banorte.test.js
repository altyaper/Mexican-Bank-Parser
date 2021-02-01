import path from 'path';
import fs from 'fs';
import ParserBanorte from '../lib/parser_banorte';
import { expect } from 'chai';

describe('ParserBanorte', () => {
    var content;
    var parser;
    beforeEach((done) => {
      fs.readFile(path.resolve('./test/files/banorte.txt'), 'utf8', (error, data) => {
        content = data;
        parser = new ParserBanorte(content);
        done();
      });
    });

    it('should return the right object for banorte rows', () => {
      const finalObject = parser.parse();
      const expectedDate = new Date();
      expectedDate.setDate(29);
      expectedDate.setFullYear(2017);
      expectedDate.setMonth(8);
      expect(finalObject).to.be.an('array');
      expect(finalObject[0]).to.be.an('object');
    });

    it('should return the right date', () => {
      const date = parser.getBanorteDate('29/Dic./2017');
      const expectedDate = new Date(2017, 11, 29, 0, 0, 0);
      expect(date).to.be.eql(expectedDate);
    });

    it('should retrieve an array of objects from the content file', () => {
      const items = ['17/Dic./2020	726	511	COMPRA ORDEN DE PAGO SPEI     0000000001 =REFERENCIA  CTA/CLABE: 014150655078641339, BXI SPEI BCO:014 BENEF:SOLAR CARPORTS MEXICO S DE R (DATO NO VERIF    POR ESTA INST), Paneles                                      CVE RASTREO: 7875APR1202012171153374990 RFC: SCM191018UZ3    IVA: 000000000000.00 SANTANDER           HORA LIQ: 07:21:58	100000		92187.09'];
      const objects = parser.getArrayPaymentsObject(items);
      expect(objects[0]).to.be.eql({
        reference: '',
        description: 'COMPRA ORDEN DE PAGO SPEI     0000000001 =REFERENCIA  CTA/CLABE: 014150655078641339, BXI SPEI BCO:014 BENEF:SOLAR CARPORTS MEXICO S DE R (DATO NO VERIF    POR ESTA INST), Paneles                                      CVE RASTREO: 7875APR1202012171153374990 RFC: SCM191018UZ3    IVA: 000000000000.00 SANTANDER           HORA LIQ: 07:21:58',
        charge: '100000',
        payment: '0',
        balance: '92187.09',
        hash: '0cd2fae8ebecacea03d1f7222c440a0f',
        date: new Date(2020, 11, 17, 0, 0, 0)
      });
    });

    it('should get the right reference from a reference row', () => {
      const items = ['18/Dic./2020	736	3	MBAN01002012210073093487      SPEI RECIBIDO, BCO:0012 BBVA BANCOMER       HR LIQ: 21:06:17 DEL CLIENTE JAVIER SAENZ LEGARDA                             DE LA CLABE 012158004573218058   CON RFC SALJ980820RA7       CONCEPTO: PANELES SOLARES JAVIER SAENZ                       REFERENCIA: 5381220 CVE RAST: MBAN01002012210073093487		2162.41	37106.32'];
      const objects = parser.getArrayPaymentsObject(items);
      expect(objects[0].reference).to.be.eql('5381220');
    });

    it('should get the right month number', () => {
      expect(parser.getMonthFromString('Dic.')).to.be.eql(12);
      expect(parser.getMonthFromString('NOT.')).to.be.eql(undefined);
    });
});
