export type Wallet = {
  id: string;
  name: string;
  image: string;
}

type WalletsByCountry = {
    [key: string]: Wallet[];
  };

  export const walletsByCountry: WalletsByCountry = {
    EC: [
      {id: 'deuna', name: 'Deuna!', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-deuna.png?alt=media&token=925a1fa2-67c6-4f16-88bb-78457ec294cb'},
      {id: 'payphone', name: 'Payphone', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-payphone.png?alt=media&token=abdda7a0-f061-4b66-b1a2-242c985391c1'},
    ],
    CO: [
      {id: 'nequi', name: 'Nequi', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-nequi.png?alt=media&token=fa9da7fe-8806-42bd-8476-06c98331bafa'},
      {id: 'daviplata', name: 'DaviPlata', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-daviplata.png?alt=media&token=fda521d0-9553-4822-bd60-819862141850'},
      {id: 'dale', name: 'Dale!', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-dale.png?alt=media&token=43366444-a076-4422-a833-deefe5b62434'}
    ],
  }

  export const commonPaymentMethods: Wallet[] = [
    {id: 'credit-card', name: 'Tarjeta', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-creditcard.png?alt=media&token=5084677a-2d7a-4778-a701-c72c1c08be4a'},
    {id: 'cash', name: 'Efectivo', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-cash.png?alt=media&token=8905ed63-ae8c-4920-be64-e7fcb40bbbef'},
    {id: 'transfer', name: 'Transferencia', image: 'https://firebasestorage.googleapis.com/v0/b/qik_feedback/o/wallets%2Ficon-transfer.png?alt=media&token=5d3c22c6-f4f4-4de6-8775-55d2a68de4c7'},

  ] 
  export const walletsIdsByCountry: { [key: string]: [string, ...string[]] } = Object.fromEntries(
    Object.entries(walletsByCountry).map(([country, wallets]) => {
      const ids = wallets.map(wallet => wallet.id);
      return [country, [ids[0], ...ids.slice(1)]]; // Ensure at least one element and include commonPaymentMethods
    })
  )

  export function walletsIdsByCountryWithCommon(country: string): [string, ...string[]] {
    switch (country) {
      case 'EC':
        return [walletsByCountry['EC'][0].id, ...walletsByCountry['EC'].slice(1).map(wallet => wallet.id), ...commonPaymentMethods.map(wallet => wallet.id)];
      case 'CO':
        return [walletsByCountry['CO'][0].id, ...walletsByCountry['CO'].slice(1).map(wallet => wallet.id), ...commonPaymentMethods.map(wallet => wallet.id)];
      default:
        return [commonPaymentMethods[0].id, ...commonPaymentMethods.slice(1).map(wallet => wallet.id)];
    }
  }
