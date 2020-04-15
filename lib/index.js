import ParserBanamex from './parser_banamex';
import ParserBanorte from './parser_banorte';
import ParserSantander from './parser_santander';

const banks = {
  banamex: ParserBanamex,
  banorte: ParserBanorte,
  santander: ParserSantander
};

export default banks;
