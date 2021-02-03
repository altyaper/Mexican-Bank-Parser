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
      const items = ['01/Feb./2021,867,3,"2021020240014BMOV0000492630930SPEI RECIBIDO, BCO:0014 SANTANDER           HR LIQ: 09:40:11 DEL CLIENTE BRIAN ROBERT BOUTILIER                           DE LA CLABE 014150606143770760   CON RFC BOBR860225AY5       CONCEPTO: 3330221                                            REFERENCIA: 6396706 CVE RAST: 2021020240014BMOV0000492630930",,$600.00,"$107,672.37",'];
      const objects = parser.getArrayPaymentsObject(items);
      expect(objects[0]).to.be.eql({
        reference: '6396706',
        description: '2021020240014BMOV0000492630930SPEI RECIBIDO, BCO:0014 SANTANDER           HR LIQ: 09:40:11 DEL CLIENTE BRIAN ROBERT BOUTILIER                           DE LA CLABE 014150606143770760   CON RFC BOBR860225AY5       CONCEPTO: 3330221                                            REFERENCIA: 6396706 CVE RAST: 2021020240014BMOV0000492630930',
        charge: '0',
        payment: '600.00',
        balance: '107672.37',
        hash: '76c95f1365af4677b76c149c767daae7',
        date: new Date(2021, 1, 1, 0, 0, 0)
      });
    });

    it('should get the right reference from a reference row', () => {
      const items = ['01/Feb./2021,867,3,"2021020240014BMOV0000492630930SPEI RECIBIDO, BCO:0014 SANTANDER           HR LIQ: 09:40:11 DEL CLIENTE BRIAN ROBERT BOUTILIER                           DE LA CLABE 014150606143770760   CON RFC BOBR860225AY5       CONCEPTO: 3330221                                            REFERENCIA: 6396706 CVE RAST: 2021020240014BMOV0000492630930",,$600.00,"$107,672.37",'];
      const objects = parser.getArrayPaymentsObject(items);
      expect(objects[0].reference).to.be.eql('6396706');
    });

    it('should get the right month number', () => {
      expect(parser.getMonthFromString('Dic.')).to.be.eql(12);
      expect(parser.getMonthFromString('NOT.')).to.be.eql(undefined);
    });
});
