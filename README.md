# ParserBankMx

Usage:

```javascript
import { 
  ParserBanamex,
  ParserSantander,
  ParserBancomer,
  ParserBanorte
} from 'parsermx'

const myFileContent = '
  "Fecha","Descripción","Débito","Crédito","Saldo","Moneda"
  "05-01-2018","NOUR BISTRO REST         BNO 17012SEBAMX ","7,629.10","","0.00","MXN"
  "05-01-2018","REST LICORERIA CENTRAL   GFI 141204SC1MX ","1,558.25","","0.00","MXN"
  "05-01-2018","PAYPAL *YOURLAPTOPS      4029357722   LU ","206.18","","0.00","MXN"
  "06-01-2018","PAYPAL *SALESCTE2        4029357711   LU ","4,087.55","","0.00","MXN"
';

const parser = new ParserBanamex(myFileContent);

console.log(parser.parse());
```

Output:
```
[ { date: 2018-06-01T07:00:00.000Z,
    reference: 'PAYPAL *SALESCTE2        4029357711   LU ',
    payment: '4,087.55',
    charge: '0',
    balance: '0.00',
    currency: 'MXN' },
  { date: 2018-05-01T07:00:00.000Z,
    reference: 'PAYPAL *YOURLAPTOPS      4029357722   LU ',
    payment: '206.18',
    charge: '0',
    balance: '0.00',
    currency: 'MXN' },
  { date: 2018-05-01T07:00:00.000Z,
    reference: 'REST LICORERIA CENTRAL   GFI 141204SC1MX ',
    payment: '1,558.25',
    charge: '0',
    balance: '0.00',
    currency: 'MXN' },
  { date: 2018-05-01T07:00:00.000Z,
    reference: 'NOUR BISTRO REST         BNO 17012SEBAMX ',
    payment: '7,629.10',
    charge: '0',
    balance: '0.00',
    currency: 'MXN' } ]
```



## Run tests

`npm run test`